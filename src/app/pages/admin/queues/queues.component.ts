import { Component, OnInit, NgModule,ViewChild } from '@angular/core';
import { DxTabPanelModule,DxTextBoxModule,DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxFormModule, DxPopupModule, DxPopupComponent, DxValidationGroupComponent, DxBarGaugeComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import { DataService } from 'src/app/data.service';
import notify from 'devextreme/ui/notify';
import {Router} from '@angular/router';
import { Queue, Server, QueueModel} from '../../../models/queue.module';
import { map } from 'rxjs/operators';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/message.service';
@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss']
})


export class QueuesComponent  extends ComponentbaseComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  value: any[] = [];

  //Variable to maintain delete state of rows
  selectedItemKeys: any[] = [];
  tempDeleteArray: ArrayStore;

  //Variable to show/hide custom buttons
  deleteBtn:boolean = false;  
  editBtn:boolean = false;
  addBtn:boolean=true;
  queuelist:any;
  queueField:any;
  serverField: Server;


  QueueListArray: any[];
  showteststatus = true ;
  loadingVisible:boolean=false;
  labelCaption: string = "Next";
  passwordMode: string;
  passwordButton: any;
  testConnectionCheck:boolean=false;
  testConnectionStatus='';
  showLoader:boolean=false;
  isduplicate:boolean=false;
  Count:any;
  showAddPopop:boolean=false;
  Deletepopup:boolean=false;
  count1:any;
  constructor(private router: Router,private service: DataService,private message: MessageService) { 
     super('Queues', 'Queues', message, service, environment.apiBaseUrl);
    this.queueList().subscribe(data => {
      this.queuelist = data;
    });
     this.serverField = this.serverFieldModel();
     this.queueField =this.queueFielsModel();
     this.passwordMode = 'password';
     this.passwordButton = {
         icon: "assets/images/view.png",
         type: "default",
         onClick: () => {
             this.passwordMode = this.passwordMode === "text" ? "password" : "text";
         }
     };
    
  }
  queueList() {
    const queuelistdetails = this.service.getAll('queueapi/QueueList').pipe(map((data: any[]) => data.map((item: any) => {
       return new Queue(
        item.serverName,
        item.userName,
        item.password,
         item.queueNameFeild.reduce(function(p, c) {
          return p ? p + ',' + c.queueName : c.queueName
        },''),
        item.queueconnection.reduce(function(p, c) {
          return p ? p + ',' + c.queueConnectedBetween : c.queueConnectedBetween
        },''),
        item.id,
        item.isDefault,
        item.isActive
  
        )
    })));   
return queuelistdetails;
  }
  ngOnInit() {
    
    }
  serverFieldModel() {
    return new Server(0, "", "", "", "","","",0,false,false);
       }

  queueFielsModel() {
    return new QueueModel(0, "",0, 0,"",0);
    }


    addQueue(){
      //this.selectedItemKeys= [];
      this.testConnectionCheck=false;
      this.testConnectionStatus ="";
      this.labelCaption = "Next";
      this.serverTabs=[
        'Server Details', 'Assign Queues'
      ]
      this.showserverTab = this.serverTabs[0];
      this.valGroup.instance.reset();
      this.serverField = this.serverFieldModel();
      const sendPrm = '?QueueHeaderId=' + 0;
      this.EditQueue(sendPrm).subscribe(data => {
         this.queueField = data;
         });
      this.showAddPopop = true;
    }

 
//Edit Queue
onFormSubmit = function (e) {
  // let result = this.valGroup.instance.validate();
  // if(result.isValid)
  // {
  
  //   this.saveQueue()

  // } 
  // else{
  //   notify("validation occured");
  // }
  notify({
      message: "You have submitted the form",
      position: {
          my: "center top",
          at: "center top"
      }
  }, "success", 3000);

  e.preventDefault();
}

fromServeFieldDTO(Data)
{
 this.serverField.queueHeaderID=Data.id;
 this.serverField.serverName =Data.serverName;
 this.serverField.domain="";
 this.serverField.userName=Data.userName;
 this.serverField.password=Data.password;
 this.serverField.isDefault=Data.isDefault;
this.serverField.isActive=Data.isActive
}

editQueuepopup(){
  this.labelCaption = "Next";
  this.serverTabs=[
    'Server Details', 'Assign Queues'
  ]
  this.showserverTab = this.serverTabs[0];
  //this.serverFieldModel=this.selectedItemKeys[0];
  //this.valGroup.instance.reset();
  this.testConnectionCheck=false;
  this.testConnectionStatus ="";
  this.fromServeFieldDTO(this.selectedItemKeys[0]);
  const sendPrm = '?QueueHeaderId=' + this.serverField.queueHeaderID;
  this.EditQueue(sendPrm).subscribe(data => { 
    this.queueField = data; 
  }); 
  // this.dataGrid.instance.refresh();
   this.showAddPopop = true;

}

  EditQueue(sendprm) {
    const queuelistdetails = this.service.getAll('queueapi/EditQueue',sendprm).pipe(map((data: any[]) => data.map((item: any) => {
      return new QueueModel(
        item.queueHeaderID,
        item.queueName,
        item.publisherSubscriberName,
        item.publisherID,
        item.subscriberID,
        item.queueDetailID,
     
      )
    })));
    return queuelistdetails;
  }


// get new server Details and Queue Details

formQueueDto(data) {
  this.QueueListArray=[];
  for (let i = 0; i < data["length"]; i++) {
     const oB = data[i];
    var custparameter  =  {
      'QueueDetailID': oB.queueDetailID, 
      'QueueHeaderID' :oB.queueHeaderID ,
      'QueueName' :oB.queueName,
      'PublisherModuleID':oB.publisherID==null?0:oB.publisherID,  
      'SubscriberModuleID' : oB.subscriberID==null?-1:oB.subscriberID, 
 } ;
 this.QueueListArray.push(custparameter);
}
return this.QueueListArray;
  
  }
  checkQueueDuplicate(){
    this.isduplicate=false;
    let res=[];
    this.queueField.map(function(item){
      var existItem = res.find(x=>x.queueName==item.queueName);
      if(existItem)
      notify("queuename is duplicate");
      else
     res.push(item);
    //  if(item.queueName=="")
    //  {
    //   notify("queuename is required");
    //  }

    });
    if(res.length!=this.queueField.length)
       {
        this.isduplicate=true;
       }
    return res;
  }
  

saveQueue()
{
 
  this.checkQueueDuplicate();
  if(this.isduplicate==true)
  {
    notify("Queue name is duplicate");
    return;
  }
 
   if (this.serverField.queueHeaderID == 0) {
    var serverDTo = this.formServerDto(this.serverField);
    var QueueDTO = this.formQueueDto(this.queueField);
    var data = { 'queuheader':serverDTo, '_queueDetail':QueueDTO };
    const post$ = this.service.postAll('queueapi/SaveQueue', data);
    post$.subscribe(data => {
      notify(data['result'].value);
      this.queueList().subscribe(data => {this.queuelist = data;});
      this.showAddPopop = false;
  setTimeout(() => {
         // this.loadIndicatorVisible = false;
      }, 2000);
    }, err => {
      setTimeout(() => {
      //  this.loadIndicatorVisible = false;
    }, 2000);
       notify(err.toString()); }
  );
  }else {
   var serverDTo = this.formServerDto(this.serverField);
    var QueueDTO = this.formQueueDto(this.queueField);
    var queueVmodel = {'queuheader': serverDTo,'_queueDetail':QueueDTO};
    const put$ = this.service.put('queueapi/UpdateQueue', queueVmodel);
    put$.subscribe(data => {
      notify(data['result'].value);
      this.showAddPopop = false;
      this.queueList().subscribe(data => {this.queuelist = data;});
 
       setTimeout(() => {
      //    this.loadIndicatorVisible = false;
      }, 2000);
    }, err => {
     setTimeout(() => {
       // this.loadIndicatorVisible = false;
    }, 2000);
       notify(err.toString()); }

    );
  
  }

}
openAssignQueue()
{

  this.serverTabs=[
  'Server Details', 'Assign Queues'
]


this.showserverTab = this.serverTabs[1];

}


validateAssignQueue()
{this.serverTabs=[
  'Server Details', 'Assign Queues'
]
this.showserverTab = this.serverTabs[1];
} 
ActivateOutputTab() {
  debugger;

  if (this.labelCaption == "Next") {
     if(this.testConnectionCheck==false)
     {
      notify("test Connection");
     }
     else{
    this.activateOutputSourecDetailsTab("Assign Queues");

     }
     this.testConnectionCheck==false;
     
  }
  else if (this.labelCaption == "Save") {
    if(this.testConnectionCheck==false)
     { 
       this.activateOutputSourecDetailsTab("Server Details");
      notify("test Connection");
     }
     else{
      this.saveQueue();
      this.showAddPopop = false;
     }
  }
} 

activateOutputSourecDetailsTab(data) {
  if (data == "Assign Queues") {
      this.labelCaption = "Save"
      this.testConnectionCheck==false;
  }
  else if (data == "Server Details") {
      this.labelCaption = "Next"
      this.testConnectionCheck==false;
  }

  this.showserverTab = data;
 
}
  //Function to show/hide custom buttons
  onSelectionChanged(event){
    //To show/hide Delete and Duplicate buttons: If more than 0 checked appears
    this.selectedItemKeys = event.selectedRowKeys;
    if(event.selectedRowsData.length > 0){
      this.deleteBtn = true;
     this.editBtn = true;
     this.addBtn=false;
    }
    else{
      this.deleteBtn= false;
      this.editBtn  = false;
      this.addBtn=true;
    }
    //To hide Duplicate button: If more than 1 checked appears
    if(event.selectedRowsData.length > 1){
      this.editBtn = false;
  this.deleteBtn=true;
  this.addBtn=false;
    }
}


  // Convert Active/Inactive into True/False for toggle button
  isUserActive(isActive:string) {
    if(isActive == 'Active'){
      return true;
    }else{
      return false;
    }
  }


  
 //Function to edit rows
  popupVisible = false;
  getRowIndex:number = 0;
  customEditPopup(b) {
  
    this.getRowIndex = b;
    this.popupVisible = true;
  }

 //Function to delete rows
  deleteRecords() {
    this.Deletepopup = true;
   
}

formServerDto(data: Server) {
  return {
    'QueueHeaderID': data.queueHeaderID,
    'ServerName': data.serverName,
     'DomainName':"",
    'UserName': data.userName,
    'Password': data.password,
    'isDefault':data.isDefault,
    //'isDefault':data.isDefault==null?0 :1,
    'IsActive':data.isActive
 
  }
}


OnVlaueChangesActive(status, serverField) {
  var Queuevalue = this.formQueueisActibveDto(serverField);
  Queuevalue.IsActive = status ? false : true;
  const put$ = this.service.put('queueapi/updateStatus',Queuevalue);
  put$.subscribe(
      data => {
          notify(data['result'].value);
          this.queueList().subscribe(data => {
            this.queuelist = data;
          });
        // this.dataGrid.instance.refresh();
      }, err => { notify('Error'); }
  );

}

formQueueisActibveDto(data) {
  return {
        'QueueHeaderID': data.id,
        'ServerName': data.serverName,
        'DomainName':"",
       'UserName': data.userName,
       'Password': data.password,
       'isDefault':data.isDefault,
       'IsActive':data.isActive
    
}
}
isDefaultUpdate(rowjobstatus, $data){
  const queue =  this.formQueueisActibveDto( $data);
   queue.isDefault=rowjobstatus ? false : true;
   const put$ = this.service.put('queueapi/Updatedefault', queue);
  put$.subscribe(
    data => {
      notify(data['result'].value);
      this.queueList().subscribe(data => {this.queuelist = data;});
      this.selectedItemKeys=[];
      //this.dataGrid.instance.refresh();
    }, err => { notify('Error'); }
  );
 

}

formQueueDeleteDto(data) {
  this.QueueListArray = [];
  for (let i = 0; i < data["length"]; i++) {
      const data1 = data[i];
      var QueueDataList = {
        'QueueHeaderID': data1.id,
        'ServerName': data1.serverName,
        'DomainName':"",
       'UserName': data1.userName,
       'Password': data1.password,
       'isDefault':data1.isDefault,
       'IsActive':data1.isActive
     
      };

      this.QueueListArray.push(QueueDataList);

  }
  return this.QueueListArray;
 
}

deleteRecords1() {
    var queueDto = this.formQueueDeleteDto(this.selectedItemKeys);
   const delete$ = this.service.postAll('queueapi/deleteQueue', queueDto);
    delete$.subscribe(
  data => {
  notify(data['result'].value);
  this.queueList().subscribe(data => {this.queuelist = data;})}
);
this.Deletepopup = false;

}

serverTabs=[
  'Server Details', 'Assign Queues'
]


showserverTab: string = this.serverTabs[0];
activateServerTab(data){
  this.showserverTab = data;
}


addPopup(){
  this.showAddPopop = true;
}

showManageQueuesPopop:boolean=false;
manageQueuesPopup(){
  this.showManageQueuesPopop = true;
}


setfocusserverName(e) {
  window.setTimeout(function () { e.component.focus(); });
}

QueueConnectionTest()
  {
    debugger;
    this.testConnectionStatus="";
   var serverDTo = this.formServerDto(this.serverField);
    const post$ = this.service.postAll('queueapi/QueueConnectionTest', serverDTo);
    post$.subscribe(data => {
      if(data['result'].value=="Connected Successfully")
      { 
      
        this.testConnectionCheck=true;
       this.testConnectionStatus = "Connected Successfully.";
        notify('Connected Successfully'); 
        this.showLoader=false;
      }else if(data['result'].value=="ACCESS_REFUSED - Login was refused using authentication mechanism PLAIN. For details see the broker logfile."){
        
        this.testConnectionCheck=false;
          // this.testConnectionStatus = Connection failed:ACCESS_REFUSED - Login was refused using authentication mechanism PLAIN. For details see the broker logfile.";
         this.testConnectionStatus = "Connection failed:ACCESS_REFUSED - Invalid Username or Password - " + this.serverField.serverName;
          this.showLoader=false;
          notify('Connection failed'); 
      
      }
      else{
        this.testConnectionCheck=false;
        // this.testConnectionStatus = "A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond 192.168.4.212:5672";
       this.testConnectionStatus = "Connection failed because host " +this.serverField.serverName + " has failed to respond";
        this.showLoader=false;
        notify('Connection failed'); 

      }
    // notify(data['result'].value);
   setTimeout(() => {
         // this.loadIndicatorVisible = false;
      }, 2000);
    }, err => {
      this.testConnectionCheck=false;
      //this.loadingVisible = false;
      notify('Connection failed'); 
      this.testConnectionStatus = err.toString();
      this.showLoader=false;
      setTimeout(() => {
      //  this.loadIndicatorVisible = false;
    }, 2000);
       notify(err.toString()); }
    );

  }
 
}




