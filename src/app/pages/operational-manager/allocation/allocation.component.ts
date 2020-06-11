import { Component, OnInit, NgModule } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { map } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import { BrowserModule } from '@angular/platform-browser';
import { DxDataGridModule, DxPopupModule, DxListModule, DxDropDownBoxModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store'

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.scss']
})
export class AllocationComponent implements OnInit {

  dataSource: ArrayStore;
  currentDocumentSubTypeId : number;
  currentStatusId : number;
  currentPriority : number;
  saveResults: any;
  temprowdata: any;
    alertmessage: any = false;
  constructor(private service : DataService) {
   
    this.getDashboardData().subscribe(data => {
              this.allocation = data;
    });
  
    this.dataSource = new ArrayStore({
      key: "ID"
    });
   }

  ngOnInit() {
  }

  onRowUpdated(event)
  {
    var userAllocationModel  : any  = 
    {
      DocumentSubTypeId :event.data.documentSubTypeId ,
      CurrentStatusId : event.data.currentStatusId,
      Priority :event.data.priority 
    }
    
    this.updatePriority(userAllocationModel).subscribe(data => {
      //update the display here
        this.allocatedUsersPopupVisible = false;
      });
        setTimeout(() => {
          //this.loadIndicatorVisible = false;
        }, 2000);
  }


  getDashboardData() {
    const customsettings = this.service.getAll('OperationalManagerUserAllocation/GetOperationalManagerDashboardData')
    .pipe(map((data: any[]) => data.map((item: any) => {

      var DashboardModel : any = {
        docType : item.documentType,
        docSubType : item.documentSubType, 
        stage : item.currentStatus, 
        count: item.documentCount,
        userDisplayString : item.userDisplayString,
        priority: item.priority,
        documentTypeId : item.documentTypeId, 
        documentSubTypeId : item.documentSubTypeId,
        currentStatusId : item.currentStatusId
      };
   
      return DashboardModel;
    })));
  
    return customsettings;
  }

  getUserAssignedUnassignedForAllocation(DocumentSubTypeId : number, StatusId : number)
  {
    const customsettings = this.service.getAll(
      'OperationalManagerUserAllocation/GetUserAssignedUnassignedForAllocation?' 
      + "DocumentSubTypeId" + "=" + DocumentSubTypeId
      + "&"
      + "CurrentStatusId" + "=" + StatusId
      )
    .pipe(map((data: any[]) => data.map((item: any) => {

      var unselectedUserModel : any = {
        id : item.id,
        text : item.name, 
        hint : item.roles,
        isSubTypeAllocated : item.isSubTypeAllocated
      };
      return unselectedUserModel;
    })));
    return customsettings;    
  }


  allocatedUsersPopupSave()
  {
    const selectedUserModel  = []; 
    this.selectedUsers.forEach(x=> {
       selectedUserModel.push( {
        userId : x.id,
        documentSubTypeId : this.currentDocumentSubTypeId,
        currentStatusId : this.currentStatusId,
        priority : this.currentPriority
      });
    });

    if ( this.selectedUsers.length == 0 )
    {
      selectedUserModel.push( {
        userId : 0,
        documentSubTypeId : this.currentDocumentSubTypeId,
        currentStatusId : this.currentStatusId,
        priority : this.currentPriority
      });
    }
    this.updateSelectedUsers(selectedUserModel).subscribe(data => {
    //update the display here
    this.getDashboardData().subscribe(data => {
        this.allocation = data;
        });
        this.allocatedUsersPopupVisible = false;
        this.alertmessage = true;
    });
      setTimeout(() => {
        this.alertmessage = false;
        //this.loadIndicatorVisible = false;
      }, 5000);
}

/**Update Methods */
  updateSelectedUsers(selectedModel : any) {
    const allocateUser = this.service.put('OperationalManagerUserAllocation/UpdateAssignedUsersList', selectedModel
    ).pipe(map(x => this.saveResults = x));
    return allocateUser;
  }

  updatePriority(userAllocationModel : any ) {
    const updatePriorityValue = this.service.put('OperationalManagerUserAllocation/UpdatePriority', userAllocationModel
    ).pipe(map(x => this.saveResults = x));
    return updatePriorityValue;
  }  
/**Update Methods */  
  setStateValue(rowData: any, value: any): void {
    
    rowData.priority = null;
    (<any>this).defaultSetCellValue(rowData, value);
}

  priorities  = [
    {
      "ID": 0,
      "Priority": "None"
    },{
    "ID": 1,
    "Priority": "1"
  },{
      "ID": 2,
      "Priority": "2"
  },{
    "ID": 3,
    "Priority": "3"
}];


  //Following are the main arrays used by HTNL
  allocation = [];
  selectedUsers = [];
  defaultUsers = [];
    
  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
    e.fromData.splice(e.fromIndex, 1);
  } 
    hideAlert(event) {
        this.alertmessage = false;
    }
  // Allocated users popup
  allocatedUsersPopupVisible = false;
  popupTitle:string;
  allocatedUsersPopup(data){

    //save the following values for using in save
    this.currentDocumentSubTypeId = data.key.documentSubTypeId;
    this.currentStatusId = data.key.currentStatusId;
    this.currentPriority = data.key.priority;
    //call the API to get selected/unselected users and 
    //sort the user list to display on left/right panes.
      this.getUserAssignedUnassignedForAllocation(
                        data.key.documentSubTypeId,
                        data.key.currentStatusId).subscribe(UserData => {
        const selectedUsersResult =   
                      UserData.
                      filter(c=>c.isSubTypeAllocated == true).sort(function(a,b){
                      return a.text.localeCompare(b.text);
                      });
        const defaultUsersResult   =   
                      UserData.
                      filter(c=>c.isSubTypeAllocated == false).sort(function(a,b){
                      return a.text.localeCompare(b.text);
                      });         
        this.selectedUsers =  selectedUsersResult;
        this.defaultUsers = defaultUsersResult;
      });

    this.allocatedUsersPopupVisible = true;
    this.popupTitle = data.values[0];
  }
 

}

@NgModule({
  imports: [
      BrowserModule,
      DxDataGridModule,
      DxPopupModule, 
      DxListModule,
      DxDropDownBoxModule
  ]
})

export class AppModule { }