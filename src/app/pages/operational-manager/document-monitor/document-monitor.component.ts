import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../data.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import { DxDataGridComponent } from 'devextreme-angular';
import { AuditMaster } from 'src/app/models/AuditMaster.module';
import { Audit } from 'src/app/models/Audit.module';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-document-monitor',
  templateUrl: './document-monitor.component.html',
  styleUrls: ['./document-monitor.component.scss']
})
export class DocumentMonitorComponent implements OnInit {
  documenttypelist: any;
  documentsubtypelist: any;
  documentmonitorlist: any[];
  documenthistory: any[];
  documentsubtype: number;
  documenttype: number;
  Openingbalance: number;
  Received: number;
  fromdate: string;
  todate: string;
  documenttypeval: string;
  documentsubtypeval: string;
  //for document view
  documentViewer: any;
  documentPhysicalPath: string = '';
  documentModel: any;

  startDatetime: any;
  endDatetime: any;

  dynamicdata: any[] = [];


  constructor(private router: Router, private service: DataService, private route: ActivatedRoute, ) {
    this.route.queryParams.subscribe(params => {
      this.Openingbalance = Number(params['Openingbalance']);
      this.Received = Number(params['Received']);
      this.documenttype = Number(params['documenttype']);
      this.fromdate= params['fromdate'];
      this.todate=params['todate'];
      this.selected = {
        startDate: moment(new Date(params['fromdate'])),
        endDate: moment(new Date(params['todate']))
      }
      this.GetDocumentsubtype$('?doctypeid=' + params['documenttype']).subscribe(data => { this.documentsubtypelist = data; });

      this.documentsubtype = Number(params['documentsubtype']);
      this.Getdocumenttypelist().subscribe(data => {
      this.documenttypelist = data;
      });
      debugger;
      this.GetDocumentMonitorDetail(this.documenttype, this.documentsubtype, this.fromdate, this.todate).subscribe(data => {
      this.documentmonitorlist = data;
      });
    });


    // Todays date selected
    // this.selected = {
    //   startDate: moment(),
    //   endDate: moment()
    // }
    //set defult date time on page load 
    // this.startDatetime=this.selected.startDate.format("YYYY-MM-DD");
    // this.endDatetime=this.selected.endDate.format("YYYY-MM-DD");

    // var startTime=this.selected.endDate.format("HH:mm");
    // var endTime=this.selected.endDate.format("HH:mm")

    // if(startTime==endTime)
    // {
    //   startTime="00:00";
    //   endTime="23:59";

    //   this.startDatetime= this.startDatetime+" "+startTime;
    //   this.endDatetime= this.endDatetime+" "+endTime;
    // }




  }

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  ngOnInit() {

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

  auditTrail = [{
    "ID": 1,
    "docId": "AJ75689",
    "currentStange": "Metadata",
    "dateReceived": "Dec 9 2019, 1234 PM",
    "duration": "Split-merge"
  }];
  //To get the documenttypes  
  GetDocumentMonitorDetail(documenttype: number, documentsubtype: number, fromdate: string, todate: string) {
    debugger;
    this.fromdate = fromdate;
    this.todate = todate;
    const documentmonitor = this.service.getAll('OperationalManagerDashboardApi/GetDocumentMonitorDetail?documentType=' + documenttype + '&' + 'documentSubType=' + documentsubtype + '&' + 'StDt=' + fromdate + '&' + 'EndDt=' + todate).pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'DocumentHeaderID': item.documentHeaderID,
        'DocumentPath': item.documentPath,
        'Status': item.status,
        'ReceivedDate': item.receivedDate,
        'NextAction': item.nextAction,
        'DocumentStages': item.documentStages
      };

    })));
    return documentmonitor;
  }

  ondateChange(event) {
    try {
      if (event.startDate != undefined && event.startDate !== null) {
        this.startDatetime = event.startDate._d.format("yyyy-MM-dd HH:mm");
        this.endDatetime = event.endDate._d.format("yyyy-MM-dd HH:mm");

        //---------------------required for Today,Yesterday,last 7days, last 30 days -----------------------------
        var startTime = event.startDate._d.format("HH:mm");
        var endTime = event.endDate._d.format("HH:mm");

        startTime = "00:00";
        endTime = "23:59";

        this.startDatetime = event.startDate._d.format("yyyy-MM-dd");
        this.endDatetime = event.endDate._d.format("yyyy-MM-dd");

        this.startDatetime = this.startDatetime + " " + startTime;
        this.endDatetime = this.endDatetime + " " + endTime;

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
        this.GetDocumentMonitorDetail(this.documenttype, this.documentsubtype, this.startDatetime, this.endDatetime).subscribe(data => {
        this.documentmonitorlist = data;
        });
      }
      else {
        this.startDatetime = "";
        this.endDatetime = "";
      }
    }
    catch{
    }
  }

  //To get the documenttypes  
  Getdocumenttypelist() {
    const documentlist = this.service.getAll('inputsourceapi/GetDocumentType').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'id': item.id,
        'name': item.name
      }
    })));
    return documentlist;
  }

  OnDocumentTypeSelectionChange(e) {

    const sendPrm = '?doctypeid=' + e.value;
    if (e.value != null) {
      this.documentmonitorlist = [];
      this.GetDocumentsubtype$(sendPrm).subscribe(data => { this.documentsubtypelist = data; });
      this.GetDocumentMonitorDetail(e.value, 0, this.fromdate, this.todate).subscribe(data => { this.documentmonitorlist = data; });
    } else {
      this.documentsubtypelist = null;
    }
  }

  OnDocumentSubTypeSelectionChange(e) {

    const sendPrm = '?doctypeid=' + e.value;
    if (e.value != null) {
      this.documentmonitorlist = [];
      this.GetDocumentMonitorDetail(0, e.value, this.fromdate, this.todate).subscribe(data => { this.documentmonitorlist = data; });
    } else {
      this.documentsubtypelist = null;
    }
  }

  //To get the documentsubtypes  
  GetDocumentsubtype$(sendprm) {
    return this.service.getAll('InputSourceApi/Getdocumentsubtype', sendprm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return {
          'documentsubtypeid': item.id,
          'documentsubtypename': item.name,
        };
      })));
  }

  OnGridClick($Events) {


  }

  getDochistory(key) {

    let item = this.documentmonitorlist.find((i) => i.DocumentHeaderID === key); 
    for(var i = 0 ;i< item.DocumentStages.length;i++)
    {
      var lsd   = item.DocumentStages[i].lastUpdateDate.replace("T"," ");
      var  fileExtPos = lsd.lastIndexOf(".");
      if (fileExtPos >= 0 )
      {
         lsd= lsd.substr(0, fileExtPos);
         item.DocumentStages[i].lastUpdateDate = lsd.replace(" "," | ");
      }  
    }
    return item.DocumentStages;
  }

  //Redirect to Next action page start
  NextActions = ["Split", "Manual Handling", "Quality Check"];
  redirectToNextAction(id, action) {
    switch (action) {
      case this.NextActions[0]: {
        // this.router.navigate(['./Document-Monitor'],
        //   { queryParams: { documentHeaderID: id } });
        break;
      }
      case this.NextActions[1]: {
        this.router.navigate(['./manualhandling'],
          { queryParams: { documentHeaderID: id } });
        break;
      }
      case this.NextActions[2]: {
        this.router.navigate(['./qualitycheck'],
          { queryParams: { documentHeaderID: id } });
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }
  ////Redirect to Next action page end

  //Document View Start
  //To show document image on document id click
  showDocumentPopup: boolean;
  documentPopup(id) {
    this.showDocumentPopup = true;
    this.GetDocumentToView(id)
  }

  // Method to load the document on click of document no. from document monitor screen after valid LEADTOOLS license check
  GetDocumentToView(documentHeaderId: number) {
    debugger;
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
    debugger;
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

    var that = this;
    if (url == null || url === undefined || url == '') {
      notify("Document path not available to load.")
    }
    else {

      lt.Document.DocumentFactory.loadFromUri(url, null)
        .done(function (doc) {

          try {

          }
          catch
          {
            notify("error");
          }

          // Set the document in the viewer 
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
  //Document View end

}


export class DocumentMonitor {
  DocumentHeaderID: number;
  DocumentPath: string;
  Status: string;
  ReceivedDate: string;
  NextAction: string;
  InputSourceHeaderID: number;
  DocumentStages: any;
  constructor(DocumentHeaderID, DocumentPath, Status, ReceivedDate, NextAction, InputSourceHeaderID, DocumentStages) {
    this.DocumentHeaderID = DocumentHeaderID;
    this.DocumentPath = DocumentPath;
    this.Status = Status;
    this.ReceivedDate = ReceivedDate;
    this.NextAction = NextAction;
    this.InputSourceHeaderID = InputSourceHeaderID;
    this.DocumentStages = DocumentStages;
  }
}

export class DocumentMonitordetail {
  DocumentHeaderID: number;
  LastUpdateDate: string;
  Stage: string;
  Remarks: string;
  Duration : string
  constructor(DocumentHeaderID, LastUpdateDate, Stage, Remarks,) {
    this.DocumentHeaderID = DocumentHeaderID;
    this.LastUpdateDate = LastUpdateDate;
    this.Stage = Stage;
    this.Remarks = Remarks;
  }
}


