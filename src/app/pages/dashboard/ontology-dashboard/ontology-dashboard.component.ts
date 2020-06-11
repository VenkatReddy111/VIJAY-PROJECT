
import { Component, OnInit, NgModule, ViewChild, HostListener, Input } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent, DxFileUploaderComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { DocumentSubType } from 'src/app/models/documentsubtype.module';
import { DocumentTypeDLLMapping } from 'src/app/models/ontology.module';
import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';

import { map, catchError } from 'rxjs/operators';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { debug } from 'util';

export enum KEY_CODE {
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
  O = 79,
  space = 32,
  M = 77,
  R = 82,
  A = 65,
  S = 83,
  F = 70,
  D = 68,
  Q = 81,
  W = 87,
  E = 69,
  L = 76,
  I = 73,

}


@Component({
  selector: 'app-ontology-dashboard',
  templateUrl: './ontology-dashboard.component.html',
  styleUrls: ['./ontology-dashboard.component.scss']
})


export class OntologyDashboardComponent extends ComponentbaseComponent implements OnInit {


  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;
  @ViewChild('valDuplicate', { static: false }) valDuplicate: DxValidationGroupComponent;
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @ViewChild('valGroupdll', { static: false }) valGroupdll: DxValidationGroupComponent;
  @ViewChild('valPrfGroup', { static: false }) valPrfGroup: DxValidationGroupComponent;
  

  @ViewChild('vwfileUploaderProfileImage', { static: false }) vwfileUploaderProfileImage: DxFileUploaderComponent;
  @ViewChild('DLLfileUploader', { static: false }) DLLfileUploader: DxFileUploaderComponent;

  value: any[] = [];

  // Variable to maintain delete state of rows
  selectedItemKeys: any[] = [];
  tempDeleteArray: ArrayStore;
  uploadImage: boolean = false;
  gosmevisible: boolean = false;

  //Variable to show/hide custom buttons
  deleteBtn: boolean = false;
  duplicateBtn: boolean = false;
  editBtn: boolean = false;
  addBtn: boolean = true;

  filenameedit: string = '';
  // developer variable declaration
  docSubTypeModel: DocumentSubType;
  documentSubTypes: any;
  uploadUrl = environment.apiBaseUrl + 'OntologyApi/UploadSyncSubTypeFile';
  fileUploaderProfileImage: any;
  fileName: string;
  fileType: string;
  edituploadedfile: string;
  doccategories: any;
  doctypes: any;
  categorycount: number;
  docTypecount: number;
  docsubtypecount: number;
  isactivecount: number;
  tempdeletedocs: any[] = [];
  duplicatesubtype: string;

  popupTitle: string = 'Edit Document';
  // developer variable declaration
  // Function to edit rows
  popupVisible = false;
  getRowIndex = 0;
  // Custom duplicate popup
  duplicatePopupVisible = false;
  orderService: any;
  deleteModal: boolean = false;
  Doctext: string;
  userstatus: string;
  userstatuss: string;
  Dllfileupload: any;
  DocumentTypeDLLMapping: any;
  DocumentTypeDLLMappingData = [];
  DocumentTypeDLLMappingModel: DocumentTypeDLLMapping[];
  DocTypeStatusSave: any;
  DocTypePRFStatusSave: any;
  docTypePRFModel: DocumentSubType;
  DocumentTypePRFMappingData = [];
  showLoader: boolean = false; //for page loader //https://www.w3schools.com/howto/howto_css_loader.asp
  showDLLoader: boolean = false;
  constructor(private router: Router, private service: DataService, private message: MessageService) {
    super('Document / Ontology', 'Creatordashboard', message, service, environment.apiBaseUrl);
    // To delete rows
    // this.valGroup.instance.reset();
    this.DocumentTypeDLLMapping = this.initDocumentDLModel();
    this.docSubTypeModel = this.initDocumentSubTypeModel(); // single document subtype model
    this.getdocumentcategories$().subscribe(data => { this.doccategories = data; }); // category dropdown binding
    this.getdocumenttypes$().subscribe(data => { this.doctypes = data; }); // document type dropdown binding     
    this.getdocumentSubTypeList$().subscribe(data => { this.documentSubTypes = data; this.dashboardLabelCount(); }); // document subtype list to bind grid

  }
  initDocumentDLModel() {
    return new DocumentTypeDLLMapping(0, 0, 0, null, null, null, null, null, 0, false, null, null, null);
  }
  ngOnInit() {
    // this.valGroup.instance.reset();
  }

  //#region upload Dll File for TrucapSSOn
  showAddPopop: boolean = false;
  CategoryNamelabel: string;
  dllPopupTitle:string;
  DocumenttypeNamelabel: string;
  addPopup(e) {     
    this.DocumentTypeDLLMapping = this.initDocumentDLModel();
    this.valGroupdll.instance.reset();
    this.filenameedit = '';
    this.docSubTypeModel = e;
    this.dllPopupTitle = 'Industry : ' + e.docCategoryName + ' | Function : ' + e.documentTypeName;
    this.CategoryNamelabel = this.docSubTypeModel.docCategoryName;
    this.DocumenttypeNamelabel = this.docSubTypeModel.documentTypeName;
    this.GetDocumentDLLData$(this.docSubTypeModel.documentTypeId).subscribe(data => { this.DocumentTypeDLLMappingData = data });
    this.showAddPopop = true;
  }
  GetDocumentDLLData$(documentTypeId) {
    const sendPrm = '?documentTypeId=' + documentTypeId;
    return this.service.getAll('OntologyApi/GetDocumentDLLData', sendPrm).
      pipe(map((data: any) => { return data }))
  }
  Cancel(DLLfileUploader) {
    DLLfileUploader.instance.reset();
    this.showAddPopop = false;
  }
  formDtoDLLFile($data) {

    const row = <DocumentTypeDLLMapping>$data
    return {
      DocTypeDllmappingId: 0,//row.docTypeDllMappingId,
      DocumentCatId: $data.docCategoryId,
      DocumentTypeId: $data.documentTypeId,
      CategoryName: $data.docCategoryName,
      DocumentTypeName: $data.documentTypeName,
      FileType: row.fileType,
      FilePath: row.filePath,
      FileName: this.fileName,
      VersionNo: row.versionNo,
      IsMapped: row.isMapped,
      UploadDate: $data.uploadDate,
      MappedDate: $data.mappedDate,
      DLLfileUploader: row.DLLfileUploader

    }
  }
  formDtoUpdateStatus($doc, Values) {
    return {
      DocTypeDllmappingId: $doc.docTypeDllmappingId,
      DocumentCatId: $doc.documentCatId,
      DocumentTypeId: Values.documentTypeId,
      CategoryName: $doc.categoryName,
      DocumentTypeName: $doc.documentTypeName,
      FileType: $doc.fileType,
      FilePath: $doc.filepath,
      FileName: $doc.fileName,
      VersionNo: $doc.versionNo,
      IsMapped: $doc.isActive,
      UploadDate: $doc.uploadDate,
      MappedDate: $doc.mappedDate,
      DLLfileUploader: $doc.DLLfileUploader
    }
  }

  formDTONewstatus(result,Values)
  {
    return{    
    DocTypeDllmappingId: result.docTypeDllmappingId,
    DocumentCatId: result.DocumentCatId,
    DocumentTypeId: Values.DocumentTypeId,
    CategoryName: result.categoryName,
    DocumentTypeName: result.documentTypeName,
    FileType: result.fileType,
    FilePath: result.filepath,
    FileName:result.fileName,
    VersionNo: result.versionNo,
    IsMapped: result.isMapped,
    UploadDate: result.uploadDate,
    MappedDate: result.mappedDate,
    DLLfileUploader: result.DLLfileUploader
    }
  }

  UpdateDllStatus(status, doc) {   
    doc.isActive = status ? false : true;
    this.DocTypeStatusSave = this.formDtoUpdateStatus(doc, this.docSubTypeModel);
  }
  FileExtention: string; 
  UploadDll() {     
    this.showDLLoader=true;
    const Values = this.formDtoDLLFile(this.docSubTypeModel);
    Values.FileType = this.fileType;
    Values.DLLfileUploader = this.Dllfileupload;

    const result = this.DocumentTypeDLLMappingData.filter(x => x.isMapped == true);

    if (Values.DocTypeDllmappingId == 0 && Values.DLLfileUploader != undefined && Values.FileType != "" && Values.FileType != undefined) {
      if (result.length == 1 || result.length == 0)//check here to only one record exist for dll mapping 
      {
        const put$ = this.service.postAll('OntologyApi/UploadDll', Values);
        put$.subscribe(
          data => {             
            notify(data['result'].value);
            this.showAddPopop = false;
            this.showDLLoader=false;
          }, err => { this.showDLLoader=false; notify('Error'); }
        );
      } else {
        this.showDLLoader=false;
        notify('you cannot map more than one dll file... please disabled previous one and map new dll');
      }
    }
    else {
      if (result.length != 1) {
        this.showDLLoader=false;
        notify('you cannot map more than one dll file... please disabled previous one and map new dll');
      }
      else {
        //this is for update dll mapped status
        const $result=this.formDTONewstatus(result[0],Values);
        const post$ = this.service.postAll('OntologyApi/UpdatedllDocumentStatus', ($result))
          .subscribe(
            data => {
              notify(data['result'].value);
              this.showAddPopop = false;
              this.showDLLoader=false;
            }, err => {
              this.showDLLoader=false;
              notify('Error');
            }
          );
      }
    }
  }
  UploadDLLFile(e) {     
    if (!e.element.textContent.includes('Please select dll file only')) {
      this.filenameedit = '';
      this.uploadImage = true;
      const file = e.value[0];
      this.fileName = file.name;
      //this.edituploadedfile = '';
      this.fileType = (file.name.slice(file.name.lastIndexOf(".") - 1 >>> 0) + 2);
      // this.fileType = file.name.split('.')[1].toString();
      const fr = new FileReader();
      fr.onload = (e) => {
        this.Dllfileupload = fr.result;
      };
      fr.readAsDataURL(file);
    }
    else {
      this.filenameedit = '';
      this.uploadImage = false;
      this.Dllfileupload = null;
      notify('Please select dll file');
    }
  }

  //#endregion

  // Empty document subtype model while cancel and save 
  initDocumentSubTypeModel() {
    return new DocumentSubType(0, 0, '', '', false, '', '', '', 0, 0, null, '', '', '', '', 0, true);
  }

  // get all document types for drop down binding
  getdocumenttypes$() {
    return this.service.getAll('OntologyApi/Getdocumenttype').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        documentTypeId: item.id,
        documentTypeName: item.name,
      };
    })));
  }

  //  document type grid binding : All subtype results binding 
  getdocumentSubTypeList$() {
    return this.service.getAll('OntologyApi/Getdocumentsubtype')
      .pipe(map((data: any[]) => data.map((item: any) => {
        return new DocumentSubType(item.id, item.documentTypeId, item.name, item.description, item.isStandard, item.documentType.name,
          item.docFilterField, item.docFilterValue, item.inputSourceID, item.languageID, null
          , '', '', item.imagePath, item.docCategoryName, item.documentType.documentCatID, item.isActive);
      })));
  }

  // document category dropdown binding
  getdocumentcategories$() {
    return this.service.getAll('DocumentCategoryApi/Getdocumentcategory').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        documentCatId: item.id,
        categoryName: item.categoryName,
      };
    }))
    );
  }


  // returning Document type drop down data
  getdrpdocumenttypeslist$(sendPrm) {
    return this.service.getAll('OntologyApi/GetCategorydocument', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'documentTypeId': item.id,
        'documentTypeName': item.name,
      };
    })));
  }

  // Event Fired on category changed
  documentcategoryChanged(e) {
    if (e.value != null && e.value !== 0) {
      const sendPrm = '?id=' + e.value;
      this.getdrpdocumenttypeslist$(sendPrm).subscribe(data => {
        this.doctypes = data;
      });
    } else {
      this.doctypes = null;
    }
  }

  // Dashboard all label count like type count , subtype count , category count 
  dashboardLabelCount() {
    let categories = [];
    let doctype = [];
    let subtype = [];
    let isactive = [];

    categories = [...new Set(this.documentSubTypes.map((item: any) => item.docCategoryId))];
    this.categorycount = categories.length;

    doctype = [...new Set(this.documentSubTypes.map((item: any) => item.documentTypeId))];
    this.docTypecount = doctype.length;


    subtype = [...new Set(this.documentSubTypes.map((item: any) => item.documentSubTypeId))];
    this.docsubtypecount = subtype.length;

    isactive = this.documentSubTypes.filter(x => x.isActive === true);
    this.isactivecount = isactive.length;

  }

  // this code only visible popup .. Edit logic is written in onSelectionChanged 
  subdocTypeEditClick() {
    // this.docSubTypeModel = e;
    this.popupTitle = 'Edit Document';
    if (this.docSubTypeModel.documentSubTypeId != 0) {
      if (this.filenameedit == "" && this.docSubTypeModel.filePath != "" && this.docSubTypeModel.filePath != null) {
        this.filenameedit = this.docSubTypeModel.filePath.split('\\')[2]
      }
      this.popupVisible = true;
    }
  }

  // when user click on GRid subtype anchor link
  gotoSMEDetail(e) {
    this.docSubTypeModel = e;
    var url = '/sme';
    var id = this.docSubTypeModel.documentSubTypeId;
    var myurl = url + '/' + id;
    this.router.navigate([url, id]);

  }

  // Data Transformation object for document SUbtype while edit
  formEditDto(data: DocumentSubType) {
    return {
      Id: data.documentSubTypeId,
      DocumentTypeId: data.documentTypeId,
      Name: data.name,
      Description: data.description,
      IsStandard: data.isStandard,
      fileUploaderProfileImage: data.fileUploaderProfileImage,
      fileName: data.fileName,
      fileType: data.fileType,
      DocFilterField: data.docFilterField,
      DocFilterValue: data.docFilterValue,
      InputSourceID: data.inputSourceID,
      LanguageID: data.languageID,
      ImagePath: data.filePath,
      DocCategoryId: data.docCategoryId,
      IsActive: data.isActive
    };
  }


  formAddingDto(data: any) {
    return {
      Id: data.documentSubTypeId,
      DocumentTypeId: data.documentTypeId,
      Name: data.name,
      Description: data.description,
      IsStandard: data.isStandard,
      fileUploaderProfileImage: data.fileUploaderProfileImage,
      fileName: data.fileName,
      fileType: data.fileType,
      IsActive: data.isActive
    };
  }


  uploadProfileImage(e) {     
    if (!e.element.textContent.includes('Please select an image or pdf file only')) {
      this.filenameedit = '';
      this.uploadImage = true;
      const file = e.value[0];
      this.fileName = file.name;
      //this.edituploadedfile = '';
      this.fileType = file.name.split('.')[1].toString();
      const fr = new FileReader();
      fr.onload = (e) => {
        this.fileUploaderProfileImage = fr.result;
      };
      fr.readAsDataURL(file);
    }
    else {
      this.filenameedit = '';
      this.uploadImage = false;
      this.fileUploaderProfileImage = null;
    }
  }


  saveAddEditDocumentSubType(e) {    
    if (this.docSubTypeModel.documentSubTypeId === 0) {
      const values = this.formAddingDto(this.docSubTypeModel);
      values.fileUploaderProfileImage = this.fileUploaderProfileImage;
      values.fileName = this.fileName;
      values.fileType = this.fileType;
      const post$ = this.service.postAll('OntologyApi/savesubdoctype', values);
      post$.subscribe(data => {
        if (data['result'].value != 'Document Type name already exists') {
          this.popupVisible = false;
          this.valGroup.instance.reset();
          notify(data['result'].value);
          this.deleteBtn = false;
          this.duplicateBtn = false;
          this.editBtn = false;
          this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
          this.dashboardLabelCount();
          this.dataGrid.instance.refresh();
          this.valGroup.instance.reset();
        }
        notify(data['result'].value);
      }, err => {
        notify('Document is not saved successfully');
      }
      );
    }
    else {
      const values = this.formEditDto(this.docSubTypeModel);
      if (this.fileUploaderProfileImage != null) {
        values.fileUploaderProfileImage = this.fileUploaderProfileImage;
        values.fileName = this.fileName;
        values.fileType = this.fileType;
      }
      const put$ = this.service.put('OntologyApi/savesubdoctype', values);
      put$.subscribe(data => {

        this.popupVisible = false;
        notify(data['result'].value);
        this.filenameedit = '';
        this.fileName = ' ';
        this.deleteBtn = false;
        this.duplicateBtn = false;
        this.editBtn = false;
        this.docSubTypeModel = this.initDocumentSubTypeModel();
        this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
        this.dashboardLabelCount();
        this.dataGrid.instance.refresh();
        this.valGroup.instance.reset();
      }, err => {
        notify('Document is not saved successfully');
      }
      );
    }

  }

  ClearSubtypeModel(vwfileUploaderProfileImage) {
    this.popupVisible = false;
    this.edituploadedfile = '';
    this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
    // if (this.docSubTypeModel.filePath == '' || this.fileName == '' || this.docSubTypeModel.description == '' || this.docSubTypeModel.documentTypeId == 0 || this.docSubTypeModel.docCategoryId == 0 || this.docSubTypeModel.name == '') {
    //   this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
    // }
    vwfileUploaderProfileImage.instance.reset();
  }


  UpdateDocumentStatus(status, doc) {     
    doc.isActive = status ? false : true;
    const post$ = this.service.postAll('OntologyApi/UpdateSubDocumentStatus', this.formEditDto(doc)).subscribe(
      data => {
        if (data['result'].value == 'Subtype cannot be deactivated, it has active input source') {
          notify(data['result'].value);
        }
        else {
          notify('Status changed successfully.');
        }
        this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
        this.edituploadedfile = '';
        this.dashboardLabelCount();

      }, err => {
        notify('Logged in user does not have permission to update status.');
        this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
        this.edituploadedfile = '';
        this.dashboardLabelCount();
      }
    );
  }
  // developer Code


  validateMandatoryFieldValue(eventData) {
    if (eventData.value == '' || eventData.value == null) {
      return false;
    }
    else {
      return true;
    }
  }
  // Function to show/hide custom buttons
  OntologyDSHSelectionChanged(event) {
    // To show/hide Delete and Duplicate buttons: If more than 0 checked appears
    this.selectedItemKeys = event.selectedRowKeys;
    if (event.selectedRowsData.length == 1) {
      this.docSubTypeModel = this.selectedItemKeys[0];
      if (this.selectedItemKeys[0].filePath != null && this.selectedItemKeys[0].filePath != "") {
        let varfileName = '';
        varfileName = this.selectedItemKeys[0].filePath.split('\\')[2];
        this.docSubTypeModel.filePath = this.selectedItemKeys[0].filePath;
        this.filenameedit = varfileName;
      }
      this.deleteBtn = false;
      this.duplicateBtn = true;
      this.editBtn = true;
      this.addBtn = false;
    }
    else {
      this.docSubTypeModel = this.initDocumentSubTypeModel();
      this.deleteBtn = false;
      this.editBtn = false;
      this.duplicateBtn = false;
      this.addBtn = true;
    }
    if (event.selectedRowsData.length > 1) {
      var a = this.selectedItemKeys.length;
      for (var i = 0; i < a - 1; i++) {
        if ((event.selectedRowsData[i].isActive) == (event.selectedRowsData[i + 1].isActive)) {
          this.deleteBtn = true;
          this.duplicateBtn = false;
          this.editBtn = false;
          this.addBtn = false;
          if (this.selectedItemKeys[0].isActive == true) {
            this.Doctext = "Deactivate";
            this.userstatus = "Deactivate Status";
            this.userstatuss = "Do you want to deactivate selected Documents?";
          }
          else {
            this.Doctext = "Activate";
            this.userstatus = "Activate Status";
            this.userstatuss = "Do you want to activate selected Documents?";
          }
        }
        else {
          this.deleteBtn = false;
          this.duplicateBtn = false;
          this.editBtn = false;
          this.addBtn = false;
          return;
        }
      }
    }
  }

  saveDuplicateSubtype() {
    this.docSubTypeModel.name = this.duplicatesubtype;
    const values = this.formEditDto(this.docSubTypeModel);
    const post$ = this.service.postAll('OntologyApi/saveduplicatesubdoctype', values);
    post$.subscribe(data => {
      this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });

      this.docSubTypeModel = this.initDocumentSubTypeModel();
      this.deleteBtn = false;
      this.duplicateBtn = false;
      this.editBtn = false;

      this.edituploadedfile = '';
      notify(data['result'].value);
      this.dataGrid.instance.refresh();
      this.duplicatePopupVisible = false;
    }, err => {
      notify('Subtype is not duplicated successfully');
    }
    );
  }

  cancelDuplicateSubtype() {
    this.valDuplicate.instance.reset();
    this.duplicatePopupVisible = false;
    // this.getdocumentSubTypeList$().subscribe(a => { this.documentSubTypes = a; });
    this.docSubTypeModel = this.initDocumentSubTypeModel();
    this.deleteBtn = false;
    this.duplicateBtn = false;
    this.editBtn = false;

    this.dataGrid.instance.clearSelection();
    this.dataGrid.instance.refresh();
    this.edituploadedfile = '';

  }

  // Convert Active/Inactive into True/False for toggle button
  isUserActive(isActive: string) {
    if (isActive === 'Active') {
      return true;
    } else {
      return false;
    }
  }

  customEditPopup(b: number) {

    this.getRowIndex = b;
    this.popupTitle = 'Edit Document';
    this.docSubTypeModel = this.documentSubTypes[b];
    this.popupVisible = true;
  }


  customAddPopup() {
    this.valGroup.instance.reset();
    this.popupTitle = 'Add Document';
    //this.docSubTypeModel = this.initDocumentSubTypeModel();
    this.popupVisible = true;
  }
  //Function to delete rows
  deleteRecords() {
    this.deleteModal = true;
  }

  deleteModalFun() {
    this.selectedItemKeys.forEach((key) => {
      this.tempDeleteArray.remove(key);
    });
    this.deleteModal = false;
    this.dataGrid.instance.refresh();
  }

  delete() {
    var a = this.selectedItemKeys.length;
    for (var i = 0; i < a; i++) {
      this.docSubTypeModel = this.selectedItemKeys[i];
      this.UpdateDocumentStatus(this.docSubTypeModel.isActive, this.docSubTypeModel);
    }
    this.deleteModal = false;
    this.dataGrid.instance.clearSelection();
  }


  duplicatePopup() {
    this.duplicatePopupVisible = true;
  }


  redirect() {
    this.router.navigate(['./sme']);
  }


  convertDashboardCounter(count) {
    if (count >= 1000000) {
      return (count / 1000000) + " Million ";
    }
    else if (count >= 1000) {
      return (count / 1000) + " K ";
    }
    else {
      return count;
    }
  }

  convertDashboardCounterplurals(count, dashboardtitle) {
    if (dashboardtitle == 'Category') {
      if (count > 1) return 'Industries'; else return 'Industry';
    }
    if (dashboardtitle == 'Type') {
      if (count > 1) return 'Functions'; else return 'Function';
    }

    if (dashboardtitle == 'Subtype') {
      if (count > 1) return 'Documents'; else return 'Document';
    }
  }

  //#region Manage prf
  smePopupTitle: string;
  createButtonTitle: string;
  showManagePrfPopop: boolean = false;

  managePrfPopup(e) {     
    this.valPrfGroup.instance.reset();
    this.createButtonTitle = "Create Config";
    this.docTypePRFModel = e;
    this.GetDocumentPRFData$(e.documentTypeId).subscribe(data => {  this.DocumentTypePRFMappingData = data });
    this.smePopupTitle = 'Industry : ' + e.docCategoryName + ' | Function : ' + e.documentTypeName;
    this.showManagePrfPopop = true;
  }
  GetDocumentPRFData$(documentTypeId) {
    const sendPrm = '?documentTypeId=' + documentTypeId;
    return this.service.getAll('OntologyApi/GetDocumentPRFData', sendPrm).
      pipe(map((data: any) => { return data }))
  }
  managePrfCancel() {
    this.showManagePrfPopop = false;
    this.showLoader = false;
    this.smePopupTitle = "";
  }

  CreatePRF() {
    this.showLoader = true;
    this.createButtonTitle = "Please wait...";
    const Values = this.formDtoCreatePrfStatus(this.docTypePRFModel);
    const put$ = this.service.postAll('OntologyApi/UpdatePrfStatus', Values);
    put$.subscribe(
      data => {
        notify(data['result'].value);
        this.showManagePrfPopop = false;
        this.showLoader = false;
        this.createButtonTitle = "Create Config";
      }, err => {
        notify('Error');
        this.showManagePrfPopop = false;
        this.showLoader = false;
        this.createButtonTitle = "Create Config";
      }
    );
  }

  formDtoCreatePrfStatus($doc) {
    return {
      DocTypePrfstatusId: 0,
      DocumentCatId: $doc.docCategoryId,
      DocumentTypeId: $doc.documentTypeId,
      CategoryName: $doc.docCategoryName,
      DocumentTypeName: $doc.documentTypeName,
    }
  }

  UpdatePRFMapStatus(status, doc) {     
    this.showLoader = true;
    doc.isActive = status ? false : true;
    this.DocTypePRFStatusSave = this.formDtoUpdateMappingStatus(doc, this.docTypePRFModel);
    const post$ = this.service.postAll('OntologyApi/UpdatePRFMappingStatus', (this.DocTypePRFStatusSave))
        .subscribe(
          data => {
            notify(data['result'].value);
            this.showLoader = false;
            this.GetDocumentPRFData$(this.docTypePRFModel.documentTypeId).subscribe(data => { this.DocumentTypePRFMappingData = data });
            //this.showManagePrfPopop = false;
          }, err => {
            this.showLoader = false;
            notify('Error');
          }
        );
  }

  formDtoUpdateMappingStatus($doc, Values) {
    return {
      DocTypeDllmappingId: $doc.docTypeDllmappingId,
      DocumentCatId: $doc.documentCatId,
      DocumentTypeId: Values.documentTypeId,
      CategoryName: $doc.categoryName,
      DocumentTypeName: $doc.documentTypeName,
      FileType: $doc.fileType,
      FilePath: $doc.filepath,
      FileName: $doc.fileName,
      VersionNo: $doc.versionNo,
      IsMapped: $doc.isActive 
    }
  }

  //below function is of save button click but not use as of now due to toogle save issue on button click
  UpdatePRFMapping()
  {    
    this.showLoader = true;
    const result = this.DocumentTypePRFMappingData.filter(x => x.isMapped == true);
    if (result.length == 0) {
      this.showLoader = false;
      notify('Please click on mapping option to map config file and then click on save mapping button');
    }
    else if (result.length > 1) {
      this.showLoader = false;
      notify('you cannot map more than one config file... please disable previous one and map new config file');
    }
    else {   
      const post$ = this.service.postAll('OntologyApi/UpdatePRFMappingStatus', (this.DocTypePRFStatusSave))
        .subscribe(
          data => {
            notify(data['result'].value);
            this.showLoader = false;
            this.showManagePrfPopop = false;
          }, err => {
            this.showLoader = false;
            notify('Error');
          }
        );
    }
  }
  //#endregion
}





