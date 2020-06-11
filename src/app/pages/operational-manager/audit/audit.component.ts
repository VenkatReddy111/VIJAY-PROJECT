
import * as moment from 'moment';
import { Component, OnInit, NgModule, ViewChild, HostListener } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';

import { AuditMaster } from 'src/app/models/AuditMaster.module';
import { Audit } from 'src/app/models/Audit.module';

import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  startDatetime: any;
  endDatetime: any;

  auditHeaderMasterList : any[] = [];
  auditdetailList : any[] = [];

  constructor(private router: Router, private service: DataService) {

  // Todays date selected
    this.selected = {
      startDate: moment(),
      endDate: moment()
    }
      //set defult date time on page load 
      this.startDatetime=this.selected.startDate.format("YYYY-MM-DD");
      this.endDatetime=this.selected.endDate.format("YYYY-MM-DD");

      var startTime=this.selected.endDate.format("HH:mm");
      var endTime=this.selected.endDate.format("HH:mm")

      if(startTime==endTime)
      {
        startTime="00:00";
        endTime="23:59";

        this.startDatetime= this.startDatetime+" "+startTime;
        this.endDatetime= this.endDatetime+" "+endTime;
      }
  

 
 }

 //  get date for Audit Header Master list binding
  getdocumentAuditHeaderMasterlist$(startdate, enddate) {
    let param = '?startdate='+ startdate+'&enddate='+enddate; 
    return this.service.getAll('audit/getAuditdetailsbydate', param)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return new AuditMaster(
        item.documentTypeId,item.documentType,item.documentSubTypeId,item.documentSubType,item.documentHeaderId,item.documentProcessLogId,
        item.documentProcessDate,item.inputSourceHeaderID,item.currentStatusId,item.currentStatus,item.lastUpdateby,item.lastUpdateDate ,
        item.auditDetails );
      })));
  }




  getdocumentAuditDetailslist$(id) {
    const sendPrm = '?id=' + id;
      return this.service.getAll('audit/getAuditDetailsbyID', sendPrm)
        .pipe(map((data: any[]) => data.map((item: any) => {
          return new Audit(
          item.actionid,item.actionName,item.auditType,item.actionControlName,item.documentNo,item.moduleName,item.threadId,
          item.statusId,item.description,item.instanceName,item.ipAddress,item.lastUpdateDate,item.lastUpdateby, item.lastUpdatedByName);
        })));
    }


  getDocAuditHistory(key){
    let item = this.auditHeaderMasterList.find((i) => i.documentHeaderId === key);
    return item.auditDetails;
  }

  auditMasterselectionChanged(id){

     return this.getdocumentAuditDetailslist$(id);
  }


    ngOnInit() {
    }

ondateChange(event) {
   
    if (event.startDate != undefined && event.startDate !== null) {
      this.startDatetime = event.startDate._d.format("yyyy-MM-dd HH:mm");
      this.endDatetime = event.endDate._d.format("yyyy-MM-dd HH:mm");
       this.getdocumentAuditHeaderMasterlist$(this.startDatetime,this.endDatetime).subscribe(a => { this.auditHeaderMasterList = a; });
    }
    else {
      this.startDatetime = "";
      this.endDatetime = "";
    }
    //this.GetDashboardTotalDocumentCount();
  }


  auditTrail= [{
    "ID": 1,
    "docId": "AJ75689",
    "docType": "Invoice",
    "docSubType": "Invoice_new",
    "stages": "Metadata",
    "duration": "31 min"
  }, {
    "ID": 2,
    "docId": "AJ58693",
    "docType": "Purchase order",
    "docSubType": "Purchaseorder_1",
    "stages": "Output queue",
    "duration": "22 min"
  }, {
    "ID": 3,
    "docId": "AJ39593",
    "docType": "Challan",
    "docSubType": "Challan_weekly",
    "stages": "Doctype",
    "duration": "30 min"
  }, {
    "ID": 4,
    "docId": "AJ75689",
    "docType": "Invoice",
    "docSubType": "Invoice_new",
    "stages": "Metadata",
    "duration": "31 min"
  }, {
    "ID": 5,
    "docId": "AJ58693",
    "docType": "Purchase order",
    "docSubType": "Purchaseorder_1",
    "stages": "Output queue",
    "duration": "22 min"
  }, {
    "ID": 6,
    "docId": "AJ39593",
    "docType": "Challan",
    "docSubType": "Challan_weekly",
    "stages": "Doctype",
    "duration": "30 min"
  }, {
    "ID": 7,
    "docId": "AJ75689",
    "docType": "Invoice",
    "docSubType": "Invoice_new",
    "stages": "Metadata",
    "duration": "31 min"
  }, {
    "ID": 8,
    "docId": "AJ58693",
    "docType": "Purchase order",
    "docSubType": "Purchaseorder_1",
    "stages": "Output queue",
    "duration": "22 min"
  }, {
    "ID": 9,
    "docId": "AJ39593",
    "docType": "Challan",
    "docSubType": "Challan_weekly",
    "stages": "Doctype",
    "duration": "30 min"
  }, {
    "ID": 10,
    "docId": "AJ75689",
    "docType": "Invoice",
    "docSubType": "Invoice_new",
    "stages": "Metadata",
    "duration": "31 min"
  }, {
    "ID": 11,
    "docId": "AJ58693",
    "docType": "Purchase order",
    "docSubType": "Purchaseorder_1",
    "stages": "Output queue",
    "duration": "22 min"
  }, {
    "ID": 12,
    "docId": "AJ39593",
    "docType": "Challan",
    "docSubType": "Challan_weekly",
    "stages": "Doctype",
    "duration": "30 min"
  }, {
    "ID": 13,
    "docId": "AJ75689",
    "docType": "Invoice",
    "docSubType": "Invoice_new",
    "stages": "Metadata",
    "duration": "31 min"
  }, {
    "ID": 14,
    "docId": "AJ58693",
    "docType": "Purchase order",
    "docSubType": "Purchaseorder_1",
    "stages": "Output queue",
    "duration": "22 min"
  }, {
    "ID": 15,
    "docId": "AJ39593",
    "docType": "Challan",
    "docSubType": "Challan_weekly",
    "stages": "Doctype",
    "duration": "30 min"
  }];

  //Datepicker
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  ranges: any = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }








}
