import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  constructor() { }

  ngOnInit() {
  }

alerts = [{
    "status": "All",
    "values": 29
},{
    "status": "High",
    "values": 17
},{
    "status": "Medium" ,
    "values": 7
},{
    "status": "Low",
    "values": 5
}];

alertsTable = [
  {
    "alert": "Document rejected",
    "priority": "Medium",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "Low",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  },{
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  },{
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  },{
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }, {
    "alert": "Document rejected",
    "priority": "High",
    "dateTime": "12.30 PM",
    "description": "544 documents in rejected queue for ...",
    "action": "Reallocate users"
  }];

  //Tabs

  showTabContent: any = this.alerts[0];
  activateTabContent(data){
    this.showTabContent = data;
  }
  
  selectStatus(data) {
    if (data == "All") {
        this.dataGrid.instance.clearFilter();
      } else {
          this.dataGrid.instance.filter(["priority", "=", data]);
      }
  }

}
