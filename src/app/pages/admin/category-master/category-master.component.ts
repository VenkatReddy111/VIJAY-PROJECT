import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxTabPanelModule, DxTextBoxModule, DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxValidationGroupComponent,DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxFormModule, DxPopupModule, DxPopupComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { map, concat, merge, tap } from 'rxjs/operators';
import { DocumentCategory } from '../../../models/DocumentCategory.module';
import { Item } from 'angular2-multiselect-dropdown';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent extends ComponentbaseComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;

  categorys = [];
 
  // isFirstTimeLoad : boolean = true;

   
  value: any[] = [];

  //Variable to maintain delete state of rows
  selectedItemKeys: any[] = [];
  tempDeleteArray: ArrayStore;

  //Variable to show/hide custom buttons
  deleteBtn:boolean = false;  
  editBtn:boolean = false;


   CategoryFiled: DocumentCategory;
  loadingVisible:boolean=false;

  constructor(private router: Router, private service: DataService , private message: MessageService) { 
    super('Category','CategoryMaster', message, service, environment.apiBaseUrl);
 

    this.CategoryFiled = this.initModel();
  
    this.documentcategorylist$();
   
    
  }

  ngOnInit() {
 
  }

  
  //Mock JSON
  
 
  documentcategorylist$() {
    const  server$ = this.service.getAll('DocumentCategoryApi/GetDocumentcategoryMaster').
    pipe(map((data: any) => {
        return data;
    }));
    server$.subscribe(data => { 
    this.categorys = data.filter(x => x.isActive !== null);
    this.CategoryFiled=data.filter(x => x.isActive !== null); 
})
  }
  

  //Function to show/hide custom buttons
  onSelectionChanged(event){
  
    this.selectedItemKeys = event.selectedRowKeys;
    if(event.selectedRowsData.length > 0){
      this.deleteBtn = true;
      this.editBtn = true;
    }
    else{
      this.deleteBtn= false;
      this.editBtn  = false;
    }
    //To hide Duplicate button: If more than 1 checked appears
    if(event.selectedRowsData.length > 1){
      this.editBtn = false;
    }
} 

  isactiveUpdate(rowjobstatus, $data){
 
    $data.isActive = rowjobstatus ? false : true;
    const Category = this.formDto($data);
    const put$ = this.service.put('DocumentCategoryApi/UpdateStatusCategoryMaster', Category);
    put$.subscribe(
      data => {
        notify(data['result'].value);
        this.documentcategorylist$();
       
      }, err => { notify('Error'); }
    );   
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
 
    this.CategoryFiled = this.selectedItemKeys[0];
    const smpt = this.formDto(this.CategoryFiled);
    const delete$ = this.service.delete('DocumentCategoryApi/deletecategory', smpt);
    delete$.subscribe(
      data => {
        notify(data['result'].value);
        this.showAddPopop = false;
        this.documentcategorylist$();
       
      }, err => { notify('Error'); }
    );
    this.dataGrid.instance.refresh();
}


showAddPopop:boolean=false;
popuptitle:string;
addPopup(title:string){

  this.CategoryFiled = this.initModel();
  if(title=="Add")
  {
    this.valGroup.instance.reset();
    this.CategoryFiled = this.initModel();
    this.popuptitle="Add Category";
   
  }else
  {
     this.popuptitle="Edit Category"; 
  }
  
  this.showAddPopop = true; 
}

initModel() {
  return new  DocumentCategory(0, 0,null, null,null,true);
} 
save() {
  
  if (this.CategoryFiled.Id === 0) {
    const Category = this.formSaveDto(this.CategoryFiled);
    const post$ = this.service.postAll('Documentcategoryapi/SaveCategory', Category);
    this.documentcategorylist$();
    
    post$.subscribe(
      data => {
       
        notify(data['result'].value);
        this.showAddPopop = false;
        this.documentcategorylist$();
       
      }, err => { notify('Error'); }
    );
  }
   else {
     debugger;
    const Category = this.formSaveDto(this.CategoryFiled);
    const put$ = this.service.put('Documentcategoryapi/UpdateCategory', Category); 
    put$.subscribe(
      data => {
        debugger;
        notify(data['result'].value);
        this.showAddPopop = false;
        this.documentcategorylist$(); 
      }, err => { notify('Error'); }
    );
  }
}

formDto($data) { 
  const row = <DocumentCategory>$data;
  return {
    'Id': $data.id,
    'CustomerID': $data.customerID,
    'CategoryName': $data.categoryName,
    'Description': $data.description,
    'CustomerName': $data.customerName, 
    'isActive':$data.isActive
  };
}
formSaveDto($data) {
 
  const row = <DocumentCategory>$data;
  return {
    'Id':row.Id,
    'CustomerID': row.CustomerID,
    'CategoryName': row.CategoryName,
    'Description':row.Description,
    'CustomerName':row.CustomerName, 
    'IsActive':$data.isActive
  };
}
result:any;
edit() { 
     this.result= this.formDto(this.selectedItemKeys[0]);
  this.CategoryFiled = this.result; 
}
Cancel() {
  this.valGroup.instance.reset(); 
  this.CategoryFiled = this.initModel();  
  this.showAddPopop = false;  
}
 
}