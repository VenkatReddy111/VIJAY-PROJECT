import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxTabPanelModule, DxTextBoxModule, DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxFormModule, DxPopupModule, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { map, concat, merge, tap } from 'rxjs/operators';
import { SmtpconfigurationModule } from '../../../models/smtpconfiguration.module';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SMTPComponent extends ComponentbaseComponent implements OnInit {

  smtps = [];
  isconnected: any;
  // isFirstTimeLoad : boolean = true;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;

  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;



  value: any[] = [];

  //Variable to maintain delete state of rows
  selectedItemKeys: any[] = [];
  tempDeleteArray: ArrayStore;

  //Variable to show/hide custom buttons
  deleteBtn: boolean = false;
  editBtn: boolean = false;
  addBtn: boolean = true;


  showteststatus = true;
  inProgress = false;
  seconds = 10;
  maxValue = 10;
  intervalId: number;
  TextConnection = '';
  showLoader: boolean = false;
  testConnectionCheck: boolean = false;
  // cancelButtonOptions = {
  //   text: "Cancel",

  // }

  // createButtonOptions = {
  //   text: "Create",
  //   onClick: function () {

  //   }
  // }

  SmtpField: SmtpconfigurationModule;
  loadingVisible: boolean = false;
  passwordMode: string;
  passwordButton: any;

  constructor(private router: Router, private service: DataService, private message: MessageService) {
    super('Mails', 'SMTPsettings', message, service, environment.apiBaseUrl);
    this.SmtpField = this.initModel();
    this.getSmtps$().subscribe(data => {
      this.smtps = data;
      for (var i = 0; i < this.smtps.length; i++) {
        if (this.smtps[i]["fileAttachLimit"] != undefined) {
          this.smtps[i]["fileAttachLimit"] = this.smtps[i]["fileAttachLimit"].toString()
        }
      }
    });
    this.isconnected = false;
    this.passwordMode = 'password';
    this.passwordButton = {
      icon: "assets/images/view.png",
      type: "default",
      onClick: () => {
        this.passwordMode = this.passwordMode === "text" ? "password" : "text";
      }
    };
  }

  ngOnInit() {

  }



  //Mock JSON
  smtpTable = [
    {
      "server": "190.168.1.200",
      "port": "8080",
      "isSSL": "Active",
      "uName": "truecapuser234",
      "isDefault": "Active",
      "attachLimit": "5",
      "fromMailId": "trucapuser1234@gmail.com",
    }
  ];


  getSmtps$() {
    const smtps$ = this.service.getAll('SettingSmtpApi').pipe(map((data: any[]) => data.map((item: any) => {
      return new SmtpconfigurationModule(item.id, item.smtpserver, item.port, item.isSsl, item.userName, item.password, item.isDefault, item.fileAttachLimit, item.alertEmailId, item.displayName, item.fromMailId);
    })));
    return smtps$;
  }


  //Function to show/hide custom buttons
  onSelectionChanged(event) {
    //this.isFirstTimeLoad = false;
    //To show/hide Delete and Duplicate buttons: If more than 0 checked appears

    this.selectedItemKeys = event.selectedRowKeys;
    if (event.selectedRowsData.length > 0) {

      this.deleteBtn = true;
      this.editBtn = true;
      this.addBtn = false;
    }
    else {

      this.deleteBtn = false;
      this.editBtn = false;
      this.addBtn = true;
    }
    //To hide Duplicate button: If more than 1 checked appears
    if (event.selectedRowsData.length > 1) {
      this.editBtn = false;
      this.deleteBtn = true;
      this.addBtn = false;
    }
  }



  // Convert Active/Inactive into True/False for toggle button
  isUserActive(isActive: string) {
    if (isActive == 'Active') {
      return true;
    } else {
      return false;
    }
  }

  isSSLUpdate(rowjobstatus, $data) {
    debugger;
    $data.isSsl = rowjobstatus ? false : true;
    const smpt = this.formDto($data);
    const put$ = this.service.put('SettingSmtpApi/updatesettingSmtp', smpt);
    put$.subscribe(
      data => {
        this.getSmtps$().subscribe(a => { this.smtps = a; });
        this.dataGrid.instance.clearSelection();
        notify('Status changed successfully.');
      }, err => { notify('Logged in user does not have permission to update status.'); }
    );
  }


  isDefaultUpdate(rowjobstatus, $data) {
    debugger;
    $data.isDefault = rowjobstatus ? false : true;
    const smpt = this.formDto($data);
    const put$ = this.service.put('SettingSmtpApi/updatesettingSmtp', smpt);
    put$.subscribe(
      data => {
        this.getSmtps$().subscribe(a => { this.smtps = a; });
        notify('Status changed successfully.');
      }, err => { notify('Logged in user does not have permission to update status.'); }
    );
  }

  deleteRecords() {
    var a = this.selectedItemKeys.length;
    for (var i = 0; i < a; i++) {
      this.SmtpField = this.selectedItemKeys[i];
      this.isDefaultUpdate(this.SmtpField.isDefault, this.SmtpField);
    }
    this.getSmtps$().subscribe();
  }

  //Function to edit rows
  popupVisible = false;
  getRowIndex: number = 0;
  customEditPopup(b) {

    this.getRowIndex = b;
    this.popupVisible = true;
  }

  //Function to delete rows
  //   deleteRecords() {
  //     this.SmtpField = this.selectedItemKeys[0];
  //     const smpt = this.formDto(this.SmtpField);
  //     const delete$ = this.service.delete('SettingSmtpApi/deletesettingSmtp', smpt);
  //     delete$.subscribe(
  //       data => {
  //         notify(data['result'].value);
  //         this.showAddPopop = false;
  //         this.getSmtps$().subscribe(a => { this.smtps = a; });
  //       }, err => { notify('Error'); }
  //     );
  //     this.dataGrid.instance.refresh();
  // }


  showAddPopop: boolean = false;
  addPopup() {
    this.SmtpField = this.initModel();
    this.showAddPopop = true;
    this.TextConnection = "";
    this.showLoader = false;
    this.passwordMode = "password";
  }

  initModel() {
    return new SmtpconfigurationModule(0, '', '', false, '', '', false, 0, '', '', '');
  }
  ClearSubtypeModel() {
    this.showAddPopop = false;
    // this.popupVisible = false;
    if (this.SmtpField = this.initModel()) {
      this.getSmtps$().subscribe(a => { this.smtps = a; });
    }
    this.SmtpField = this.initModel();
    this.valGroup.instance.reset();
    var a = this.selectedItemKeys[0];
  }

  save() {
    this.showLoader = false;
    this.showteststatus = true;
    if (this.testConnectionCheck == false) {
      notify('Kindly check Test connection');
      return true;
    }
    else {
      if (this.SmtpField.id === 0) {

        const smpt = this.formDto(this.SmtpField);
        const post$ = this.service.postAll('SettingSmtpApi/savesettingSmtp', smpt);
        // const final$ = post$.pipe();
        // const attribute$ = this.getSmtps$().subscribe(a => { this.smtps = a; });
        // const final$ = post$.pipe(concat(attribute$));
        post$.subscribe(
          data => {
            notify(data['result'].value);
            this.showAddPopop = false;
            this.getSmtps$().subscribe(a => { this.smtps = a; });
            this.testConnectionCheck =false;
          }, err => { notify('Error');
          this.testConnectionCheck =false; }
        );
      } else {
        debugger;
        this.showLoader = false;
        const smpt = this.formDto(this.SmtpField);
        const put$ = this.service.put('SettingSmtpApi/updatesettingSmtp', smpt);
        // const attribute$ = this.getSmtps$().subscribe(a => { this.smtps = a; });
        // const final$ = put$.pipe(concat(attribute$));
        put$.subscribe(
          data => {
            notify(data['result'].value);
            this.showAddPopop = false;
            this.getSmtps$().subscribe(a => { this.smtps = a; });
            this.testConnectionCheck =false;
          }, err => { notify('Error');
          this.testConnectionCheck =false; }
        );
      }
    }
  }

  formDto($data) {
    const row = <SmtpconfigurationModule>$data;
    return {
      'Id': row.id,
      'Smtpserver': row.smtpserver,
      'Port': row.port,
      'IsSsl': row.isSsl,
      'UserName': row.userName,
      'Password': row.password,
      'IsDefault': row.isDefault,
      'FileAttachLimit': row.fileAttachLimit,
      'AlertEmailId': row.alertEmailId,
      'DisplayName': row.displayName,
      'FromMailId': row.fromMailId,
    };
  }

  edit() {
    this.SmtpField = this.selectedItemKeys[0];
  }

  SMTPTestConnection() {
    this.showteststatus = true;
    const smtpconnectStatus = false;
    //region for test smtp connection 
    if (this.inProgress) {
      this.TextConnection = 'Continue connecting';
      window.clearInterval(this.intervalId);
    } else {
      this.TextConnection = 'Stop connecting';
      if (this.seconds === 0) {
        this.seconds = 10;
      }
      this.intervalId = window.setInterval(() => this.decreasetimer(), 1000);
    }
    this.inProgress = !this.inProgress;
    //region for test smtp connection 

  }

  decreasetimer() {
    this.seconds--;
    if (this.seconds == 0) {
      this.TextConnection = 'Restart Connecting';
      this.inProgress = !this.inProgress;
      this.showteststatus = false;
      window.clearInterval(this.intervalId);
      return;
    }
  }

  testconnection() {
    this.loadingVisible = true;
    const smpt = this.formDto(this.SmtpField);
    //const post$ = this.service.postAll('SettingSmtpApi/TestSMTPServerConnection', smpt);
    const post$ = this.service.postAll('SettingSmtpApi/TestSMTPConnectionn', smpt);
    post$.subscribe(
      data => {
        this.loadingVisible = false;
        if (data == true) {
          this.TextConnection = "Connected Successfully.";
          notify('Connection Successfully');
          this.showLoader = false;
          this.testConnectionCheck =true;
        }
        else {
          this.TextConnection = "Connection failed."
          this.showLoader = false;
          this.testConnectionCheck =false;
        }

      }, err => {
        this.loadingVisible = false;
        notify('Connection failed');
        this.TextConnection = err.replace('Error:', '');
        this.showLoader = false;
        this.testConnectionCheck =false;
      }
    );
    //this.loadingVisible = false;
  }

}
