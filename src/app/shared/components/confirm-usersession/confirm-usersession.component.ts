import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../../message.service';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-confirm-usersession',
  templateUrl: './confirm-usersession.component.html',
  styleUrls: ['./confirm-usersession.component.scss']
})
export class ConfirmUsersessionComponent implements OnInit {

  @Output() outputCloseConfirmSessionPopup = new EventEmitter<string>();

  confirmMsg: string = '';
  loadingVisible: boolean = false;
  //errorMsg: string = '';

  constructor(private _message: MessageService, private router: Router, private authservice: AuthService, @Inject(DOCUMENT) private document: any) { } 

  ngOnInit() {
    this._message.setPageHeading('Confirm');
    this.confirmMsg = localStorage.getItem('ConfirmUserSession');    
  }

  cancel(){
    localStorage.clear();
    //this.router.navigate(['/login']);
    this.outputCloseConfirmSessionPopup.emit('');
  }

  continue(){
    this.showLoading();
    var auth = localStorage.getItem('ConfirmUserSessionData');
    localStorage.removeItem('ConfirmUserSessionData');

    this.authservice.ValidateUser(auth, true).subscribe(data => {

      //localStorage.setItem('UserName', formData.Username);

      var response: any;

      response = this.authservice.handleLoginResponse(data);

      if (response.Code == 200) {
        this.document.location.href = '/dashboard';
      }
      else 
      {                    
          localStorage.setItem('LicenseError', response.Message);
          this.document.location.href = '/conflict-error';
          localStorage.clear();
      }      
      this.hideLoading();
    }, (err => {
      localStorage.clear();
      if(err.originalError.Message != undefined && err.originalError.Message != null && err.originalError.Message != '') {
        //this.errorMsg = err.originalError.Message;
        localStorage.setItem('LicenseError', err.originalError.Message);
        this.document.location.href = '/conflict-error';
      }else{
        this.document.location.href = '/default-error';
      }
      this.hideLoading();
    }));
  }

  showLoading() {
    this.loadingVisible = true;
  }

  hideLoading() {
    this.loadingVisible = false;
  }

}
