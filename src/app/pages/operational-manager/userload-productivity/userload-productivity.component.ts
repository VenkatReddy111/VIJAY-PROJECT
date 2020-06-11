import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as moment from 'moment';
import {
  UserProductivityModel
} from 'src/app/models/user-productivity.module';

import { Service, List } from 'src/app/app.service';
import { Router } from '@angular/router';
import { map, concat, merge, tap, filter, single } from 'rxjs/operators';
import { parse } from 'querystring';
import { DataService } from 'src/app/data.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-userload-productivity',
  templateUrl: './userload-productivity.component.html',
  styleUrls: ['./userload-productivity.component.scss']
})
export class UserloadProductivityComponent implements OnInit {

   
   //Declare variable
   listUserProductivityModel:any;
   lstStageDetail:any;
   startDatetime:any;
   endDatetime:any;
   
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

    constructor(private elRef: ElementRef, private router: Router, private service: DataService) {
    
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


  ngOnInit() {
    
    this.listUserProductivityModel=  this.GetDataForUserProductivity();
  }

  //---------------------Date filter
  ondataChange(event)
  {
   
    try{
    

    this.startDatetime=event.startDate._d.format("yyyy-MM-dd HH:mm");
    this.endDatetime=event.endDate._d.format("yyyy-MM-dd HH:mm");

    
      //---------------------required for Today,Yesterday,last 7days, last 30 days -----------------------------
      var startTime=event.startDate._d.format("HH:mm");
      var endTime=event.endDate._d.format("HH:mm");

      if(startTime==endTime)
      {
        startTime="00:00";
        endTime="23:59";

        this.startDatetime=event.startDate._d.format("yyyy-MM-dd");
        this.endDatetime=event.endDate._d.format("yyyy-MM-dd");

        this.startDatetime= this.startDatetime+" "+startTime;
        this.endDatetime= this.endDatetime+" "+endTime;
      }
      //-----------------------------------------------------------------------------

    this.GetDataForUserProductivity();

    }
    catch{
    }

  }

  //bind data to user productivity grid
  GetDataForUserProductivity() {

    this.getDataUserProductivity().subscribe(data => {
        if (data != null) {
            this.listUserProductivityModel=data[0];         
        }
        if(data==null||this.listUserProductivityModel===undefined)
        {           
           notify("Data not available. Please select another date range.");
        }
    });
}

//api call for binding user productivity grid
getDataUserProductivity() {

  if(!this.startDatetime)
  this.startDatetime='';

  if(!this.endDatetime)
  this.endDatetime='';

  return this.service.getAll('UserProductivityApi/GetUserProductivityDetails?startDate=' + this.startDatetime+'&endDate=' +  this.endDatetime)
  .pipe(map((data: any) => data.map((item: any) => {
    return data;

})));
}
 

// //default json given by design team
//   userProductivity= [{
//     "ID": 1,
//     "userName": "Jozef Kondratovich",
//     "docType": "Invoice",
//     "docSubType": "Invoice_new",
//     "stages": "Rejected, QC"
//   },
//   {
//     "ID": 2,
//     "userName": "Patrícia Ribeiro",
//     "docType": "Purchase order",
//     "docSubType": "Purchaseorder_1",
//     "stages": "Manual entry"
//   },
//   {
//     "ID": 3,
//     "userName": "Leelah Leatherbarrow",
//     "docType": "Challan",
//     "docSubType": "Challan_weekly",
//     "stages": "Split/Merge, QC…"
//   }
//  ];

//   //default Json given by design team
//   stageDetails= [{
//     "ID": 1,
//     "userEmpty": "",
//     "docTypeEmpty": "",
//     "docSubTypeEmpty": "",
//     "stages": "Rejected, QC",
//     "hours":"7"
//   }, {
//     "ID": 2,
//     "userEmpty": "",
//     "docTypeEmpty": "",
//     "docSubTypeEmpty": "",
//     "stages": "QC",
//     "hours":"5"
//   }, {
//     "ID": 3,
//     "userEmpty": "",
//     "docTypeEmpty": "",
//     "docSubTypeEmpty": "",
//     "stages": "Rejected",
//     "hours":"2"
//   }];

  

}
