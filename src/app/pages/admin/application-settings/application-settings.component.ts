import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { map } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';

import { DxValidationGroupComponent, DxDataGridComponent } from 'devextreme-angular';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';
import { AppSettingsField } from 'src/app/models/appsettings.module';
@Component({
  selector: 'app-application-settings',
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.scss']
})

export class ApplicationSettingsComponent extends ComponentbaseComponent implements OnInit {
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  loadIndicatorVisible = false;
  headerList: any;
  childDatasource: any[];
  childkey: string;
  appsettingListArray: any[];
  loggingtypes: string[];
  logmethod: string;
  a: string = "File";
  previousLoggerPath: string;

  constructor(private service: DataService, private message: MessageService) {
    super('Settings', 'Applicationsettings', message, service, environment.apiBaseUrl);
    this.getHeaderList().subscribe(data => {
      this.headerList = data;
    });
    this.loggingtypes = ['Database', 'File'];
    this.logmethod = this.loggingtypes[1];
  }

  changeLogger(e) {
    if (e.value == 'Database') {
      this.a = this.loggingtypes[0];
    }
    else {
      this.a = this.loggingtypes[1];
    }
  }

  ngOnInit() {
  }

  getHeaderList() {
    const headerList = this.service.getAll('AppSettingsApi/GetHeaderList').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'headerName': item.headerName,
      }
    })));
    return headerList;
  }

  RowExpanding(e) {
    this.childkey = e.key;
    this.GetAppsettingfields(e.key);
    e.component.collapseAll(-1);
  }

  RowCollapsing(e) {
  }

  GetAppsettingfields(key) {
    this.appsettingField(key).subscribe(data => {
      this.childDatasource = data;
    });
  }

  appsettingField(headerName) {
    const appfield = this.service.getAll('AppSettingsApi/GetAppsettingField?HeaderName=' + headerName).pipe(map((data: any[]) => data.map((item: any) => {
      if (item.settingName == 'LoggerType') {
        this.logmethod = item.settingValue;
      }
      if (item.settingName == 'LoggerPath') {
        this.previousLoggerPath = item.settingValue;
      }

      return new AppSettingsField(
        item.id,
        item.settingName,
        item.settingValue,
        item.valueType,
        item.settingHeader,
        item.settingLabel,
        item.settingOrder
      )
    })));

    return appfield;
  }

  cancel() {
    this.getHeaderList().subscribe(data => {
      this.headerList = data;
    });
    if (this.childkey != "" && this.childkey != undefined) {
      this.GetAppsettingfields(this.childkey);
    }
    this.valGroup.instance.reset();
    this.dataGrid.instance.collapseAll(-1);
  }

  fromAppsettingDTO(data) {
    this.appsettingListArray = [];
    for (let i = 0; i < data["length"]; i++) {
      const oB = data[i];
      var Appparameter = {
        'Id': oB.id,
        'SettingName': oB.settingName,
        'SettingValue': oB.settingValue,
        'ValueType': oB.valueType,
        'SettingHeader': oB.settingHeader,
        'SettingLabel': oB.settingLabel,
        'SettingOrder': oB.settingOrder
      };
      this.appsettingListArray.push(Appparameter);
    }
    return this.appsettingListArray;
  }

  AppSettingSave() {
    if (this.childDatasource[0].settingName == 'LoggerType') {
      if (this.childDatasource[1].settingValue == '') {
        this.childDatasource[1].settingValue = this.previousLoggerPath;
      }
      this.childDatasource[0].settingValue = this.logmethod;
    }
    var appsettingValue = this.fromAppsettingDTO(this.childDatasource);
    const put$ = this.service.put('AppSettingsApi/saveappsettings', appsettingValue);
    put$.subscribe(data => {
      notify(data['result'].value);
      this.GetAppsettingfields(this.childkey);
      this.loggingtypes = ['Database', 'File'];
    }, err => {
      notify(err.toString());
    }
    );
    this.dataGrid.instance.collapseAll(-1);
  }

}