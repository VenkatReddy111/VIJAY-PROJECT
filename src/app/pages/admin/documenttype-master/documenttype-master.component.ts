import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxTabPanelModule, DxTextBoxModule, DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxValidationGroupComponent, DxFormModule, DxPopupModule, DxPopupComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { map, concat, merge, tap } from 'rxjs/operators';
import { DocumentCategory } from '../../../models/documentcategory.module';
import { DocumentTypeMaster } from '../../../models/DocumentType.module';
import { Item } from 'angular2-multiselect-dropdown';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-documenttype-master',
    templateUrl: './documenttype-master.component.html',
    styleUrls: ['./documenttype-master.component.scss']
})
export class DocumentTypeMasterComponent extends ComponentbaseComponent implements OnInit {


    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

    @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;

    @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;

    DocTypeModel: DocumentTypeMaster;
    doccategories: any;
    doctypegrid = [];
    selectedItemKeys: any[] = [];
    deleteBtn: boolean = false;
    editBtn: boolean = false;
    showteststatus = true;
    loadingVisible: boolean = false;
    constructor(private router: Router, private service: DataService, private message: MessageService) {
        super('Type', 'DocumentType', message, service, environment.apiBaseUrl);
        this.DocTypeModel = this.initDocumentTypeModel(); 
        this.getdocumenttypesgrid$();
        this.getdocumentcategories$();
       
    }

    ngOnInit() {

    }
    showAddPopop: boolean = false;
    popuptitle: string;
    getdocumentcategories$() {
       
        const server$ = this.service.getAll('DocumentCategoryApi/Getdocumentcategory').
            pipe(map((data: any) => {
                return data;
            }));
        server$.subscribe(data => {
           
            this.doccategories = data.filter(x => x.isActive === true && x.isActive !== null);

        })
    }
    validateMandatoryFieldValue(eventData) {
        if (eventData.value == '' || eventData.value == null) {
            return false;
        }
        else {
            return true;
        }
    }
    addPopup(title: string) {

        
        if (title == "Add") {
            this.DocTypeModel = this.initDocumentTypeModel();
            this.popuptitle = "Add Function";
            this.valGroup.instance.reset();
        } else {
            this.popuptitle = "Edit Function";

        } 
        this.showAddPopop = true; 
    }
    initDocumentTypeModel() {
        return new DocumentTypeMaster(0, 0, null, null, null, true);
    }
    //  document type grid binding

    getdocumenttypesgrid$() {
       
        const server$ = this.service.getAll('DocumentCategoryApi/Getdocumenttype').
            pipe(map((data: any) => {
                return data;
            }));
        server$.subscribe(data => {

            this.doctypegrid = data.filter(x => x.isActive !== null);
           // this.DocTypeModel = data.filter(x => x.isActive !== null);
        })
    }

    onSelectionChanged(event) { 
        this.selectedItemKeys = event.selectedRowKeys;
        if (event.selectedRowsData.length > 0) {
            this.deleteBtn = true;
            this.editBtn = true;
        }
        else {
            this.deleteBtn = false;
            this.editBtn = false;
        }
        //To hide Duplicate button: If more than 1 checked appears
        if (event.selectedRowsData.length > 1) {
            this.editBtn = false;
        }
    }
    isactiveUpdate(rowjobstatus, $data) {
 
        $data.isActive = rowjobstatus ? false : true;
        const Doctype = this.formDto($data);
        const put$ = this.service.put('DocumentCategoryApi/UpdateStatusDocTypeMaster', Doctype);
        put$.subscribe(
            data => {
                notify(data['result'].value);
                this.getdocumenttypesgrid$();

            }, err => { notify('Error'); }
        );
    }
 
    
    formDto($data) {

        const row = <DocumentTypeMaster>$data;
        return {
            'Id': $data.id,
            'DocumentCatID': $data.documentCatID,
            'Name': $data.name,
            'Description': $data.description,
            'IsActive': $data.isActive
        };
    }
    formSaveDto($data) {

        const row = <DocumentTypeMaster>$data;
        return {
            'Id': $data.id,
            'DocumentCatID': $data.documentCatID,
            'Name': $data.name,
            'Description': $data.description,
            'IsActive': true
        };
    }
    popupVisible = false;
    getRowIndex:number = 0;
    customEditPopup(b) {
    
      this.getRowIndex = b;
      this.popupVisible = true;
    }
    edit() {

        this.DocTypeModel = this.selectedItemKeys[0];
    }
    save() {
        debugger;
        this.showteststatus = true;
        if (this.DocTypeModel.doctypeTypeID === 0) {

            const Doctypes = this.formSaveDto(this.DocTypeModel);
            const post$ = this.service.postAll('Documentcategoryapi/SaveDocType', Doctypes);

            post$.subscribe(
                data => {
                    notify(data['result'].value);
                    this.showAddPopop = false;
                    this.getdocumenttypesgrid$();

                }, err => { notify('Error'); }
            );
        }
        else {

            const Doctype = this.formDto(this.DocTypeModel);
            const put$ = this.service.put('Documentcategoryapi/UpdateDocType', Doctype);
            put$.subscribe(
                data => {
                    notify(data['result'].value);
                    this.showAddPopop = false;
                    this.getdocumenttypesgrid$();
                }, err => { notify('Error'); }
            );
        }
    }
    Cancel() { 
        this.showAddPopop = false;  
            this.DocTypeModel = this.initDocumentTypeModel(); 
      this. getdocumenttypesgrid$();
    }


}