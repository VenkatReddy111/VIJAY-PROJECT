import { AuthService } from '../services/auth.service';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class HttpConfigInterceptor implements HttpInterceptor {

    private _refreshSubject: Subject<any> = new Subject<any>();

    constructor(private authservie: AuthService, private route: Router, @Inject(DOCUMENT) private document: any, ) { }

    private HandleExpired401() {
        this._refreshSubject.subscribe({
            complete: () => {
                this._refreshSubject = new Subject<any>();
            }
        });
        if (this._refreshSubject.observers.length === 1 && localStorage.getItem('token') != null) {
            this.authservie.refreshToken(localStorage.getItem('token')).subscribe(this._refreshSubject);
        }
        return this._refreshSubject;
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(this.addAuthenticationToken(req)).pipe(
            catchError((err, caught) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        return this.HandleExpired401().pipe(
                            switchMap(() => {
                                const accessToken = localStorage.getItem('token');
                                if (accessToken) {
                                    return next.handle(this.addAuthenticationToken(req));
                                }
                            })
                        );
                    } else if (err.status === 409) {
                        localStorage.setItem('conflictError', err.error);

                        this.authservie.logOut();
                    } else {
                        if (err.status === 403) { // Forbidden
                            this.route.navigate(['/default-error']);
                        }

                        if (err.status === 500) { // Internal Server Error
                           
                            var token = localStorage.getItem('token');
                            if(token != null && token != undefined && token != 'undefined' && token != '') {
                                this.authservie.SignOut(token).subscribe(res => {
                                    localStorage.clear();
                                    return EMPTY;
                                },err=> {
                                 
                                    localStorage.clear();
                                    return EMPTY;
                                });
                            }
                            this.route.navigate(['/default-error']);
                            localStorage.clear();
                            return EMPTY;
                        }
                        if (err.status === 0) {
                            return EMPTY;
                        }
                        return throwError(err);
                    }
                }
                return caught;
            })
        );

    }


    addAuthenticationToken(request) {
        // Get access token from Local Storage
        const accessToken = localStorage.getItem('token');

        if (accessToken && (request.url.toLowerCase().indexOf('adlogin') < 0 && request.url.toLowerCase().indexOf('resetpassword') < 0)) {
            return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + accessToken) });
        }
        return request;
    }
}
