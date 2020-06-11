import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.module';
import { DataService } from 'src/app/data.service';
import { Role } from 'src/app/models/role.module';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AuthService } from 'src/app/shared/services';
import { DxValidationGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

export class ProfileSettingsComponent implements OnInit {
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  userfield: any;
  userrole: any;
  docSubuserModel: User;
  docSubroleModel: Role;
  permission = [];
  notifications: any[] = [];
  popupcancelVisible: false;
  NewPassword: any;
  ConfirmPassword: any;
  OldPassword: any;
  passwordMode: string;
  passwordModes: string;
  passwordModess: string;
  passwordButton: any;
  passwordButtons: any;
  passwordButtonss: any;

  constructor(private router: Router, private service: DataService, private authservice: AuthService, ) {
    var sendPrm = '?id=' + localStorage.getItem('UserCode');
    this.service.getAll('Account/GetUserDetails', sendPrm).subscribe(resp => this.userfield = resp);
    this.service.getAll('Account/GetRolesById', sendPrm).subscribe(rrsl => this.userrole = rrsl[0].Name);
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

  setFocus(e) {
    setTimeout(() => {
      e.component.focus();
    }, 0);
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  changePasswordModal: boolean = false;
  changePassword() {
    this.changePasswordModal = true;
  }

  initDocumentuserModel() {
    return new User(0, '', '', '', '', '', true, false, '', new Date(), new Date(), null, 0, '', '', false);
  }

  initDocumentRoleModel() {
    return new Role(0, '', true, '', 0, this.permission, 0);
  }

  Cancel() {
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.changePasswordModal = false;
    this.valGroup.instance.reset();
  }

  resetpassword(args) {
    var username = localStorage.getItem('userid');
    if (args.validationGroup.validate().isValid) {
      var details = { 'OldPassword': this.OldPassword, 'NewPassword': this.NewPassword, 'UserName': username };
      this.authservice.ChangePassword(details).subscribe(data => {
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

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  reset() {
    this.popupcancelVisible = false;
    this.userfield = this.initDocumentuserModel();
    this.userrole = this.initDocumentRoleModel();
    this.userrole = null;
  }

  save() {
    //   console.log(this.model);
    //   this.model.IsActive = this.IsActive;

    //   if (this.model.Id === 0) {
    //     console.log(this.formDtoU(this.model));

    //     const post$ = this.service.postAll('Account/AddUser', this.formDtoU(this.model));
    //     post$.subscribe(
    //       data => {
    //         this.openEditorPopup = false;
    //         const notifydata = data;
    //         this.users$().pipe(map(x => { this.users = x; }));
    //         notify(notifydata);
    //         this.roles$().subscribe();
    //         this.users$().subscribe();
    //       }, err => {
    //         notify('Error');
    //         this.roles$().subscribe();
    //         this.users$().subscribe();
    //       }
    //     );
    //   } else {
    //     console.log(this.formDtoU(this.model));
    //     const put$ = this.service.put('Account/UpdateUser', this.formDtoU(this.model));
    //     put$.subscribe(
    //       data => {
    //         const notifydata = data;
    //         this.openEditorPopup = false;
    //         this.users$().pipe(map(x => { this.users = x; }));
    //         notify(notifydata);
    //         this.roles$().subscribe();
    //         this.users$().subscribe();
    //       }, err => {
    //         notify('Error');
    //         this.roles$().subscribe();
    //         this.users$().subscribe();
    //       }
    //     );
    //   }
    //   this.addInputSourcePopop = false;
    //   this.addInputSourcePopops = false;
    // }
  }
}