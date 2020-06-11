import { StageDetail } from './../../../models/user-productivity.module';
import { debug, isUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { DocumentDashboardModel, DocumentTypeDashboardModel, AllocatedUserModel, DocumentNextActionModel } from 'src/app/models/operationalmanagerdashboard.module';
import { map, concat, merge, tap, filter, single, reduce, mergeMap, groupBy, toArray } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operational-manager-dashboard',
  templateUrl: './operational-manager-dashboard.component.html',
  styleUrls: ['./operational-manager-dashboard.component.scss']
})
export class OperationalManagerDashboardComponent extends ComponentbaseComponent implements OnInit {

  // @ViewChild('MonitorGrid', { static: false }) MonitorGrid: DxDataGridComponent;

  //To initialize document type and sub type data for filter selection
  saveResults: any;
  documentTypeList: any;
  documentSubTypeList: any;

  //To initialize opening balance and received document count - Dashboard card 1
  docopeningBalance: number;
  docReceived: number;
  totalDocumentList: any[] = [];

  //To initialize document type count - Dashboard card 2
  documentTypeCountList: any[] = [];
  totalDocumentType: number;

  //To initialize stage wise document count - Dashboard card 3
  documentAllocationList: any[] = [];

  //To initialize Active users list
  userList: any[] = [];

  /*To initialize Alerts list 
  TBD - as per discussion as of now alerts module will be on hold 
  so we have shown Audit Trail msgs*/
  alertsList: any[] = [];

  //To inialize document monitor count list
  documentMonitorList: any[] = [];

  //To inialize document monitor detail list - document wise
  documentmonitorDetails: any[];
  documentmonitorDetailsToShow: any[];
  documentModel: any;

  //To initialize subtypelist on pie chart drill down
  documentSubTypeListForPie: any[] = [];

  //For dynamic grid binding
  dynamicdata: any[] = [];

  startDatetime: any;
  endDatetime: any;

  documentViewer: any;
  documentPhysicalPath: string = '';
  documentNextActionModel: DocumentNextActionModel;
  currentPageURL:string;

  constructor(private router: Router, private service: DataService, private message: MessageService) {
    super('Operations Dashboard', 'Operationsdashboard', message, service, environment.apiBaseUrl);
    // Todays date selected
    this.selected = {
      startDate: moment(),
      endDate: moment()
    }
    //this.riskSLA="Y";
    this.currentPageURL=this.router.url; //set current page URL 

    //set defult date time on page load 
    this.startDatetime = this.selected.startDate.format("YYYY-MM-DD");
    this.endDatetime = this.selected.endDate.format("YYYY-MM-DD");

    var startTime = this.selected.endDate.format("HH:mm");
    var endTime = this.selected.endDate.format("HH:mm")

    if (startTime == endTime) {
      startTime = "00:00";
      endTime = "23:59";

      this.startDatetime = this.startDatetime + " " + startTime;
      this.endDatetime = this.endDatetime + " " + endTime;
    }
    this.Getdocumenttypelist().subscribe(data => { this.documentTypeList = data.filter((i) => i.isActive == true); });
    this.GetDashboardTotalDocumentCount(0, 0);
    this.GetDashboardDocumentTypes(0, 0);
    this.GetDashboardDocumentAllocationCount();
    this.GetAllocatedUsers();
    this.GetAlertsForDashboard(0, 0);
    //for dynamic binding - document monitor data grid
    this.GetDocumentMonitorForDashboardDynamicData(0, 0);
    this.GetDocumentMonitorDetailListForDashboard(0,0);
  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  ngOnInit() {
    //this.GetDocumentTypes();           
  }

  //Datepicker
  selected: { startDate: moment.Moment, endDate: moment.Moment };
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }


  //Set Start and end date
  SetStartEnddate() {
    try {
      this.startDatetime = this.selected.startDate.format("YYYY-MM-DD");
      this.endDatetime = this.selected.endDate.format("YYYY-MM-DD");

      var startTime = this.selected.endDate.format("HH:mm");
      var endTime = this.selected.endDate.format("HH:mm")
      if (startTime == endTime) {
        startTime = "00:00";
        endTime = "23:59";

        this.startDatetime = this.startDatetime + " " + startTime;
        this.endDatetime = this.endDatetime + " " + endTime;
      }
    }
    catch{
    }
  }
  //To get the documenttypes  
  Getdocumenttypelist() {
    const documentlist = this.service.getAll('inputsourceapi/GetDocumentType').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'documentTypeId': item.id,
        'documentTypeName': item.name,
        'isActive': item.isActive
      }
    })));
    return documentlist;
  }

  //To get document subtypes
  defaultsubtype: any;
  OnDocumentTypeSelectionChange(e) {
    const sendPrm = '?doctypeid=' + e.value;
    if (e.value != null) {
      this.totalDocumentList = [];
      this.documentTypeCountList = [];
      //this.dynamicdata = [];      
      this.GetDocumentsubtype$(sendPrm).subscribe(data => {
        this.documentSubTypeList = data.filter((i) => i.isActive == true);
        if (this.documentSubTypeList.length == 1) {
          this.defaultsubtype = this.documentSubTypeList[0].documentSubTypeId;
          this.GetDashboardTotalDocumentCount(e.value, this.defaultsubtype);
          this.GetDashboardDocumentTypes(e.value, this.defaultsubtype);
          this.GetDocumentMonitorForDashboardDynamicData(e.value, this.defaultsubtype);
          this.GetDocumentMonitorDetailListForDashboard(e.value, this.defaultsubtype);
        }
        else {
          this.GetDashboardTotalDocumentCount(e.value, 0);
          this.GetDashboardDocumentTypes(e.value, 0);
          this.GetDocumentMonitorForDashboardDynamicData(e.value, 0);
          this.GetDocumentMonitorDetailListForDashboard(e.value, 0);
        }
      });
    } else {
      this.documentSubTypeList = [];
      this.GetDocumentMonitorForDashboardDynamicData(0, 0);
      this.GetDocumentMonitorDetailListForDashboard(0, 0);
    }
  }

  //To get the documentsubtypes  
  GetDocumentsubtype$(sendprm) {
    return this.service.getAll('inputsourceapi/Getdocumentsubtype', sendprm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return {
          'documentSubTypeId': item.id,
          'documentSubTypeName': item.name,
          'isActive': item.isActive
        };
      })));
  }

  //On sub type selection
  OnDocumentSubTypeSelectionChange(e) {
    var documentTypeId;
    if ($("#selectboxdocumentType input").val() == undefined || $("#selectboxdocumentType input").val() == '') {
      documentTypeId = 0;
    }
    else {
      documentTypeId = $("#selectboxdocumentType input").val();
    }
    if (e.value != null) {
      this.totalDocumentList = [];
      this.GetDashboardTotalDocumentCount(documentTypeId, e.value);
      this.GetDashboardDocumentTypes(documentTypeId, e.value);
      this.GetDocumentMonitorForDashboardDynamicData(documentTypeId, e.value);
      this.GetDocumentMonitorDetailListForDashboard(documentTypeId, e.value);
    } else {
      this.documentSubTypeList = [];
      this.GetDashboardDocumentTypes(documentTypeId, 0);
      this.GetDocumentMonitorForDashboardDynamicData(documentTypeId, 0);
      this.GetDocumentMonitorDetailListForDashboard(documentTypeId, 0);
    }
  }

  //To get the Total document count
  GetDashboardTotalDocumentCount(documenttype: number, documentsubtype: number) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDashboardTotalDocumentCountList$(sendPrm).subscribe(data => {
      if (data != null) {
        this.totalDocumentList = data;
        this.docopeningBalance = data[0].documentopeningBalance;
        this.docReceived = data[0].documentReceived;
      }
      else {
        this.totalDocumentList = null;
        this.docopeningBalance = 0;
        this.docReceived = 0;
        notify("Data not available for selected filter");
      }
    }, err => { notify('Error'); }
    );
  }

  getDashboardTotalDocumentCountList$(sendPrm) {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentCount', sendPrm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return {
          'documentopeningBalance': item.documentopeningBalance,
          'documentReceived': item.documentReceived,
          'document': item.document,
          'documentCount': item.documentCount
        };
      })));
  }

  //To get DOCUMENT TYPE COUNT
  GetDashboardDocumentTypes(documenttype: number, documentsubtype: number) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDashboardDocumentTypeslist$(sendPrm).subscribe(data => {
      if (data != null) {
        this.documentTypeCountList = data;
        this.totalDocumentTypeCount();
      }
      else {
        this.documentTypeCountList = null;
        this.totalDocumentType = 0;
        notify("Data not available for selected filter");
      }
    }, err => { notify('Error'); }
    );
  }

  getDashboardDocumentTypeslist$(sendPrm) {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentTypesCount', sendPrm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return {
          'document': item.document,
          'documentCount': item.documentCount,
          'documentId': item.documentId
        }
      })));
  }

  totalDocumentTypeCount() {
    let total = 0;
    for (let data of this.documentTypeCountList) {
      total += data.documentCount;
    }
    this.totalDocumentType = total;
  }

  pointClickHandler(arg) {
    arg.target.select();
    var point = arg.target;
    point.showTooltip();
  }


  pointdocumentTypeClickHandler(arg) {
    arg.target.select();
    var point = arg.target;
    point.showTooltip();     
  }

  customizeLabel(arg) {
    return arg.valueText + " (" + arg.percentText + ")";
  }

  //Date control date change and range click event
  ondateChange(event) {
    try {
      if (event.startDate != undefined && event.startDate !== null) {
        this.startDatetime = event.startDate._d.format("yyyy-MM-dd HH:mm");
        this.endDatetime = event.endDate._d.format("yyyy-MM-dd HH:mm");

        //---------------------required for Today,Yesterday,last 7days, last 30 days -----------------------------
        var startTime = event.startDate._d.format("HH:mm");
        var endTime = event.endDate._d.format("HH:mm");

        if (startTime == endTime) {
          startTime = "00:00";
          endTime = "23:59";

          this.startDatetime = event.startDate._d.format("yyyy-MM-dd");
          this.endDatetime = event.endDate._d.format("yyyy-MM-dd");

          this.startDatetime = this.startDatetime + " " + startTime;
          this.endDatetime = this.endDatetime + " " + endTime;
        }
        //-----------------------------------------------------------------------------      

        var documentTypeId;
        var documentSubTypeId;
        if ($("#selectboxdocumentType input").val() == undefined || $("#selectboxdocumentType input").val() == '') {
          documentTypeId = 0;
        }
        else {
          documentTypeId = $("#selectboxdocumentType input").val();
        }
        if ($("#selectboxdocumentSubType input").val() == undefined || $("#selectboxdocumentSubType input").val() == '') {
          documentSubTypeId = 0;
        }
        else {
          documentSubTypeId = $("#selectboxdocumentSubType input").val();
        }
        this.GetDashboardTotalDocumentCount(documentTypeId, documentSubTypeId);
        this.GetDashboardDocumentTypes(documentTypeId, documentSubTypeId);
        this.GetAlertsForDashboard(documentTypeId, documentSubTypeId);
        this.GetDocumentMonitorForDashboardDynamicData(documentTypeId, documentSubTypeId);
        this.GetDocumentMonitorDetailListForDashboard(documentTypeId, documentSubTypeId);
      }
      else {
        this.startDatetime = "";
        this.endDatetime = "";
      }
    }
    catch{
    }
  }

  getDocDetails(key) {
    let item = this.dynamicdata.find((i) => i.KeyId === key);
    if (item != undefined && item != null) {
      return item.StageDetails;
    }
  }

  //TBD : this is given by yuj to show priority
  //from where to show this priority
  alerts = [{
    "status": "All",
    "values": 29
  }, {
    "status": "High",
    "values": 17
  }, {
    "status": "Medium",
    "values": 7
  }, {
    "status": "Low",
    "values": 5
  }];

  showTabContent: any = this.alerts[0];  
   activateTabContent(data) {
     //TBD commented as Alerts high,low not active as of now
     //this.showTabContent = data;
   }

  selectStatus(data) {
     //TBD commented as Alerts high,low not active as of now
    // if (data == "All") {
    //   this.dataGrid.instance.clearFilter();
    // } else {
    //   this.dataGrid.instance.filter(["priority", "=", data]);
    // }
  }

  //To show document image on document id click
  showDocumentPopup: boolean;
  documentPopup(id) {
    this.showDocumentPopup = true;
    this.GetDocumentToView(id)
  }

  //To show document details on click of document type
  showDetails: any;
  //BELOW NOT IN USE NOW as STATIC HTML REPLACED BY DYNAMIC GRID BINDING
  // showDetailsFun(data, Docid, Docsubtypeid) {
  //   this.documentmonitorDetailsToShow = this.documentmonitorListDetails.filter((i) => i.DocTypeId == Docid && i.DocSubTypeId == Docsubtypeid);
  //   this.showDetails = data;
  // }

  showDetailsFun(data) {   
    //this.documentmonitorDetailsToShow = this.documentmonitorDetails.filter((i) => i.DocTypeId == 1 && i.DocSubTypeId == 1);
    this.documentmonitorDetailsToShow = this.documentmonitorDetails.filter((i) => i.DocSubTypeName == data);
    this.showDetails = data;
  }

  //To hide document details window
  //BELOW NOT IN USE NOW as STATIC HTML REPLACED BY DYNAMIC GRID BINDING
  showDetailsRevert() {
    this.showDetails = '';
  }

  //Redirect to allocation page
  redirectToAllocateUsers() {
    this.router.navigate(['./user-allocation']);
  }

  //Redirect to Document monitor page
  redirectToDocumentMonitor() {
    var documentTypeId;
    var documentSubTypeId;
    if ($("#selectboxdocumentType input").val() == undefined || $("#selectboxdocumentType input").val() == '') {
      documentTypeId = 0;
    }
    else {
      documentTypeId = $("#selectboxdocumentType input").val();
    }
    if ($("#selectboxdocumentSubType input").val() == undefined || $("#selectboxdocumentSubType input").val() == '') {
      documentSubTypeId = 0;
    }
    else {
      documentSubTypeId = $("#selectboxdocumentSubType input").val();
    }
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    this.router.navigate(['./Document-Monitor'],
      { queryParams: { documenttype: documentTypeId, documentsubtype: documentSubTypeId, fromdate: this.startDatetime, todate: this.endDatetime } });
  }

  //Redirect to Next action page 
  PopUpmessage: any;
  NextActions = ["Split", "Manual Handling", "Quality Check"];
  RedirectModel: any;
  CancelPopupVisible = false;
  OkButtonVisible = false;
  DocumentID: any;
  RedirectType: any;
  redirectToNextAction(id, action) {
    this.CancelPopupVisible = false;
    this.OkButtonVisible = false;
    this.DocumentID = 0;
    this.RedirectType="";
    switch (action) {
      case this.NextActions[0]: {
        // this.router.navigate(['./Document-Monitor'],
        //   { queryParams: { documentHeaderID: id } });
        break;
      }
      case this.NextActions[1]: {
        this.CheckBeforeRedirect(id,"M");
        // this.router.navigate(['./manualhandling'],
        //   { queryParams: { documentHeaderID: id } });
        break;
      }
      case this.NextActions[2]: {
        this.CheckBeforeRedirect(id,"Q");
        //this.router.navigate(['./qualitycheck'],
        // { queryParams: { documentHeaderID: id } });
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }

  //Check document is allocated to some other person or not before redirect to next action
  CheckBeforeRedirect(id: number, redirectto: string) {
    this.RedirectType = redirectto;
    this.CheckDocumentIsAllocated$(id).subscribe(data => {
      if (data != null) {
        this.documentNextActionModel = data;
        if (this.documentNextActionModel.isPopupVisible == true) {
          this.cancelChangePopup();
          this.PopUpmessage = this.documentNextActionModel.message;
          if (this.documentNextActionModel.isOkButtonVisible == true) {
            this.okButtonVisible();
            this.DocumentID = id;
            this.RedirectType = redirectto;
          }
        }
        else if (this.documentNextActionModel.isPopupVisible == false) {       
         
          localStorage.setItem("PreviousUrl", this.currentPageURL);//added on 9 March 2020 set for back from navigated module
          if (redirectto == "M") {
            this.router.navigate(['./manualhandling']
              , { queryParams: { documentHeaderID: id } });
          }
          else if (redirectto == "Q") {
            this.router.navigate(['./qualitycheck']
              , { queryParams: { documentHeaderID: id } });
          }
        }
      }
    });
  }

  CheckDocumentIsAllocated$(documentHeaderId: number) {
    const sendPrm = '?documentHeaderId=' + documentHeaderId;
    const returnItem = this.service.getSingle('OperationalManagerDashboardApi/CheckDocumentIsAllocated', sendPrm).pipe(map((data: any) => { return data }));
    return returnItem;
  }

  //redirect OK button click of popup window
  redirectOnOKClick(id) {
    if (id != null && id != 0) {
      if (this.documentNextActionModel.isUpdateRequire == true) {
        this.updateDocumentAllocation(id).subscribe(data => {
          this.CancelPopupVisible = false;
          if (this.RedirectType == "M") {
            this.router.navigate(['./manualhandling'],
              { queryParams: { documentHeaderID: id } });
          }
          else if (this.RedirectType == "Q") {
            this.router.navigate(['./qualitycheck'],
              { queryParams: { documentHeaderID: id } });
          }
        }, err => { notify('Error') }
        );
      }
    }
  }

  updateDocumentAllocation(id) {
    const sendPrm = '?id=' + id;
    const returnItem = this.service.put('OperationalManagerDashboardApi/UpdateDocumentAllocation', id).pipe(map(x => this.saveResults = x));;
    return returnItem; 
  }
  //redirect to next action end here

  //Method to get Document allocation count stage wise
  GetDashboardDocumentAllocationCount() {
    this.getTotalDocumentAllocationlist$().subscribe(data => {
      if (data != null) {
        this.documentAllocationList = data;
      }
      else {
        this.documentAllocationList = null;
        notify("Data not available for selected filter");
      }
    }, err => { notify('Error'); }
    );
  }

  getTotalDocumentAllocationlist$() {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentAllocationCount').pipe(map((data: any[]) => data.map((item: any) => {
      return new DocumentTypeDashboardModel(item.document, item.documentCount, item.documentId);
    })));
  }

  //Method to get active users list
  GetAllocatedUsers() {
    this.getAllocatedUserlist$().subscribe(data => {
      if (data != null) {
        this.userList = data;
      }
      else {
        this.userList = null;
        notify("Allocated users data not available");
      }
    }, err => { notify('Error'); }
    );
  }

  getAllocatedUserlist$() {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardAllocatedUsers').pipe(map((data: any[]) => data.map((item: any) => {
      return new AllocatedUserModel(item.userId, item.userName, item.roleName);
    })));
  }

  //Method to get Document subtypes on pi chart click and bind the same
  //As of now not enabled
  OnDocumentTypePieCartClick(id) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    if (id != null && id !== 0) {
      const sendPrm = '?documentTypeId=' + id + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;;
      this.getDashboardDocumentSubTypeslistForPieClick$(sendPrm).subscribe(data => {
        if (data != null) {
          this.documentTypeCountList = data;
        }
        else {
          notify("Data available for selected filter");
        }
      }, err => { notify('Error'); this.documentTypeCountList = null; }
      );
    }
    else {
      this.documentTypeCountList = null;
    }
  }

  getDashboardDocumentSubTypeslistForPieClick$(sendPrm) {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentSubTypeCount', sendPrm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return {
          'document': item.document,
          'documentCount': item.documentCount,
          'documentId': item.documentId
        }
      })));
  }

  //To Get Dashboard Alerts
  GetAlertsForDashboard(documenttype: number, documentsubtype: number) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDashboardAlertlist$(sendPrm).subscribe(data => {
      if (data != null) {
        this.alertsList = data;
      }
      else {
        this.alertsList = null;
        notify("Alerts data not available");
      }
    }, err => { notify('Error'); }
    );
  }

  getDashboardAlertlist$(sendPrm) {
    return this.service.getAll('OperationalManagerDashboardApi/GetAlertsForDashboard', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      if (item != null) {
        return {
          'alertType': item.alertType,
          'description': item.description,
          'alertTime': item.alertTime,
          'documentNo': item.documentNo
        }
      }
      else {
        return null;
      }
    })));
  }

  //To Get Dashboard Monitor dynamic data
  GetDocumentMonitorForDashboardDynamicData(documenttype: number, documentsubtype: number) {
    if (this.dataGrid != undefined && this.dataGrid != null) {
      this.dataGrid.instance.refresh();
    }
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDocumentMonitorForDashboardDynamicData$(sendPrm).subscribe(data => {
      if (data != null && data.length > 0) {
        this.dynamicdata = data;
      }
      else {
        this.dynamicdata = [];
        notify("Document monitor details not available");
      }
    }, err => { notify('Error'); }
    );
  }

  getDocumentMonitorForDashboardDynamicData$(sendPrm) {
    try {
      return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentMonitorDynamicData', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
        if (item != null) {
          return item;
        }
        else {
          return null;
        }
      })));
    }
    catch
    {
      notify("error");
    }
  }

  // onCellPrepared(e) {
  //   //e.columnOption("someColumn", "visible", false);
  //   if (e.rowType === "data" && e.column.dataField === "DocumentType") {
  //     var fieldData = e.value;
  //     var fieldHtml = "";
  //     if (fieldData) {
  //       //e.cellElement.innerText=""
  //     }
  //     // e.cellElement.style.color = e.data.Amount >= 10000 ? "green" : "red";
  //     // // Tracks the `Amount` data field
  //     // e.watch(function() {
  //     //     return e.data.Amount;
  //     // }, function() {
  //     //     e.cellElement.style.color = e.data.Amount >= 10000 ? "green" : "red";
  //     // })
  //   }
  // }

  // Method to dynamically control the visibility of the table data grid
  customizeGridColumns(columns) {
    if (columns != null && columns != undefined && columns.length > 0) {
      columns.forEach(element => {
        //if (element.dataField == "fieldId")
        if (element.dataField != undefined && element.dataField != '') {
          if (element.dataField.indexOf("StageDetails") >= 0 || element.dataField.indexOf("KeyId") >= 0) {
            element.visible = false;
          }
          else if (element.dataField.indexOf("Type") >= 0) {
            element.visible = true;
            element.width = "120px";
          }
          else if (element.dataField.indexOf("OCRed") >= 0) {
            element.visible = true;
            element.width = "120px";
            element.caption = "OCR RED";
          }
          else {
            element.visible = true;
            element.width = "150px";
          }
        }
      });
    }
  }

  //To Get Dashboard Monitor
  //BELOW CODE IS NOT IS USE AS STATIC HTML IS REPLACED BY DYNAMIC BINDING
  GetDocumentMonitorForDashboard(documenttype: number, documentsubtype: number) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDashboardDocumentMonitorlist$(sendPrm).subscribe(data => {
      if (data != null) {
        this.documentMonitorList = data;
      }
      else {
        this.documentMonitorList = null;
        notify("Document monitor details not available");
      }
    }, err => { notify('Error'); }
    );
  }

  getDashboardDocumentMonitorlist$(sendPrm) {
    return this.service.getAll('OperationalManagerDashboardApi/GetDashboardDocumentMonitorDetails', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      if (item != null) {
        return {
          'DocTypeName': item.docTypeName,
          "DocSubTypeName": item.docSubTypeName,
          "DocTypeId": item.docTypeId,
          "DocSubTypeId": item.docSubTypeId,
          "Downloaded": item.downloaded,
          "ReadyForPreprocessed": item.readyForPreprocessed,
          "ClassIdentified": item.classIdentified,
          "Preprocessed": item.preprocessed,
          "OCRed": item.ocRed,
          "DocIdentified": item.docIdentified,
          "Extracted": item.extracted,
          "Failed": item.failed,
          "Completed": item.completed,
          "Discarded": item.discarded,
          "PendingWithVeto": item.pendingWithVeto,
          "AwaitingQC": item.awaitingQC,
          "AwaitingExport": item.awaitingExport,
          "DownloadedClass": item.downloadClass,
          "ReadyForPreprocessedClass": item.readyForPreprocessedClass,
          "ClassIdentifiedClass": item.classIdentifiedClass,
          "PreprocessedClass": item.preprocessedClass,
          "OCRedClass": item.ocRedClass,
          "ExtractedClass": item.extractedClass,
          "FailedClass": item.failedClass,
          "CompletedClass": item.completedClass,
          "DiscardedClass": item.discardedClass,
          "PendingWithVetoClass": item.pendingWithVetoClass,
          "AwaitingQCClass": item.awaitingQCClass,
          "AwaitingExportClass": item.awaitingExportClass
        }
      }
      else {
        return null;
      }
    })));
  }

  //To Get Dashboard Monitor Detail list on click of document subtype
  GetDocumentMonitorDetailListForDashboard(documenttype: number, documentsubtype: number) {
    if (this.startDatetime == "" && this.endDatetime == "") {
      this.SetStartEnddate();
    }
    const sendPrm = '?documentTypeId=' + documenttype + '&documentSubTypeId=' + documentsubtype + '&startDt=' + this.startDatetime + '&endDt=' + this.endDatetime;
    this.getDashboardDocumentMonitorDetaillist$(sendPrm).subscribe(data => {
      if (data != null) {
        this.documentmonitorDetails = data;
      }
      else {
        this.documentmonitorDetails = null;
        notify("Document monitor details not available");
      }
    }, err => { notify('Error'); }
    );
  }

  getDashboardDocumentMonitorDetaillist$(sendPrm) {
    const documentmonitordetaillist = this.service.getAll('OperationalManagerDashboardApi/GetTypeSubTypeWiseDocDetails', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      if (item != null) {
        return {
          'DocTypeId': item.docTypeId,
          "DocTypeName": item.docTypeName,
          "DocSubTypeId": item.docSubTypeId,
          "DocSubTypeName": item.docSubTypeName,
          "CurrentStage": item.currentStage,
          "CurrentStageId": item.currentStageId,
          "ReceivedDate": item.receivedDate,
          "NextAction": item.nextAction,
          "DocumentHeaderID": item.documentHeaderID
        };
      }
      else {
        return null;
      }
    })));
    return documentmonitordetaillist;
  }
  //Document monitor end

  //Document view Start
  // Method to load the document on click of document no. from document monitor screen after valid LEADTOOLS license check
  GetDocumentToView(documentHeaderId: number) {
    var that = this;
    const sendPrm = '?DocumentHeaderId=' + documentHeaderId;
    this.getDocumentViewModel(sendPrm).subscribe((data: any) => {
      if (data != null && data != undefined) {
        this.documentModel = data;

      }
      else {
        this.documentModel = null;
        notify("Document details not available");
      }
      this.checkLicenseAndLoadDocument();
    }, err => { notify('Error'); }
    );
  }

  getDocumentViewModel(sendPrm) {
    const result$ = this.service.getAll('OperationalManagerDashboardApi/GetDocumentToView', sendPrm).pipe(map((data: any) => { return data }));
    return result$;
  }

  // Method to set the licensing details of LEADTOOLS and check if valid license is present - allow to proceed if valid license available
  checkLicenseAndLoadDocument() {
    // LEADTOOLS license file path and developer key to come from database configurations - Right now hardcoded
    var licenseUrl = this.documentModel.leadToolsJSLicenseFilePath; //"http://localhost:4200/assets/LeadTools/LEADTOOLS.lic.txt";
    var developerKey = this.documentModel.leadToolsJSDeveloperKey;

    var that = this; // variable to resolve the this-that issue of javascript
    lt.RasterSupport.setLicenseUri(licenseUrl, developerKey, function (setLicenseResult) {
      // Check the status of the license 
      if (setLicenseResult.result) {
        setTimeout(() => {
          // Set the path of the LEADTOOLS document service host path - running in background, used by document viewer to load and save document + annotations
          lt.Document.DocumentFactory.serviceHost = that.documentModel.leadToolsDocumentServiceHostPath; //"http://localhost:30000";
          lt.Document.DocumentFactory.servicePath = "";
          lt.Document.DocumentFactory.serviceApiPath = "api";
          // Once license status is verified and validated, invoke open document method
          that.openDocument();
        }, 10);
      }
      else {
        // False => TODO => LEADTOOLS License is invalid or expired, need to prompt to user
        notify("LEADTOOLS License is invalid or expired.");
      }
    });
  }

  // Method to open the document in LEADTOOLS document viewer and set up default annotations settings to be used for ROI marking
  openDocument() {
    var createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
    createOptions.viewContainer = document.getElementById("documentDivParent");
    createOptions.thumbnailsContainer = document.getElementById("thumbnailDivParent");
    createOptions.useAnnotations = true;
    this.documentViewer = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);

    //this.documentViewerMH.view.imageViewer.autoCreateCanvas = true;
    var url = this.documentModel.documentImageVirtualPath;
    this.documentPhysicalPath = this.documentModel.documentPath;
    //var url = "http://localhost:4201/assets/LeadTools/1000214756.tif";
    // console.log("url need to loaded=" + url);

    var that = this;
    if (url == null || url === undefined || url == '') {
      notify("Document path not available to load.")
    }
    else {

      lt.Document.DocumentFactory.loadFromUri(url, null)
        .done(function (doc) {

          try {
            //console.log("url after loadFromUri=" + doc);

          }
          catch
          {
            notify("error");
          }

          // Set the document in the viewer 
          // Reference link : https://www.leadtools.com/help/sdk/v20/dh/javascript/doxui/documentviewerview-lazyload.html
          that.documentViewer.view.lazyLoad = true;          
          that.documentViewer.thumbnails.lazyLoad = true;
          that.documentViewer.setDocument(doc);

          // Set only once - se rubber band interactive mode for the document viewer                
          that.documentViewer.gotoPage(1);
        })
        .fail(function () { notify("Document not available to load."); console.log("url while loadFromUri"); });
    }
  }

  //Clear document viewer object on ok button click
  clearObjectsBeforeClose() {
    if (this.documentViewer != null) {
      this.documentViewer.thumbnails.dispose();
      this.documentViewer.view.imageViewer.dispose();
    }
    this.documentViewer = null;
    this.documentModel = [];
  }
  //Document view end

  // Next Action click popup
  cancelChangePopup() {
    this.OkButtonVisible = false;
    this.CancelPopupVisible = true;
  }
  okButtonVisible() {
    this.OkButtonVisible = true;
  }

  //hardcoded JSON given by YUJ
  documentMonitor = [
    {
      "docType": "Invoice",
      "docSubType": "Invoice_new",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-1",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-2",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-3",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-4",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-2",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-5",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-2",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-6",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }, {
      "docType": "Invoice",
      "docSubType": "Invoice_new-7",
      "preProcessor": "34",
      "OCR": "32",
      "splitterMerger": "34",
      "Rejected": "76",
      "ManualEntry": "34"
    }
  ];
  // documentMonitorDetails = [
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   },
  //   {
  //     "docId": "AJ75689",
  //     "currentStange": "Metadata",
  //     "dateReceived": "Dec 9 2019, 12:34 PM",
  //     "duration": "Split-merge"
  //   }
  // ];
}

