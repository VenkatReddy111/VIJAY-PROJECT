import { Component, OnInit, NgModule,ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxTabPanelModule } from 'devextreme-angular';
import { DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule } from 'devextreme-angular';


@Component({
  selector: 'app-executor-dashboard',
  templateUrl: './executor-dashboard.component.html',
  styleUrls: ['./executor-dashboard.component.scss']
})
export class ExecutorDashboardComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  constructor() { }

  ngOnInit() {
  }

  manualInterventionTabs = [ 
    'All', 'Split Merge', 'Rejected', 'Data Entry', 'Quality Check' 
    // { text: "All", total:'1278', },
    // { text: "Split Merge", total:'478', },
    // { text: "Rejected", total:'250', },
    // { text: "Data Entry", total:'250', },
    // { text: "Quality Check", total:'300', }
  ]

  executorDashboard = [
    {
      "docType": "Invoice",
      "docSubType": "Invoice_elec",
      "docID": "AJ75689",
      "stage": "Split Merge",
      "status": "Overdue"
    },{
      "docType": "Dropbox POs",
      "docSubType": "Purchase order",
      "docID": "AJ75687",
      "stage": "Rejected",
      "status": "New"
    },{
      "docType": "Dropbox POs",
      "docSubType": "Purchase order",
      "docID": "AJ75686",
      "stage": "Data entry",
      "status": "In process"
    }];

  showTabContent: any = this.manualInterventionTabs[0];
  activateTabContent(data){
    this.showTabContent = data;
  }

  //Filter grid data on tab change
  selectStatus(data) {
    if (data == "All") {
        this.dataGrid.instance.clearFilter();
    } else {
        this.dataGrid.instance.filter(["stage", "=", data]);
    }
}

}


@NgModule({
  imports: [
      BrowserModule,
      DxTabPanelModule
  ]
})

export class AppModule { }