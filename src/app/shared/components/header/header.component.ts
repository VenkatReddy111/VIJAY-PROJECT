import { Component, NgModule, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPopupModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationGroupComponent } from 'devextreme-angular';
import { AuthService } from '../../services';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { NotificationsModule } from '../notifications/notifications.component';
import { DataService } from 'src/app/data.service';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { Router } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HotKeysModule } from '../hot-keys/hot-keys.component';
import { DxiButtonModule, DxiValidationRuleModule, DxiItemModule } from 'devextreme-angular/ui/nested';
import notify from 'devextreme/ui/notify';
import { DxButtonModule } from 'devextreme-angular/ui/button';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @Output()
  menuToggle = new EventEmitter<boolean>();
  @Input()
  menuToggleEnabled = false;
  @Input()
  title: string;
  imagebytes: string;
  hotKeysPopup: boolean = false;
  logoutPopup: boolean = false;
  userArr; user; userId; role; menu;
  ChkMenu: boolean = false;
  userMenuItems: any[] = [];
  changePasswordModal: boolean = false;
  NewPassword: any;
  ConfirmPassword: any;
  OldPassword: any;
  passwordMode: string;
  passwordModes: string;
  passwordModess: string;
  passwordButton: any;
  passwordButtons: any;
  passwordButtonss: any;

  constructor(private authService: AuthService, private route: Router, private service: DataService) {
    
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

  ngOnInit() {
    this.setMenuItems();
    // var settings = this.getAllSettings$();
    if (location.pathname == "/login-form" || location.pathname == "/") {
      this.authService.logOut();
    }
    else {
      return false;
    }
  }

  passwordComparison = () => {
    return this.NewPassword;
  };

  checkComparison() {
    return true;
  }

  logoutProceed() {
    var token = localStorage.getItem('token');
    if (token != undefined && token != '' && token != null) {
      this.authService.SignOut(token).subscribe(
        (data => {
          localStorage.clear();
          this.authService.loggedIn = false;
          this.logoutPopup = false;
          this.route.navigate(['/login-form']);
        }), (error => {
          this.userArr = [];
          this.userArr = error;
        }));
    } else {
      localStorage.clear();
      this.logoutPopup = false;
      this.authService.logOut();
    }
  }

  // getAllSettings$() {
  //   const customsettings$ = this.service.getAll('AppSettingsApi/getallsettings').subscribe(res => {
  //     var response = <any>res;
  //     this.imagebytes = response.filter(x=>x.settingName =="HeaderImage")[0].settingValue;
  //   });
  // }

  toggleMenu = () => {
    this.menuToggle.emit();
  }

  setMenuItems() {
    this.userMenuItems = [{
      text: 'Profile and Settings',
      onClick: () => {
        this.route.navigate(['./profile-settings']);
      }
    },
    {
      text: 'Change Password',
      onClick: () => {
        this.changePasswordModal = true;
      }
    },
    {
      text: 'Logout',
      onClick: () => {
        this.logoutPopup = true;
      }
    }];
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  cancel() {
    this.changePasswordModal = false;
    this.valGroup.instance.reset();
  }

  resetpassword = function (e) {
    var username = localStorage.getItem('userid');
    if (!this.isBlank(this.OldPassword) && !this.isBlank(this.NewPassword) && !this.isBlank(this.ConfirmPassword)) {
      var details = { 'OldPassword': this.OldPassword, 'NewPassword': this.NewPassword, 'UserName': username };
      this.authService.ChangePassword(details).subscribe(data => {
        let response = <any>data;
        if (data) {
          notify({ message: response });
        }
        else {
          notify({ message: "Password changed successfully. login with new password.", type: "btn btn-primary", width: 300, position: { offset: '-40 -250' } });
          this.changePasswordModal = false;
          this.valGroup.instance.reset();
          var token = localStorage.getItem('token');
          if (token != undefined && token != '' && token != null) {
            this.authService.SignOut(token).subscribe(
              (data => {
                localStorage.clear();
                this.authService.loggedIn = false;
                this.route.navigate(['/login-form']);
              }));
          }
        }
      });
    }
    e.preventDefault();
  }

}

@NgModule({
  imports: [
    CommonModule,
    UserPanelModule,
    NotificationsModule,
    DxToolbarModule,
    HotKeysModule,
    PerfectScrollbarModule,
    DxPopupModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxiValidationRuleModule,
    DxValidationGroupModule,
    DxiItemModule,
    DxButtonModule,
    DxiButtonModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }