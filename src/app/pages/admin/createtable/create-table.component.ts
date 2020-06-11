import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxTabPanelModule, DxTextBoxModule, DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxValidationGroupComponent, DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxFormModule, DxPopupModule, DxPopupComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { map, concat, merge, tap } from 'rxjs/operators';
import { CreateMasterTable,KMTableCreate } from '../../../models/createMasterTable.module';
import { Item } from 'angular2-multiselect-dropdown';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent extends ComponentbaseComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @ViewChild('valGroupKM', { static: false }) valGroupKM: DxValidationGroupComponent;
  
 
  MasterTableDetails: CreateMasterTable;
 

  childDatasource = [];
  showAddPopop: boolean = false;
  popuptitle: string;
  childkey: string;
  TableList: CreateMasterTable[];
  CurrentTablename:string;
  KMTableCreateModule:any[]=[];
  KMTableCreateAdd:KMTableCreate;
  constructor(private router: Router, private service: DataService, private message: MessageService) {
    super('CreateTable', 'CreateTable', message, service, environment.apiBaseUrl);

    this.MasterTableDetails = this.initModel();
    this.KMTableCreateAdd=this.initModelKM();
    this.GetMasterTableDetails();
    
  }

  initModel() {
    return new CreateMasterTable(0, null, true, null, null);
  }
  ngOnInit() {

  }
//#region MastereTable Create

  GetMasterTableDetails()
  {
    this.GetTableDetails().subscribe(data => {
      this.TableList = data;
    });
  }

  GetTableDetails() {
    const TableList = this.service.getAll('OntologyApi/GetMasterTabledetails').pipe(map((data: any[]) => data.map((item: any) => {
      return item;
    })));
    return TableList;
  }


  addPopup(title: string) {
    this.MasterTableDetails = this.initModel();
    if (title == "Add") {

      this.popuptitle = "Add Table";

    } else {
      this.popuptitle = "Edit Table";
    }

    this.showAddPopop = true;
  }
  Cancel() {
    this.valGroup.instance.reset(); 
    this.MasterTableDetails = this.initModel();
    this.showAddPopop = false;
  }
  RowCollapsing(e) {
  }
  RowExpanding(e) {
    debugger;
    this.childkey = e.key;
    this.CurrentTablename=e.key;
      this.GetTablefields(e.key);
    e.component.collapseAll(-1);
  }

  GetTablefields(key) {
    debugger;

    this.GetTabledata(key).subscribe(data => {
      this.childDatasource = data;
    });
  }

  GetTabledata(Tablename) {
    return  this.service.getAll('OntologyApi/GetTableRecords?Tablename=' + Tablename).
    pipe(map((data: any) => {
      return data;
  }));
  }
  formSaveDto($data) {
    const row = <CreateMasterTable>$data;
    return {
      MasterTableId:row.masterTableId,
      MasterTableName:row.masterTableName,
      IsActive: row.isActive,
      LastUpdateBy: row.lastUpdateBy,
      LastUpdateDate: row.lastUpdateDate
    }
  }
  Tablesave() { 
debugger;
    const MsterTablDetails = this.formSaveDto(this.MasterTableDetails);
    const post$ = this.service.postAll('OntologyApi/CreatNewTable', MsterTablDetails);
    post$.subscribe(
      data => { 
        notify(data['result'].value);
        this.GetMasterTableDetails();

        this.showAddPopop = false;
      }, err => { notify('Error'); }
    );
  }

  TableRecordInserted:any[]=[];
  logEvent(e,childdata,Action)
  {
    debugger;
    if(Action=='Inserted')
    {
      this.TableRecordInserted.push(e.data);

    }else if(Action=='Inserting')
    {
      this.TableRecordInserted.push(e.data);
    }
      
      const data=childdata;

  }
  
  NewChiledatasouece:any[]=[];
  formSaveTableRowsDto(data,Tablename)
  {
     return{
      ChildTabledata:data,
        Tablename:Tablename
     }
  }
  SaveTableRows(childDatasource)
  {
    debugger;
    childDatasource.forEach(x=>{
      debugger;
      this.NewChiledatasouece.push({displayName:x.displayName,value:x.value});
      });
    const MasterTablDetails = this.formSaveTableRowsDto(this.NewChiledatasouece, this.CurrentTablename);
    this.NewChiledatasouece=[];
    const post$ = this.service.postAll('OntologyApi/SaveChiledTableRows', MasterTablDetails);
    post$.subscribe(
      data => { 
        notify(data['result'].value); 
      }, err => { notify('Error'); }
    );

  }
  formDto($data)
  { 
    return{
    TableName:this.CurrentTablename,
     IsActive:  $data.isActive 
    }
  }
  isactiveUpdate(rowjobstatus, $data){
  debugger
    $data.isActive = rowjobstatus ? false : true;
    const MsterTablDetails = this.formSaveDto( $data);
    const put$ = this.service.put('OntologyApi/UpdateTableStatus',MsterTablDetails);
    put$.subscribe(
      data => {
        notify(data['result'].value); 
      }, err => { notify('Error'); }
    );   
  }
//#endregion


  //#region  KM table
  KMpopuptitle:string;
  KMshowAddPopop:boolean;
  KMTableGridDatasource=[];
  Columndatatype=[{id:1,datatype:'varchar(50)'},{id:2,datatype:'int'},{id:3,type:'date'},{id:4,datatype:'bit'},{id:5,datatype:'double'}]
  
  initModelKM() {
    return new KMTableCreate(0, null, null, null);
  }
  addKMPopup(title: string) {

    this.KMTableCreateAdd=this.initModelKM();
    if (title == "Add") {

      this.KMpopuptitle = "Add KM Table";

    }  
    this.KMshowAddPopop = true;
  }
  CancelKMTable()
  {
    this.valGroupKM.instance.reset();  
    this.KMshowAddPopop = false;
  }
  KMlogEvent(e,childdata)
  {
    debugger;
     //this.KMTableGridDatasource.push(e.data); 
      const data=childdata;

  }
  formSaveKMTable(KMTableCreateModule,tablename)
  {
    return{
      tablename:tablename,
      _KMTabledetails:KMTableCreateModule
    }
 
  }

  KMTablesave()
  {
    debugger;
    this.KMTableGridDatasource.forEach(x=>{
      debugger;
      this.KMTableCreateModule.push({columnname:x.columnname,datatype:x.datatype});
      });
    const TablDetails = this.formSaveKMTable(this.KMTableCreateModule, this.KMTableCreateAdd.tablename);
    this.NewChiledatasouece=[];
    const post$ = this.service.postAll('OntologyApi/KMTableSave', TablDetails);
    post$.subscribe(
      data => { 
        notify(data['result'].value); 
      }, err => { notify('Error'); }
    );

    debugger;
    const dsf=this.KMTableGridDatasource;

  }
  //#endregion
}