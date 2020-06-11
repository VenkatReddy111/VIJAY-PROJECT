import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { BadInput, NotFoundError, AppError } from 'src/app/data.service';
@Injectable()


export class AuthService {
  loggedIn = true;
  baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient, private route: Router) { }

  logIn() {
    this.loggedIn = true;
    this.route.navigate(['/login-form']);
  }

  logOut() {
    this.loggedIn = false;
    this.route.navigate(['/login-form']);
  }

  SignOut(token) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };
    return this.http
      .post(this.baseUrl + "Account/LogOut", null, options) //JSON.stringify(token)
      .pipe(map(response => (response)
        , catchError(this.handleError))
      );
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

  SendResetPasswordMail(usernmae: string) {
    let myAppUrl = this.baseUrl + "Account/SendResetPassowrdMail?userName=" + usernmae;
    return this.http.get(myAppUrl)
      .pipe(
        map(
          response => <Response>response
        ),
        catchError(this.handleError)
      );
  }

  IsFirstLogin(usernmae: string) {
    let myAppUrl = this.baseUrl + "Account/IsFirstLogin?userName=" + usernmae;
    return this.http.get(myAppUrl)
      .pipe(
        map(
          response => <Response>response
        ),
        catchError(this.handleError)
      );
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return throwError(new BadInput(error.json()));
      return Observable.throw(new BadInput(error.json()));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError());
      return Observable.throw(new NotFoundError());
      return throwError(new AppError(error));
    }
  }


  ValidateUser(auth, isConfirmed = false) {
    var token = '';
    if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null) {
      token = localStorage.getItem('token');
    }
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': auth,
      'X-CONFIRMSESSION': isConfirmed.toString(),
      'X-TOKEN': token
    });
    //'Access-Control-Allow-Origin':'*'
    let options = {
      headers: httpHeaders,
    };
    return this.http.post(this.baseUrl + "Account/AdLogin", null, options)
      .pipe(
        map(
          response => {
            var res: any = response;
            if (res.Code === 409) {
              localStorage.setItem('ConfirmUserSessionData', auth);
            }
            return response;
          }
        ),
        catchError(this.handleError)
      );
  }

  refreshToken(token) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    });
    let options = {
      headers: httpHeaders
    };
    return this.http.post(
      this.baseUrl + "Account/RefreshToken",
      null, options
    ).pipe(
      map(
        response => {
          this.setLocalStorage(response);
          return response;
        }
      ),
      catchError(this.handleRefreshTokenError));
  }

  setLocalStorage(response: any) {
    if (response.Code == 200) {
      localStorage.setItem('token', response.Token);
      localStorage.setItem('userclaims', window.btoa(JSON.stringify(response.userclaims)));
    } else if (response.Code === 409) {
      localStorage.setItem('LicenseError', response.Message);
      this.route.navigate(['/conflict-error']);
    } else {
      this.handleRefreshTokenError(null);
    }
  }

  updateStats() {
    let myAppUrl = this.baseUrl + "Account/updateStats";
    return this.http.get(myAppUrl)
      .pipe(
        map(
          response => <Response>response
        ),
        catchError(this.handleError)
      );
  }

  handleLoginResponse(data) {
    var response: any;
    response = data;
    if (response.Code == 200) {
      localStorage.clear();
      this.setClaim(response.userclaims);
      localStorage.setItem('token', response.Token);
      window.localStorage.setItem('UserCode', response.UserCode);
      localStorage.setItem('Md', response.PermittedModule);
      //localStorage.setItem('userclaims',response.userclaims);
      localStorage.setItem('userrole', response.RoleName);
      localStorage.setItem('userid', response.Username);
    } else if (response.Code === 409) {
      localStorage.setItem('ConfirmUserSession', response.Message);
    }
    return response;
  }

  setClaim(claims: string) {
    localStorage.setItem('userclaims', window.btoa(JSON.stringify(claims)));
  }

  public ResetPassword(details) {
    let httpHeaders = new HttpHeaders({
      'Accept': "multipart/form-data",
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Basic ' + details.get('OldPassword') + ':' + details.get('NewPassword') + ':' + window.btoa(details.get('Username'))
    });
    let options = {
      headers: httpHeaders
    };
    return this.http.post(this.baseUrl + "Account/ResetPassword", details, options)
      .pipe(map(response => (response), catchError(this.handleError)));
  }

  public ChangePassword(details) {
    return this.http.post(this.baseUrl + "Account/ChangePassword", details)
      .pipe(map(response => (response), catchError(this.handleError)));
  }


  private handleRefreshTokenError(error: Response) {
    var token = localStorage.getItem('token');
    localStorage.clear();
    this.SignOut(token).subscribe(res => {
      localStorage.clear();
    });
    this.route.navigate(['/login']);
    return throwError(new AppError(error));
  }

  public GetUserAccess(usrtoken, ModuleName) {
    let httpHeaders = new HttpHeaders({
      'Accept': "multipart/form-data",
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    let options = {
      headers: httpHeaders
    };
    let input: FormData = new FormData();
    input.append('Token', usrtoken);
    input.append('ModuleName', ModuleName);
    return this.http
      .post(this.baseUrl + "Account/GetClaims", input, options)
      .pipe(map(response => (response)
        , catchError(this.handleError))
      );
  }

  async IsFirstLoginAsync(usernmae: string): Promise<any> {
    let myAppUrl = this.baseUrl + "Account/IsFirstLogin?userName=" + usernmae;
    return this.http.get(myAppUrl)
      .pipe(
        map(
          response => <Response>response
        ),
        catchError(this.handleError)
      );
  }
}

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var token = localStorage.getItem('token');
    if (token == null || token == undefined) {
      this.authService.logOut();
      return false;
    }
    return true;
  }
}