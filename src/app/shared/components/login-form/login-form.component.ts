import { Component, NgModule, Inject, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, PlatformLocation } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DxValidationGroupComponent, DxFormComponent, DxPopupModule, DxLoadPanelModule } from 'devextreme-angular';
import { AuthService, AppInfoService } from '../../services';
import { MessageService } from 'src/app/message.service';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent {
  @ViewChild("formVar", { static: false }) form: DxFormComponent;
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @ViewChild('valGroups', { static: false }) valGroups: DxValidationGroupComponent;
  Username = '';
  Password = '';
  loadingVisible: boolean = false;
  OldPassword: any;
  NewPassword: any;
  ConfirmPassword: any;
  confirmMsg: string = '';
  confirmPopupVisible = false;
  confirmLoginPopupVisible = false;
  passwordMode: string;
  passwordModes: string;
  passwordModess: string;
  passwordButton: any;
  passwordButtons: any;
  passwordButtonss: any;

  constructor(private authservice: AuthService, public appInfo: AppInfoService, private router: Router, @Inject(DOCUMENT) private document: any, ptlocation: PlatformLocation, private _message: MessageService) {
    this.passwordMode = 'password';
    this.passwordButton = {
      icon: "assets/images/view.png",
      type: "default",
      onClick: () => {
        this.passwordMode = this.passwordMode === "text" ? "password" : "text";
      }
    };
    this.passwordModes = 'password';
    this.passwordButtons = {
      icon: "assets/images/view.png",
      type: "default",
      onClick: () => {
        this.passwordModes = this.passwordModes === "text" ? "password" : "text";
      }
    };
    this.passwordModess = 'password';
    this.passwordButtonss = {
      icon: "assets/images/view.png",
      type: "default",
      onClick: () => {
        this.passwordModess = this.passwordModess === "text" ? "password" : "text";
      }
    };
  }

  passwordComparison = () => {
    return this.NewPassword;
  };

  checkComparison() {
    return true;
  }

  ngOnInit() {
    localStorage.removeItem('token');
    var token = localStorage.getItem('token');
  }

  onShown = function (e) {
    e.component.content().children[0].children[1].children[1].focus();
  }

  onInitialized(e) {
    e.component.registerKeyHandler("enter", ea => {
      this.continue(e);
    });
  }

  onInitializedNo(e) {
    e.component.registerKeyHandler("enter", ea => {
      this.cancel();
    });
  }

  setfocusmusername(e) {
    window.setTimeout(function () { e.component.focus(); });
  }

  login = function (e) {
    if (!this.isBlank(this.Username) && !this.isBlank(this.Password)) {
      var auth = this.navigation(window.btoa(this.Username + ':' + this.Password), this.Username);
      this.authservice.ValidateUser(auth).subscribe(data => {
        var response: any;
        response = this.authservice.handleLoginResponse(data);
        if (response.Code == 200) {
          localStorage.setItem('UserName', this.Username);
          this.document.location.href = '/dashboard';
          return;
        }
        if (response.Code == 409) {
          this.conf();
          this.openConfirmPopup();
          return;
        }
        else if (response.Message == "IsFirstLogin") {
          this.confirmLoginPopupVisible = true;
          return;
        }
        else {
          notify({ message: response.Message, type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        }
      },
        err => {
          localStorage.clear();
          notify({ message: "The username or password is incorrect. Please try again.", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        })
    }

    else {
      if (this.isBlank(this.Username) && this.isBlank(this.Password)) {
        notify({ message: "Username and password fields cannot be blank", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        return;
      }
      if (this.isBlank(this.Username)) {
        notify({ message: "Please enter Username", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        return;
      }
      if (this.isBlank(this.Password)) {
        notify({ message: "Please enter Password", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        return;
      }
      return true;
    }
    e.preventDefault();
  }

  formData = {}
  form_fieldDataChanged(e) {
    this.formData = e.component.option("formData");
  }

  form_fieldResetDataChanged(e) {
    this.formData = e.component.option("formData");
  }

  navigation(data: string, uname: string) {
    var res = data.substr(0, 10);
    var res2 = data.substr(10, (data.length - 12));
    var res3 = data.substr(data.length - 2, 2);
    return 'Basic ' + window.btoa(res + uname[0].toUpperCase() + res2 + uname[0].toUpperCase() + res3);
  }

  openConfirmPopup() {
    this.confirmPopupVisible = true;
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  resetpassword(args) {
    if (args.validationGroup.validate().isValid) {
      let input: FormData = new FormData();
      input.append('OldPassword', this.Password);
      input.append('NewPassword', this.NewPassword);
      input.append('Username', this.Username);
      this.authservice.ResetPassword(input).subscribe(data => {
        let response = <any>data;
        if (data !== "") {
          notify({ message: response });
        }
        else {
          notify({ message: "Password changed successfully. login with new password.", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
          this.confirmLoginPopupVisible = false;
          this.valGroups.instance.reset();
          this.valGroup.instance.reset();
          var token = localStorage.getItem('token');
          if (token != undefined && token != '' && token != null) {
            this.authservice.SignOut(token).subscribe(
              (data => {
                localStorage.clear();
                this.authservice.loggedIn = false;
                this.router.navigate(['/login-form']);
              }));
          }
        }
      });
    }
  }

  forgotPassword() {
    if (this.Username === undefined || this.Username === '') {
      this.valGroups.instance.reset();
      notify({ message: "Username is required.", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
      return;
    }
    else {
      this.authservice.SendResetPasswordMail(this.Username).subscribe(data => {
        let response = <any>data;
        notify({ message: response, type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
        this.valGroups.instance.reset();
      });
    }
  }

  conf() {
    this._message.setPageHeading('Confirm');
    this.confirmMsg = localStorage.getItem('ConfirmUserSession');
  }

  cancel() {
    this.confirmPopupVisible = false;
    this.confirmLoginPopupVisible = false;
  }

  Cancel() {
    this.confirmLoginPopupVisible = false;
    this.valGroup.instance.reset();
    this.valGroups.instance.reset();
  }

  continue(e) {
    var auth = localStorage.getItem('ConfirmUserSessionData');
    localStorage.removeItem('ConfirmUserSessionData');
    this.authservice.ValidateUser(auth, true).subscribe(data => {
      var response: any;
      response = this.authservice.handleLoginResponse(data);
      if (response.Code == 200) {
        this.document.location.href = '/dashboard';
      }
      else {
        localStorage.setItem('LicenseError', response.Message);
        this.document.location.href = '/conflict-error';
        localStorage.clear();
      }
    }, (err => {
      localStorage.clear();
      if (err.originalError.Message != undefined && err.originalError.Message != null && err.originalError.Message != '') {
        //this.errorMsg = err.originalError.Message;
        localStorage.setItem('LicenseError', err.originalError.Message);
        this.document.location.href = '/conflict-error';
      } else {
        this.document.location.href = '/default-error';
      }
    }));
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxPopupModule,
    DxLoadPanelModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent]
})


export class LoginFormModule { }
