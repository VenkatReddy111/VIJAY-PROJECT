import { Component, OnInit, NgModule, ViewChild, ElementRef, Input, Output, } from '@angular/core';
import { ConcatSource } from 'webpack-sources';
import { BrowserModule } from '@angular/platform-browser';
import { DxTabPanelModule, DxDataGridComponent, DxListComponent } from 'devextreme-angular';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { DocumentField } from '../../models/documentfield.module';
import { controlvalues, FieldParameterinfo } from '../../models/ontology.module';

import { DataService } from 'src/app/data.service';
import { map, concat, merge, tap, filter, single, reduce, mergeMap, groupBy, toArray } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SynonymsDetails } from '../../models/Synonyms.module';
import notify from 'devextreme/ui/notify';
import { FieldRuleValidation } from 'src/app/models/FieldRuleValidation.module';
import { FieldValidationMapping } from 'src/app/models/FieldValidationMapping.module';
import { FieldRegExpressionMapping } from 'src/app/models/fieldRegExpressionMapping.module';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSubType } from 'src/app/models/documentsubtype.module';
import { DocumentTypeTable } from 'src/app/models/documenttypetable.module';
import { DxValidationGroupComponent, DxDrawerComponent } from 'devextreme-angular';
import { ROIXmlModel, ROIFieldModel, ROIDetailModel, ROIViewModel, ROIParametersModel } from '../../models/roimarking.module';
import { debug } from 'util';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-smedashboard',
  templateUrl: './smedashboard.component.html',
  styleUrls: ['./smedashboard.component.scss']

})

export class SMEDashboardComponent extends ComponentbaseComponent implements OnInit {


  //Declaration of comoponent which use in html and refer with viewchild option 
  //to perform and control actions, validation of component
  @ViewChild('valOntology', { static: false }) valOntology: DxValidationGroupComponent;
  @ViewChild('valCreateTable', { static: false }) valCreateTable: DxValidationGroupComponent;
  @ViewChild('targetGroup', { static: false }) targetGroup: DxValidationGroupComponent;
  @ViewChild('vwlist', { static: false }) vwlist: DxListComponent;
  @ViewChild('vwlistAuto', { static: false }) vwlistAuto: DxListComponent;

  public type: string = 'component';
  //public config: PerfectScrollbarConfigInterface = {};
  //@ViewChild('perfectScroll', {static:false}) perfectScroll: PerfectScrollbarComponent;
  @ViewChild('perfectScroll', { static: false }) directiveRef?: PerfectScrollbarDirective;

  //@ViewChild(PerfectScrollbarComponent, {static:false}) componentRef?: PerfectScrollbarComponent;
  //@ViewChild(PerfectScrollbarDirective, {static:false}) directiveRef?: PerfectScrollbarDirective;
  // @ViewChild('valsynonym', { static: false }) valsynonym: DxValidationGroupComponent;


  //Field & Tab section on front end property declaration
  docFieldlist: any;
  untabulatedFieldList: any[] = [];
  tabulatedFieldList: any;
  fieldTab: any[] = [];
  tableprevButtonDisable: boolean = false; // this property will disable and enable pre -next button as per data in tabulatedfieldlist
  tablenextButtonDisable: boolean = false;// this property will disable and enable pre -next button as per data in tabulatedfieldlist
  //on load below property are initialize in constructor
  selectedDocumentSubtype: any;
  selectedDocumentCategory: any;
  selectedDocumentType: any;
  selectedDocumentSubtypeValue: any;
  selectedDocumentCategoryValue: any;
  selectedDocumentTypeValue: any;

  // below property are used before using Leadtool using to show documnet
  fileUploaderProfileImage: any;
  fileName: string;
  fileType: string;
  edituploadedfile: string;
  uploadedmsg: string = 'Uploded';
  value: any[] = [];
  imagestring: any;
  // Single field model and Field adding popup property declaration
  fielddatatypelist: any;
  documentfieldmodel: DocumentField;

  // Synonyms tab propety declaration
  fieldsynonymslstmodel: any[];
  synonymmodel: SynonymsDetails;

  fieldvalidationmappinglist: any[] = [];// Field all validation list 
  customvalidationmapping: any;// single custom rule validation model for edit
  customValidationEdits: boolean = false; // flag to show custom validation tab details
  documentSubType: DocumentSubType;
  docfieldValidation: FieldRuleValidation;// valiation tab propety declaration 
  selectedValidations: any[] = [];// valiation tab propety declaration 
  customRuleValidations: any[] = [];// custom tab propety declaration 
  tempcustomRuleValidations: any[] = [];// custom tab propety declaration 
  defaultValidations: any[] = [];// valiation tab propety declaration 
  documentfieldregexlist: any[] = [];// Reg Ex tab propety declaration 
  defaultExpressions: any[] = [];// Reg Ex tab propety declaration 
  selectedExpressions: any[] = [];// Reg Ex tab propety declaration 
  selectedExtractValidations: any[] = [];// Extraction tab propety declaration 
  defaultExtractValidations: any[] = [];// Extraction tab propety declaration 

  expFieldList: any[] = [];// custom tab propety declaration 
  expFunctionList: any[] = [];// custom tab propety declaration 
  expExpressionList: any[] = [];// custom tab propety declaration 
  expressionModel: any;

  editorexpressionvalue: any = ' ';// custom tab propety declaration 
  selectedtype: any;// custom tab propety declaration 
  caretPos = 1;// custom tab propety declaration 

  saveValidationArray: any[] = [];//Unt of  Validatiion , regex,custom extraction data 
  saveRegExArray: any[] = [];

  customValidationTab: any[] = [];// custom tab propety declaration 

  //autocorrect validation reformat
  defaultAutoCorrect: any[];
  selectedAutoCorrect: any[];
  defaultReformat: any[];
  selectedReformat: any[];
  defaultLocate: any[];
  selectedLocate: any[];
  defaultReview: any[];
  selectedReview: any[];
  controlvaluessource: controlvalues[];
  showDragIcons: boolean;

  // Popup Tab error property declaration 
  synonymstaberror: boolean = false;
  customstaberror: boolean = false;
  validationstaberror: boolean = false;
  regularExpressiontaberror: boolean = false;
  extractionSequencetaberror: boolean = false;
  roitaberror: boolean = false;

  docSubTypeModel: DocumentSubType;
  docTypeTable: DocumentTypeTable;
  lstdocTypeTable: any[] = [];
  popuptableTitle: string;
  popupBtnSavetext: string;

  addTablePopupVisible = false;

  //region for Declaring Variable
  // ROI Marking variables
  leadToolsJSLicenseFilePathROI: string = '';
  leadToolsJSLicenseDeveloperKeyROI: string = '';
  leadToolsDocumentServiceHostPathROI: string = '';
  documentImageVirtualRootPathROI: string = '';
  documentPhysicalRootFolderPathROI: string = '';
  documentImageFileNameToBeLoadedROI: string = '';
  // LEADTOOLS document viewer object
  documentViewer;
  documentViewerSubType;
  // Automation control object that works with LEADTOOLS ImageViewer
  automationControl;
  // LEADTOOLS Annotations.Automation.AnnAutomation
  automation;
  // LEADTOOLS automation manager
  manager;
  // Annotations XML string text
  xmlString;
  // Annotations XML file path
  xmlFilePath;
  // Array of annotations container
  containers: lt.Annotations.Engine.AnnContainer[];
  // Array of annotations container - containing the temporary changes made to the container of the current page
  tempContainers: lt.Annotations.Engine.AnnContainer[];
  isAlreadyDrawROIClicked: boolean = false;
  // Model object to bind the ROI marking module parameters => to be set when clicking on the ROI link
  roiParameters: ROIParametersModel;
  // Model Data objects to save the ROI details in database
  rOIXmlModelData: ROIXmlModel = new ROIXmlModel('', '', '', 0, 0);
  rOIDetailModelData: ROIDetailModel = new ROIDetailModel(0, 0, 0, 0, 0, 0, 0, false, false);
  rOIFieldModelData: ROIFieldModel = new ROIFieldModel(0, 0, 0, 0, 0, 0, 0, '');
  rOIViewModelData: ROIViewModel = new ROIViewModel('', '', '', 0, '', 0);
  isROIModified: boolean = false; // added on 08th Feb 2020
  // End of ROI Marking region

  private _operationHandler: lt.Document.Viewer.DocumentViewerOperationEventHandler;
  CurrentPageNumber: any;
  DocumentSubTypeID: any;
  DocumentFieldMappingId: any;
  DocumentFieldId: any;

  operatorSymbol: any[] = [];


  // Constructor call where on the basis of subtypeid get all fields (table fields and not table fields) mapped to subtypeid
  constructor(private service: DataService, private route: ActivatedRoute, private router: Router, private message: MessageService) {
    super('Ontology', 'Creatordashboard', message, service, environment.apiBaseUrl);
    route.params.pipe(map(p => p.id)).subscribe(data => {
      this.GetOperatorSymbols(15);
      this.selectedDocumentSubtype = data;
      this.getdocumentSubTypeList$().subscribe(a => {
        this.docSubTypeModel = a;

        this.selectedDocumentSubtypeValue = a.name;
        this.selectedDocumentTypeValue = a.documentTypeName;
        this.selectedDocumentCategoryValue = a.docCategoryName;

        this.smePopupTitle = 'Industry : ' + a.docCategoryName + ' | Function : ' + a.documentTypeName + ' |  Document : ' + a.name;
        this.getAllTableListwithoutFields(this.selectedDocumentSubtype); // Empty field table list, table created but not have fields
        this.getAllFieldsExpressionEditor(data); // get all fields mapped to the subtype
        this.loadDocumentSubType();//this function load image in viewer 
        this.MasterTableFieldList$();
        this.FieldStrctureList$();
        this.ZoneTypeList$();
        this.FieldLocationList$();
        this.FieldDisplayModeList$();
      });

    });

    this.showDragIcons = true;
    this.onReorder = this.onReorder.bind(this);
    this.fieldsynonymslstmodel = [];

    this.addField(); // init field empty model
    this.fieldDataTypeValue$().subscribe(data => { this.fielddatatypelist = data; });

    //below statements are custom validation set and bind to this component
    this.validateFieldMandatoryFieldValue = this.validateFieldMandatoryFieldValue.bind(this);
    this.validateValidationMandatoryFieldValue = this.validateValidationMandatoryFieldValue.bind(this);
    this.validateextractionMandatoryFieldValue = this.validateextractionMandatoryFieldValue.bind(this);
    this.validateDescriptionCustomRuleEditorPopup = this.validateDescriptionCustomRuleEditorPopup.bind(this);
    this.validateNameCustomRuleEditorPopup = this.validateNameCustomRuleEditorPopup.bind(this);
    this.validateSynonymsValue = this.validateSynonymsValue.bind(this);

    // section for all empty models
    this.synonymmodel = this.initDocumentSynonymsModel();
    this.docfieldValidation = this.initDocumentFieldRuleModel();
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
    this.docTypeTable = this.initDocumentTypeTableModel();
    this.roiParameters = this.initRoiParameterModel();
  }

  // Data Transfer object used to convert search filter model
  formsearchfilterDto() {
    return {
      DocumentCategoryId: this.docSubTypeModel.docCategoryId,
      DocumentTypeId: this.docSubTypeModel.documentTypeId,
      DocumentSubTypeId: this.docSubTypeModel.documentSubTypeId,
      LanguageId: 0,
      FilterbyId: 0,
      Filtervalue: '',
      DocCategoryName: this.docSubTypeModel.docCategoryName,
      DocumentTypeName: this.docSubTypeModel.documentTypeName,
      DocumentSubTypeName: this.docSubTypeModel.name
    };

  }

  uploadProfileImage(e) {
    if (!e.element.textContent.includes('Please select an image or pdf file only')) {
      const file = e.value[0];
      this.fileName = file.name;

      var fileimagethe = this.docSubTypeModel;

      this.edituploadedfile = '';
      this.fileType = file.name.split('.')[1].toString();
      const fr = new FileReader();
      fr.onload = (e) => {
        this.fileUploaderProfileImage = fr.result.toString();

        this.imagestring = fr.result.toString();
        // this.uploadedfilename = file;

        this.saveDocumentsubtypeImage(fr.result, fileimagethe).then(() =>
          this.refreshSMEDetail()
          // this.loadDocumentSubType()
        );

      };
      fr.readAsDataURL(file);
    }
  }

  refreshSMEDetail() {
    // alert('abc');
    var url = '/sme';
    var id = this.selectedDocumentSubtype;
    var myurl = url + '/' + id;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([myurl]);
    });
    // this.router.navigate([url, id]);
  }
  //DTO subtype
  formAddingDto(data: any) {
    return {
      Id: data.documentSubTypeId,
      DocumentTypeId: data.documentTypeId,
      Name: data.name,
      Description: data.description,
      IsStandard: data.isStandard,
      DocFilterField: data.docFilterField,
      DocFilterValue: data.docFilterValue,
      InputSourceID: data.inputSourceID,
      LanguageID: data.languageID,
      ImagePath: data.filePath,
      DocCategoryId: data.docCategoryId,
      IsActive: data.isActive,
      fileUploaderProfileImage: data.fileUploaderProfileImage,
      fileName: data.fileName,
      fileType: data.fileType
    };
  }

  // code for image upload
  saveDocumentsubtypeImage(file, subtype) {

    const promise = new Promise((resolve, reject) => {

      const values = this.formAddingDto(subtype);
      values.fileUploaderProfileImage = file;
      values.fileName = this.fileName;
      values.fileType = this.fileType;
      const put$ = this.service.put('OntologyApi/savesubdoctypeImage', values).subscribe(result => (resolve()));
      // put$.subscribe(data => {
      //  // notify(data['result'].value);
      //   this.uploadedmsg = 'Uploaded';
      //   // this.loadDocumentSubType();
      // }, err => {
      //   this.uploadedmsg = 'Uploaded failed';
      //   notify('Error');
      // }
      // );
    });
    return promise;

  }

  //Add new field and Edit New Field 
  //bind empty field model 
  //bind empty synonyms,validation,regular expression and other 
  addNewField(id) {
    // this.smePopupTitle = "Add Field";
    // this.valOntology.instance.reset();
    // this.valsynonym.instance.reset();
    if (id == 0) {
      this.addField();
    }
    else {
      this.addFieldT();
    }


    // empty models while adding new fields
    this.synonymmodel = this.initDocumentSynonymsModel();
    this.docfieldValidation = this.initDocumentFieldRuleModel();
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);

    // do empty variables while adding new fields 



    this.fieldsynonymslstmodel = [];
    this.selectedValidations = [];
    this.customRuleValidations = [];
    this.defaultValidations = [];
    this.documentfieldregexlist = [];
    this.defaultExpressions = [];
    this.selectedExpressions = [];
    this.selectedExtractValidations = [];
    this.defaultExtractValidations = []
    this.defaultReformat = [];
    this.selectedReformat = [];

    this.formDTOCustomRuleValidation();



    this.getCategory = '';
    this.showFieldContent = '';
    // this.smePopupTitle = '';

    // Get validation list , reg ex list , synonyms list
    // this cover all validation default and selected and all extractvalidation default and selected
    this.getValidationlist(0, this.expFunctionList, this.expExpressionList);
    this.getRegExpressionEdit(0);
    this.getSysnonymslist(0);
    this.getCategory = 'Synonyms';
    this.showFieldContent = 'Synonyms';

    this.popupVisible = true;
    // this.valOntology.instance.reset();


    // set the model parameters to be used for ROI Marking - added on 17th Jan 2020
    this.roiParameters.docTypeFieldMappingID = 0;
    this.roiParameters.fieldName = '';
    this.roiParameters.documentSubTypeID = this.selectedDocumentSubtype;
    this.roiParameters.isAnchor = false;
    this.roiParameters.isTabularField = false;
    this.DocumentSubTypeID = this.selectedDocumentSubtype;
    this.DocumentFieldMappingId = 0;
    this.DocumentFieldId = 0;
    if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
      this.GetPageNumberForfield();
      this.loadDocument();
    }



    if (this.showFieldContent.toLowerCase().indexOf('custom') > -1) {
      if (this.customRuleValidations.length > 0 || this.tempcustomRuleValidations.length > 0) {
        this.customValidationEdits = false;
      }
      else {
        this.customValidationEdits = true;
      }
      this.showTabContentcustom = 'Field';
    }
    // end of region added for ROI marking on 17th Jan 2020
  }

  //base on parameter get field list 
  //tabulated field grouping 
  //bind all respective model data like synonyms and other
  searchdocumenttypefields() {
    const sendPrm = this.formsearchfilterDto();
    this.getdocumentfieldlist$(sendPrm).subscribe(data => {
      this.docFieldlist = data;
      this.untabulatedFieldList =
        data.filter(x => x.isTabularField == false).sort((a, b) => (a.isActive > b.isActive) ? -1 :
          (a.isActive === b.isActive) ? ((a.fieldSequence > b.fieldSequence) ? 1 : -1) : 1);
      // .sort((a, b) => { return a.isActive > b.isActive ? -1 : 1; });



      var groups = data.filter(l => l.isTabularField == true)
        .sort((a, b) => (a.tableSequence > b.tableSequence) ? 1 : -1)
        .reduce(function (obj, item) {
          obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence]
            = obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence] || [];

          obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence].push(
            {
              id: item.id, documentFieldID: item.documentFieldID, documentTypeID: item.documentTypeID, documentSubTypeID: item.documentSubTypeID,
              fieldName: item.fieldName,
              fieldDataTypeID: item.fieldDataTypeID, isMandatory: item.isMandatory, fieldDataType: item.fieldDataType,
              fielddescription: item.fielddescription,
              isTabularField: item.isTabularField, fieldSequence: item.fieldSequence, isAnchor: item.isAnchor,
              documentTypeTableId: item.documentTypeTableId, documentTypeTableName: item.documentTypeTableName
              , documentTypeTableDesc: item.documentTypeTableDesc, isActive: item.isActive, sequence: item.tableSequence,
              confidenceLevel: item.confidenceLevel,
              displayName: item.displayName, fieldStructure: item.fieldStructure, zoneType: item.zoneType, filedLocation: item.filedLocation,
              criticallevel: item.criticallevel, minConfForBlankOut: item.minConfForBlankOut, minConfForColor: item.minConfForColor, editable: item.editable,
              confirmBaseOnConfLevel: item.confirmBaseOnConfLevel, fieldLevelConf: item.fieldLevelConf, charLevelConf: item.charLevelConf,
              fieldDisplayMode: item.fieldDisplayMode, masterTableFieldId: item.masterTableFieldId,
              minLength: item.minLength, maxLength: item.maxLength
            }
          );
          return obj;
        }, {});

      this.tabulatedFieldList = Object.keys(groups).map(function (key) {
        return {
          table: key, fields: groups[key], id: groups[key][0].documentTypeTableId, name: groups[key][0].documentTypeTableId,
          description: groups[key][0].documentTypeTableDesc, documentSubTypeID: groups[key][0].documentSubTypeID,
          sequence: groups[key][0].sequence
        };
      });



      if (this.lstdocTypeTable.length > 0) {
        this.lstdocTypeTable.forEach(e => {
          this.tabulatedFieldList.push(
            {
              table: e.name, fields: [], id: e.id, name: e.name,
              description: e.description, documentSubTypeID: e.documentSubTypeID,
              sequence: e.sequence
            }
          );
        });
      }

      this.tabulatedFieldList = this.tabulatedFieldList.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);



      if (this.docTypeTable.id > 0) {
        var rebindTablefields = this.tabulatedFieldList.filter(m => m.id == this.docTypeTable.id);
        //this.fieldTab = rebindTablefields[0].fields;
        this.fieldTab = rebindTablefields[0].fields.filter(x => x.isTabularField == true).sort((a, b) => (a.isActive > b.isActive) ? -1 :
          (a.isActive === b.isActive) ? ((a.fieldSequence > b.fieldSequence) ? 1 : -1) : 1);;

      }

    });

  }

  getselectedFieldTab(data) {
    if (data != null && data != undefined) {
      return data.length > 0 ? data[0] : '';
    }
    else {
      return null;
    }
  }

  getselectedTableName(data) {
    if (this.docTypeTable.name != null && this.docTypeTable.name != undefined && this.docTypeTable.name != '') {
      if (data === 1) {
        return this.docTypeTable.name;
      }
      else {
        return this.docTypeTable.name.length > 10 ? this.docTypeTable.name.substr(0, 10) + '...' : this.docTypeTable.name;
      }
    }
    else {
      return null;
    }
  }

  // update status of table tab field active status
  statuschangesSingleUnTabulatedFields(status, fielddata) {
    fielddata.isActive = status.value ? false : true;
    const toIndex = this.untabulatedFieldList.indexOf(fielddata);
    this.untabulatedFieldList[toIndex].isActive = fielddata.isActive;
    // fielddata.isActive =e;

    const post$ = this.service.postAll('OntologyApi/changeStatusSingleValidation', fielddata);
    post$.subscribe(data => {
      this.getAllTableListwithoutFields(this.selectedDocumentSubtype);
      // this.addTablePopupVisible = false;
      notify(data['result'].value);
    }, err => {
      notify('Error');
    }
    );
  }


  statuschangesSingleField(status, fielddata) {
    // fieldTab
    // untabulatedFieldList
    fielddata.isActive = status.value ? false : true;
    // fielddata.isActive =e;
    const toIndex = this.fieldTab.indexOf(fielddata);
    this.fieldTab[toIndex].isActive = fielddata.isActive;
    // fielddata.isActive =e;

    const post$ = this.service.postAll('OntologyApi/changeStatusSingleValidation', fielddata);
    post$.subscribe(data => {
      this.getAllTableListwithoutFields(this.selectedDocumentSubtype);

      //this.addTablePopupVisible = false;
      notify(data['result'].value);
    }, err => {
      notify('Error');
    }
    );
  }

  statuschangesAllValidation(type) {
    const post$ = this.service.postAll('OntologyApi/changeStatusAllValidation', type);
    post$.subscribe(data => {
      this.addTablePopupVisible = false;
      notify(data['result'].value);
    }, err => {
      notify('Error');
    }
    );
  }

  // Edit Document field and other model binding 
  editField(data) {

    var thisitem = this;
    this.getCategory = 'Synonyms';
    this.showFieldContent = 'Synonyms';


    this.documentfieldmodel = new DocumentField(data.id, data.documentFieldID, data.documentTypeID, data.documentSubTypeID,
      data.fieldName, data.fielddescription,
      data.fieldDataTypeID, data.isMandatory, data.fieldDataType, data.isTabularField, data.fieldSequence, data.tableSequence,
      data.isAnchor, data.documentValidationList, data.documentSynonoymsList, data.documentRegExList, data.documentTypeTableId,
      data.documentTypeTableName, data.documentTypeTableDesc, data.isActive, data.confidenceLevel == 0 ? 1.00 : data.confidenceLevel,
      data.displayName, data.fieldStructure, data.zoneType, data.filedLocation, data.criticallevel, data.minConfForBlankOut,
      data.minConfForColor, data.editable, data.confirmBaseOnConfLevel, data.fieldLevelConf, data.charLevelConf,
      data.fieldDisplayMode, data.masterTableFieldId, data.minLength, data.maxLength);

    // if table tab click then only doctypetable value initiate hense take ref from doctypetable 
    if (this.docTypeTable.id > 0) {
      this.documentfieldmodel.tableSequence = this.docTypeTable.sequence;
    }

    // this.getAllFieldsExpressionEditor();
    this.getValidationlist(data.id, this.expFunctionList, this.expExpressionList);
    this.getRegExpressionEdit(data.documentFieldID);
    this.getSysnonymslist(data.id);

    this.formDTOCustomRuleValidation();
    this.synonymmodel = this.initDocumentSynonymsModel();
    this.docfieldValidation = this.initDocumentFieldRuleModel();
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);

    this.popupVisible = true;
    // set the model parameters to be used for ROI Marking - added on 04th Jan 2020
    this.roiParameters.docTypeFieldMappingID = data.id;
    this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
    this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
    this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
    this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
    // Check if ROI field selected, then invoke loaddocument() method - 04th Jan 2020
    this.DocumentSubTypeID = this.documentfieldmodel.documentSubTypeID;
    this.DocumentFieldMappingId = data.id;
    this.DocumentFieldId = data.documentFieldID;
    if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
      this.GetPageNumberForfield();
      this.loadDocument();
    }

    this.showTabContentcustom = 'Field';
    this.getIndex(0, null);
    if (this.vwlist != undefined) {
      this.vwlist.instance.resetOption('searchValue');
    }
    if (this.vwlistAuto != undefined) {
      this.vwlistAuto.instance.resetOption('searchValue');
    }
    if (this.vwlistAuto != undefined) {
      this.vwlistAuto.instance.resetOption('searchValue');
    }
    // this.valsynonym.instance.reset();
  }

  editOntologyFiled(name, data) {
    //this.vwlist.instance.option('searchValue', '');
    // this.valOntology.instance.reset();
    //this.valsynonym.instance.reset();


    this.getCategory = name;
    this.showFieldContent = name;
    // this.smePopupTitle = data.fieldName;
    this.documentfieldmodel = new DocumentField(data.id, data.documentFieldID, data.documentTypeID, data.documentSubTypeID,
      data.fieldName, data.fielddescription,
      data.fieldDataTypeID, data.isMandatory, data.fieldDataType, data.isTabularField, data.fieldSequence, data.tableSequence,
      data.isAnchor, data.documentValidationList, data.documentSynonoymsList, data.documentRegExList, data.documentTypeTableId,
      data.documentTypeTableName, data.documentTypeTableDesc, data.isActive, data.confidenceLevel == 0 ? 1.00 : data.confidenceLevel,
      data.displayName, data.fieldStructure, data.zoneType, data.filedLocation, data.criticallevel, data.minConfForBlankOut, data.minConfForColor,
      data.editable, data.confirmBaseOnConfLevel, data.fieldLevelConf, data.charLevelConf, data.fieldDisplayMode, data.masterTableFieldId,
      data.minLength, data.maxLength);

    // if table tab click then only doctypetable value initiate hense take ref from doctypetable 
    if (this.docTypeTable.id > 0) {
      this.documentfieldmodel.tableSequence = this.docTypeTable.sequence;
    }

    // this.getAllFieldsExpressionEditor();
    this.getValidationlist(data.id, this.expFunctionList, this.expExpressionList);
    this.getRegExpressionEdit(data.documentFieldID);
    this.getSysnonymslist(data.id);

    this.formDTOCustomRuleValidation();
    this.synonymmodel = this.initDocumentSynonymsModel();
    this.docfieldValidation = this.initDocumentFieldRuleModel();
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);

    this.popupVisible = true;
    // set the model parameters to be used for ROI Marking - added on 04th Jan 2020
    this.roiParameters.docTypeFieldMappingID = data.id;
    this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
    this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
    this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
    this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
    // Check if ROI field selected, then invoke loaddocument() method - 04th Jan 2020

    //sandeep k
    this.DocumentSubTypeID = this.documentfieldmodel.documentSubTypeID;
    this.DocumentFieldMappingId = data.id;
    this.DocumentFieldId = data.documentFieldID;
    //end sandeep k

    if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
      this.GetPageNumberForfield();
      this.loadDocument();
    }
    this.showTabContentcustom = 'Field';
    this.getIndex(0, null);
    // this.valsynonym.instance.reset();
  }

  initDocumentFieldRuleModel() {
    return new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '', '', '');
  }

  initFieldValidationMapping() {
    return new FieldValidationMapping(0, 0, 0, false, null, '', false, 0, 0, true);
  }

  initDocumentFieldModel() {
    return new DocumentField(0, 0, 0, 0, '', '', null, 1, '', false, 0, 1, 0, null, null, null, 0, '', '', false, 1.00, '', 1, null, 3, 90, 30, 6, true, true, 70, 7, 1, null, 1, 100);
  }

  //#region TrucapSSON

  Field_Structure = []; // [{ 'FieldStructure': 1, 'FieldName': 'Single Word' }, { 'FieldStructure': 2, 'FieldName': 'Multiple Word' }];
  Zone_Type = []; //[{ 'ZoneType': 1, 'Zone_Name': 'OCR' }, { 'ZoneType': 2, 'Zone_Name': 'ICR' }, { 'ZoneType': 3, 'Zone_Name': 'BARCODE' }, { 'ZoneType': 4, 'Zone_Name': 'OMR' }];
  Filed_Location = [];//[{ 'FiledLocation': 1, 'FieldStruName': 'TOP' }, { 'FiledLocation': 2, 'FieldStruName': 'BOTTOM' }, { 'FiledLocation': 3, 'FieldStruName': 'AnyWhere' }];
  Field_DisplayMode = [];// [{ 'FieldDisplayMode': 1, 'FieldDisplay': 'Text' }, { 'FieldDisplayMode': 2, 'FieldDisplay': 'List' }];
  MasterTableFieldList = [];//[{ 'masterTableFieldId': 1, 'masterTableFieldname': 'Country Master' },{ 'masterTableFieldId': 2, 'masterTableFieldname': 'State Master' }];
  FieldlistDropdown: string;
  FieldLevelValidation: boolean;
  ShowConfLevel: string = "NotShow";
  ShowCriticalLevel: string = "NotShow";
  ShowAnchor: string = "NotShow";
  isOpened: boolean = false;


  controlvaluessourceTest: any[] = [{ 'ValueId': 1, 'ValueDisplay': 'Single Word' }, { 'ValueId': 2, 'ValueDisplay': 'Multiple Word' }];
  //controlvaluessourceTest:any[];


  MasterTableFieldList$() {
    this.MasterTableFielddata().subscribe(data => { this.MasterTableFieldList = data });
  }

  MasterTableFielddata() {
    const server$ = this.service.getSingle('OntologyApi/GetMasterTabledetails').
      pipe(map((data: any) => {
        return data
      }));
    return server$;
  }

  FieldStrctureList$() {
    this.FieldStrcturedata().subscribe(data => { this.Field_Structure = data });
  }

  FieldStrcturedata() {
    const server$ = this.service.getSingle('OntologyApi/GetMasterFieldStructuredetails').
      pipe(map((data: any) => {
        return data
      }));
    return server$;
  }

  ZoneTypeList$() {
    this.ZoneTypeData().subscribe(data => { this.Zone_Type = data });
  }

  ZoneTypeData() {
    const server$ = this.service.getSingle('OntologyApi/GetZoneTypes').
      pipe(map((data: any) => {
        return data;
      }));
    return server$;
  }
  FieldLocationList$() {
    this.FieldLocationData().subscribe(data => { this.Filed_Location = data });
  }

  FieldLocationData() {
    const server$ = this.service.getSingle('OntologyApi/GetFieldLocationDetails').
      pipe(map((data: any) => {
        return data;
      }));
    return server$;
  }

  FieldDisplayModeList$() {
    this.FieldDisplayModeData().subscribe(data => { this.Field_DisplayMode = data });
  }

  FieldDisplayModeData() {
    const server$ = this.service.getSingle('OntologyApi/GetFieldDispalyModes').
      pipe(map((data: any) => {
        return data;
      }));
    return server$;
  }

  Field_DisplayModeChanged(data) {
    const result = this.Field_DisplayMode.filter(x => x.fieldDisplayModeId == data.value);
    if (result != null && result != undefined) {
      if (result.length > 0) {
        if (result[0].name == 'List') {
          this.FieldlistDropdown = result[0].name;

        } else {
          this.FieldlistDropdown = 'Text';
        }
      }
    }
  }
  Isactiveorinactive(confirmBaseOnConfLevel) {
    if (confirmBaseOnConfLevel == false) {
      this.documentfieldmodel.fieldLevelConf = null;
      this.documentfieldmodel.charLevelConf = null;
    }
  }

  //#endregion






  // Validation Binding and Editing code 
  addField() {

    this.FieldlistDropdown = '';
    let currentFieldNumber: number = 1;
    if (this.untabulatedFieldList.length > 0) {
      currentFieldNumber = this.untabulatedFieldList.length + 1;
    }
    this.documentfieldmodel = new DocumentField(0, 0, this.selectedDocumentType, this.selectedDocumentSubtype,
      '', '', null, 1, '', false, currentFieldNumber, null, 0, null, null, null, 0, '', '', false, 1.00, '', 1, null, 3, 90, 30, 6, true, true, 70, 7, 1, null, 1, 100);
  }

  addFieldT() {
    let vardoctypetableid = 0;
    let vardoctypetablename = '';
    let vardoctypetabledesc = '';

    let vardoctypetablesequence = 1;
    if (this.docTypeTable.id > 0) {
      vardoctypetableid = this.docTypeTable.id;
      vardoctypetablename = this.docTypeTable.name;
      vardoctypetabledesc = this.docTypeTable.description;
      vardoctypetablesequence = this.docTypeTable.sequence;

    }

    let currentFieldNumber: number = 1;
    if (this.tabulatedFieldList.length > 0) {
      const tablefileds = this.tabulatedFieldList.filter(x => x.id == vardoctypetableid);
      if (tablefileds.length > 0) {
        currentFieldNumber = tablefileds[0].fields.length + 1;
      }
    }

    this.documentfieldmodel = new DocumentField(0, 0, this.selectedDocumentType, this.selectedDocumentSubtype,
      '', '', null, 1, '', true, currentFieldNumber, vardoctypetablesequence
      , 0, null, null, null, vardoctypetableid, vardoctypetablename, vardoctypetabledesc, false, 1.00, '', 1, null, 3, 90, 30, 6, true, true, 70, 7, 1, null, 1, 100);

  }

  // Reg expression List Binding and editing 

  initDocumentRegExpressionModel() {
    return new FieldRegExpressionMapping(0, 0, 0, null, false, false);
  }


  initDocumentSynonymsModel() {
    return new SynonymsDetails(0, 0, '', 0, false);
  }

  initDocumentTypeTableModel() {
    return new DocumentTypeTable(0, '', '', this.selectedDocumentSubtype, 0);
  }

  getAllTableListwithoutFields(id: any) {
    const sendPrm = '?id=' + id;
    this.emptyfieldTablelist$(sendPrm).subscribe(data => {
      this.lstdocTypeTable = data;

      this.searchdocumenttypefields();
    });
  }


  emptyfieldTablelist$(sendPrm) {
    return this.service.getAll('OntologyApi/getEmptyFieldTablelist', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return new DocumentTypeTable(item.id, item.name, item.description, item.documentSubTypeID, item.sequence);
    })));
  }


  openAddTablePopup() {
    this.valCreateTable.instance.reset();
    this.popuptableTitle = "Add table";
    this.popupBtnSavetext = "Create";
    this.addTablePopupVisible = true;
  }

  createaddTable() {
    let result = this.valCreateTable.instance.validate();
    if (result.isValid) {



      if (this.docTypeTable.id == 0) {
        this.docTypeTable.sequence = this.tabulatedFieldList.length + 1;
        const post$ = this.service.postAll('OntologyApi/savedoctypetable', this.docTypeTable);
        post$.subscribe(data => {
          if (data['result'].value != 'Field name already exists') {
            this.tabulatedFieldList.add({
              table: data['table'].name, fields: []
              , id: data['table'].documentTypeTableId, name: data['table'].documentTypeTableId,
              description: data['table'].documentTypeTableDesc, documentSubTypeID: data['table'].documentSubTypeID,
              sequence: data['table'].sequence
            });

            this.addTablePopupVisible = false;
            this.getAllTableListwithoutFields(this.selectedDocumentSubtype);
            this.docTypeTable = this.initDocumentTypeTableModel();
            this.valCreateTable.instance.reset();

          }
          notify(data['result'].value);

        }, err => {
          notify('Error');
        }
        );
      }
      else {
        const put$ = this.service.put('OntologyApi/updatedoctypetable', this.docTypeTable);
        put$.subscribe(data => {
          // this.tabulatedFieldList.add({
          //   table: data['table'].name, fields: []
          //   , id: data['table'].documentTypeTableId, name: data['table'].documentTypeTableId,
          //   description: data['table'].documentTypeTableDesc, documentSubTypeID: data['table'].documentSubTypeID,
          //   sequence : data['table'].sequence
          // });
          if (data['result'].value != 'Field name already exists') {
            this.addTablePopupVisible = false;
            this.getAllTableListwithoutFields(this.selectedDocumentSubtype);

            this.docTypeTable = this.initDocumentTypeTableModel();
            this.valCreateTable.instance.reset();
          }
          notify(data['result'].value);
        }, err => {
          notify('Error');
        }
        );
      }

    }
    else {
      notify("Please enter all mandatory field value");
    }

  }


  cancelCreateTable() {
    this.valCreateTable.instance.reset();
    this.addTablePopupVisible = false;
    this.docTypeTable = this.initDocumentTypeTableModel();
  }
  // region for expression editor

  user = [{
    "role": 'Field',
    "link": './app-field'
  }, {
    "role": 'Tables',
    "link": './app-tables'
  }];

  //used for bind data type like string int decimal etc
  fieldDataTypeValue$() {
    const fieldrules$ = this.service.getAll('OntologyApi/Getfielddatatypes').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        'id': item.id,
        'dataType': item.dataType
      };
    })));
    return fieldrules$;
  }

  // used for data show in grid
  getdocumentfieldlist$(sendPrm) {
    return this.service.postAll('OntologyApi/Getfiltereddocumentfield', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return new DocumentField(item.id, item.documentFieldID, item.documentTypeID, item.documentSubTypeID,
        item.fieldName, item.fieldDescription,
        item.fieldDataTypeID, item.isMandatory, item.fieldDataType,
        item.isTabularField, item.fieldSequence, item.tableSequence, item.isAnchor, item.documentValidationList,
        item.documentSynonoymsList, item.documentRegExList, item.documentTypeTableId, item.documentTypeTableName,
        item.documentTypeTableDesc, item.isActive, item.confidenceLevel, item.displayName, item.fieldStructure,
        item.zoneType, item.filedLocation, item.criticallevel, item.minConfForBlankOut, item.minConfForColor,
        item.editable, item.confirmBaseOnConfLevel, item.fieldLevelConf, item.charLevelConf, item.fieldDisplayMode,
        item.masterTableFieldId, item.minLength, item.maxLength
      );
    })));
  }

  GetOperatorSymbols(sendprm) {

    this.getOperatorSymbols$(sendprm).subscribe(data => {
      this.operatorSymbol = data;
    });
  }

  getOperatorSymbols$(sendprm) {

    const sendPrm = '?masterid=' + sendprm;
    return this.service.getAll('OutputDestinationSettingsApi/GetMasterValue', sendPrm)
      .pipe(map((data: any[]) => data.map((item: any) => {
        return item.value;
        //   {                
        //     'name': item.value,
        // };
      })));
  }

  // operatorSymbol = [
  //  //'AND', 'OR', '=', '==', '<', '<=', '>=', '>>', '|', '(', ')', '[', ']'
  //  '+','-','*','/','%','=','!=','>', '<', '<=', '>=' 
  // ]

  fieldCategorySettings = [
    'Synonyms', 'Validations', 'Custom', 'Regular Expression', 'Extraction Sequence', 'ROI'
  ]

  smeTabs = [
    'Fields', 'Tables'
  ]

  tableTab = [
    { id: 1, text: "Material details", hint: 'Take only the final total and add details', columns: 6 },
    { id: 2, text: "Effort hours", hint: 'Take only the final total and add details', columns: 5 },
    { id: 3, text: "Material details", hint: 'Take only the final total and add details', columns: 2 },
  ];

  popupVisible = false;
  smePopupTitle: string;

  getCategory: string;

  showInfo(data, index) {
    this.popupVisible = true;
    if (index == 0) {
      // this.smePopupTitle = "";
    } else {
      this.getCategory = data.fieldName;
      this.showFieldContent = data.fieldName;
      // Check if ROI field selected, then invoke loaddocument() method - 04th Jan 2020
      if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
        this.GetPageNumberForfield();
        this.loadDocument();
      }
      if (this.showFieldContent.toLowerCase().indexOf('custom') > -1) {
        if (this.customRuleValidations.length > 0 || this.tempcustomRuleValidations.length > 0) {
          this.customValidationEdits = false;
        }
        else {
          this.customValidationEdits = true;
        }
      }
    }
  }


  showTabContent: string = this.smeTabs[0];


  activateTabContent(data) {

    this.showTabContent = data;
    if (data == 'Fields') {
      this.docTypeTable = this.initDocumentTypeTableModel();
      this.isShown = false;
    }
    else if (data == 'Tables') {
      this.showTablesOnly();
      this.docTypeTable = this.initDocumentTypeTableModel();
      this.isShown = false;
    }
  }

  showTablesOnly() {
    // this.isShown = !this.isShown;
    this.docTypeTable = this.initDocumentTypeTableModel();
    this.fieldTab = [];
  }


  // Active Button group
  selectedButton: string = this.operatorSymbol[0];


  activateButton(data) {
    this.selectedButton = data;
    // Invoke the button click event for the marked buttons for ROI

    if (data != undefined && data != null) {
      if (data.btnName == "Mark") {
        this.drawRectangle();
      } else if (data.btnName == "Delete") {
        this.deleteAnnotations();
      } else if (data.btnName == "Zoom In") {
        this.zoomInPage();
      }
      else if (data.btnName == "Zoom Out") {
        this.zoomOutPage();
      }
    }



  }



  onDragStarttabulatedFieldList(e) {
    e.itemData = e.fromData[e.fromIndex];
  }


  onAddtabulatedFieldList(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);

  }

  onRemovetabulatedFieldList(e) {
    e.fromData.splice(e.fromIndex, 1);
  }


  UnMappedValidation(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedValidations.indexOf(data);
    this.selectedValidations.splice(splicndex, 1);
    this.defaultValidations.push(data);
  }
  UnMappedAutoCorrect(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedAutoCorrect.indexOf(data);
    this.selectedAutoCorrect.splice(splicndex, 1);
    this.defaultAutoCorrect.push(data);
  }
  UnMappedReformat(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedReformat.indexOf(data);
    this.selectedReformat.splice(splicndex, 1);
    this.defaultReformat.push(data);
  }
  UnMappedLocate(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedLocate.indexOf(data);
    this.selectedLocate.splice(splicndex, 1);
    this.defaultLocate.push(data);
  }
  UnMappedReview(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedReview.indexOf(data);
    this.selectedReview.splice(splicndex, 1);
    this.defaultReview.push(data);
  }


  UnMappedSelectedRegex(data) {
    data.isDeleted = true;
    data.isMapped = false;
    var splicndex = this.selectedExpressions.indexOf(data);
    this.selectedExpressions.splice(splicndex, 1);
    this.defaultExpressions.push(data);

  }
  UnMappedExtractValidation(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.selectedExtractValidations.indexOf(data);
    this.selectedExtractValidations.splice(splicndex, 1);
    this.defaultExtractValidations.push(data);
  }

  UnMappedCustomValidation(data) {
    data.isDeleted = true;
    data.isMapped = false;
    data.isActive = false;
    var splicndex = this.customRuleValidations.indexOf(data);
    this.customRuleValidations.splice(splicndex, 1);
    this.tempcustomRuleValidations.push(data);
  }


  formDTODocTypeTable(data: any) {
    return {
      id: data.id,
      name: data.table,
      description: data.description,
      documentSubTypeID: data.documentSubTypeID,
      sequence: data.sequence
    };
  }


  updateTableSequence() {
    let doctypetablelist: DocumentTypeTable[] = [];

    this.tabulatedFieldList.forEach(x => {
      let varDoctypetable = this.formDTODocTypeTable(x);
      if (x.id != null) {
        doctypetablelist.push(varDoctypetable);
      }

    });
    if (doctypetablelist.length > 0) {
      this.updatesequenceTabulatedFields(doctypetablelist);
    }
  }


  // update sequence of table 
  updatesequenceTabulatedFields(tablelistdata) {
    const post$ = this.service.put('OntologyApi/savedoctypetablelistsequence', tablelistdata);
    post$.subscribe(data => {
      this.getAllTableListwithoutFields(this.selectedDocumentSubtype);
      notify(data['result'].value);
    }, err => {
      notify('Error');
    }
    );
  }

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
    e.fromData.splice(e.fromIndex, 1);
  }


  selectedRowKeys: any[] = [];
  getSelectedRow(data) {
    this.selectedRowKeys = data.selectedRowKeys;
  }


  showTableDetails(data) {
    this.isShown = !this.isShown;
    // this.title = data.text;
    if (data != undefined && data != null) {
      this.docTypeTable = new DocumentTypeTable(data.id,
        data.table, data.description, data.documentSubTypeID, data.sequence);



      // logic to disable the prev and next button 
      let tbldata = this.tabulatedFieldList.filter(x => x.id == this.docTypeTable.id && x.description == this.docTypeTable.description);
      // .map(item => {
      //   {
      //     if (item.fields.length > 0) {
      //       item.fields.forEach(element => {
      //         element.sequence = data.sequence;
      //       });
      //     }
      //   }
      // });

      var index = this.tabulatedFieldList.indexOf(tbldata[0]);
      this.fieldTab = tbldata[0].fields.filter(x => x.isTabularField == true).sort((a, b) => (a.isActive > b.isActive) ? -1 :
        (a.isActive === b.isActive) ? ((a.fieldSequence > b.fieldSequence) ? 1 : -1) : 1);


      if (index === 0) {
        this.tablenextButtonDisable = false;
        this.tableprevButtonDisable = true;
      }
      else if (index === this.tabulatedFieldList.length - 1) {
        this.tableprevButtonDisable = false;
        this.tablenextButtonDisable = true;
      } else {
        this.tablenextButtonDisable = false;
        this.tableprevButtonDisable = false;
      }

    }
    else {
      this.docTypeTable = this.initDocumentTypeTableModel();
      this.fieldTab = [];
    }
  }


  PrevTableDetails(btnpre) {

    let tbldata = this.tabulatedFieldList.filter(x => x.id == this.docTypeTable.id && x.description == this.docTypeTable.description);
    var index = this.tabulatedFieldList.indexOf(tbldata[0]);
    if (index != 0 && this.tabulatedFieldList.length > 1) {
      this.docTypeTable = new DocumentTypeTable(this.tabulatedFieldList[index - 1].id, this.tabulatedFieldList[index - 1].table,
        this.tabulatedFieldList[index - 1].description, this.tabulatedFieldList[index - 1].documentSubTypeID,
        this.tabulatedFieldList[index - 1].sequence);
      this.fieldTab = this.tabulatedFieldList[index - 1].fields;

      this.tablenextButtonDisable = false;
      if (index - 1 === 0) {
        this.tableprevButtonDisable = true;
      }

    }
  }


  NextTableDetails(btnnext) {
    let tbldata = this.tabulatedFieldList.filter(x => x.id == this.docTypeTable.id && x.description == this.docTypeTable.description);
    var index = this.tabulatedFieldList.indexOf(tbldata[0]);

    if (index != this.tabulatedFieldList.length - 1 && this.tabulatedFieldList.length > 1) {
      this.docTypeTable = new DocumentTypeTable(this.tabulatedFieldList[index + 1].id, this.tabulatedFieldList[index + 1].table,
        this.tabulatedFieldList[index + 1].description, this.tabulatedFieldList[index + 1].documentSubTypeID,
        this.tabulatedFieldList[index + 1].sequence);
      this.fieldTab = this.tabulatedFieldList[index + 1].fields;

      this.tableprevButtonDisable = false;
      if (index + 1 === this.tabulatedFieldList.length - 1) {
        this.tablenextButtonDisable = true;
      }
    }
  }


  documentButtonActions = [
    { 'btnName': 'Mark', 'icon': 'palette' },
    { 'btnName': 'Delete', 'icon': 'trash' }//,
    //{ 'btnName': 'Save', 'icon': 'save' }//,
    //{ 'btnName': 'Cancel', 'icon': 'close' }
  ]

  defaultVisible: string;
  toggleDefault(data) {
    this.defaultVisible = data;
  }

  setIndex: number = 0;
  getIndex(data, customsearch) {
    this.setIndex = data;
    if (customsearch != null) {
      customsearch.text = '';
    }
  }

  @ViewChild('builderField', { static: false }) private input;

  getData(data) {

    this.input.value += data;

  }



  // Method to load the document on page load on page initialization after valid LEADTOOLS license check

  loadDocument() {
    var that = this;
    this.SetRoiEditVirtualpath(this.roiParameters.documentSubTypeID).subscribe((data: any) => {
      if (data != null && data != undefined) {
        that.leadToolsJSLicenseFilePathROI = data.leadToolsJSLicenseFilePathROI;
        that.leadToolsJSLicenseDeveloperKeyROI = data.leadToolsJSLicenseDeveloperKeyROI;
        that.leadToolsDocumentServiceHostPathROI = data.leadToolsDocumentServiceHostPathROI;
        that.documentImageVirtualRootPathROI = data.documentImageVirtualRootPathROI;
        that.documentImageFileNameToBeLoadedROI = data.documentImageFileNameToBeLoadedROI;
        that.documentPhysicalRootFolderPathROI = data.documentPhysicalRootFolderPathROI;
      }
      that.checkLicenseAndLoadDocument();
    });
  }

  SetRoiEditVirtualpath(DocumentSubTypeID) {
    const result$ = this.service.getAll('RoiApi/GetAllRoiEditPathsForDocument?DocumentSubTypeID=' + DocumentSubTypeID).pipe(map((data: any) => { return data }));
    return result$;
  }

  // Method to set the licensing details of LEADTOOLS and check if valid license is present - allow to proceed if valid license available
  checkLicenseAndLoadDocument() {
    // LEADTOOLS license file path and developer key to come from database configurations - Right now hardcoded
    const licenseUrl = this.leadToolsJSLicenseFilePathROI; //'http://localhost:4200/assets/LeadTools/LEADTOOLS.lic.txt';
    const developerKey = this.leadToolsJSLicenseDeveloperKeyROI; //'gUvyoUlnIVgSjjDsyTW9v0QYdZuEmQBXQ4edtkPZUE5wQqno';
    const that = this; // variable to resolve the this-that issue of javascript
    lt.RasterSupport.setLicenseUri(licenseUrl, developerKey, function (setLicenseResult) {
      // Check the status of the license
      if (setLicenseResult.result) {
        setTimeout(() => {
          // Set the path of the LEADTOOLS document service host path - running in background, used by document viewer to load and save document + annotations
          lt.Document.DocumentFactory.serviceHost = that.leadToolsDocumentServiceHostPathROI; //'http://localhost:30000';
          lt.Document.DocumentFactory.servicePath = '';
          lt.Document.DocumentFactory.serviceApiPath = 'api';
          // Once license status is verified and validated, invoke open document method
          that.openDocument();
          that.displayAnchorValue();
        }, 10);
      } else {         
        //notify("LEADTOOLS License is invalid or expired.");
      }
    });
  }

  // Method to open the document in LEADTOOLS document viewer and set up default annotations settings to be used for ROI marking
  openDocument() {
    const createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
    createOptions.viewContainer = document.getElementById('documentDivParent');
    createOptions.thumbnailsContainer = document.getElementById('thumbnailDivParent');
    createOptions.useAnnotations = true;
    this.documentViewer = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);

    // currently hardcoded, will come as a part of parameter from Ontology definition screen
    // var url = "http://localhost:4200/assets/LeadTools/Leadtools.pdf";
    // var url = "http://localhost:4200/assets/LeadTools/DocuViewareFlyer.pdf";
    // var url = "http://localhost:4200/assets/LeadTools/ocr1.tif";
    if (this.roiParameters.documentImageVirtualPath == '') {

      this.roiParameters.documentImageVirtualPath = (this.documentImageVirtualRootPathROI);
    }

    const url = this.roiParameters.documentImageVirtualPath;
    //url = "http://localhost:4200/assets/LeadTools/Invoice_Demo_27Dec19_20191227202554.tif";
    const that = this;
    if (url != '' && url != undefined) {
      lt.Document.DocumentFactory.loadFromUri(url, null)
        .done(function (doc) {
          // Set the document in the viewer
          that.documentViewer.setDocument(doc);
          // Go to page set in the database for the current field to be marked/updated = TODO
          //  if (that.CurrentPageNumber != 0) {
          //    that.documentViewer.gotoPage(that.CurrentPageNumber);
          //  }
          // else {
          that.documentViewer.gotoPage(that.CurrentPageNumber);
          //}

          that.setUpDefaultAnnotations();
          // Load the annotations for the specific loaded document by checking the name of the document
          // Name of document is same as the name of XML Annotation file
          // The root folder of the input document will be searched for the XML file with same name and then the XML file will be loaded
          that.loadAllPageAnnotations(true);

          //sandeep k
          // initialise the document operation events which allows to handle 36 different events
          // reference link:https://www.leadtools.com/help/leadtools/v20/dh/javascript/doxui/documentvieweroperation.html
          that.documentOperationEvent();
          //end sandeep k
        })
        .fail(function () { alert('Error loading Document'); });
    } else {
      notify('Document path is empty.');
    }
  }

  // Method to set up the default parameters for annotations feature to be used to draw rectangle
  setUpDefaultAnnotations() {
    // Create and set up the automation manager using the HTML5 rendering engine
    const renderingEngine = new lt.Annotations.Rendering.AnnHtml5RenderingEngine();
    this.manager = lt.Annotations.Automation.AnnAutomationManager.create(renderingEngine);

    // Added on 09th Oct 2019
    this.manager.createDefaultObjects();

    // var currentObject = <HTMLSelectElement>document.getElementById("currentObject");
    const that = this;
    // When the current object ID changes, we need to update our select
    this.manager.currentObjectIdChanged.add(function (sender, e) {
      // var currentObjectId = that.manager.currentObjectId;
      that.manager.currentObjectId = -1; // sender.currentObjectId;
    });

    // Create an instance of the Automation control object that works with LEADTOOLS ImageViewer
    this.automationControl = new lt.Annotations.JavaScript.ImageViewerAutomationControl(); // new lt.Demos.Annotations.ImageViewerAutomationControl();
    // Attach our image viewer
    this.automationControl.imageViewer = this.documentViewer.view.imageViewer; // imageViewer;
    // Set the image viewer interactive mode
    const automationInteractiveMode = new lt.Annotations.JavaScript.AutomationInteractiveMode(); // new lt.Demos.Annotations.AutomationInteractiveMode();
    automationInteractiveMode.automationControl = this.automationControl;
    this.documentViewer.view.imageViewer.defaultInteractiveMode = automationInteractiveMode;
    // set up the automation (will create the container as well)
    this.automation = new lt.Annotations.Automation.AnnAutomation(this.manager, this.automationControl);
    // Add handler to update the container size when the image size changes
    this.documentViewer.view.imageViewer.itemChanged.add(function (sender, e) {
      // Single page container attachment
      const container = that.automation.container;
      container.size = container.mapper.sizeToContainerCoordinates(that.documentViewer.view.imageViewer.imageSize);
    });

    // set up this automation as the active one
    this.automation.active = true;
  }

  //sandeep k
  // add the document operation handler to handle events from document viewer
  documentOperationEvent() {
    this._operationHandler = this.documentViewer.operation.add((sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => this.documentViewer_Operation(sender, e));
  }

  // method fired when any event is fired from document viewer - handle the page change event to clear the annotation objects
  private documentViewer_Operation(sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
    switch (e.operation) {
      case lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged:
        this.automation.container.children.clear();
        this.documentViewer.text.clearSelection(0);
        const that = this;
        //that.documentViewer.currentPageNumber=2;
        //that.documentViewer.gotoPage(that.documentViewer.currentPageNumber); 
        that.loadAllPageAnnotations(true);
        break;
      default:
        break;
    }
  }
  //end sandeep k

  // Method to load all annotations for the current document invoked when loading document for first time and after saving the current document changes
  loadAllPageAnnotations(isCalledOnLoad: boolean) {
    if (this.xmlString != '' && this.xmlString != undefined && this.xmlString != null) {
      if (this.xmlString != null && this.xmlString !== undefined) {
        this.isAlreadyDrawROIClicked = false;
        const annCodecs = new lt.Annotations.Engine.AnnCodecs();
        this.containers = annCodecs.loadAll(this.xmlString);

        if (this.containers !== undefined && this.containers != null && this.containers.length > 0) {
          // loop through the containers and find the container for the current page number
          let container = null;
          // Commented and modified the code to display the single container data for now, will have to pick up the page number from DB and then find out exact field details
          for (let index = 0; index < this.containers.length; index++) {
            container = this.containers[index];
            if (container.pageNumber === this.documentViewer.currentPageNumber) { //that.documentViewer.currentPageNumber
              break;
            }
            container = null;
          }

          // container = that.containers[0];
          //that.documentViewer.gotoPage(that.CurrentPageNumber);
          if (container !== undefined && container != null) {
            const srcChildren = container.children;
            if (srcChildren.count > 0) {
              const destChildren = this.automation.container.children;
              destChildren.clear();
              const selectionObject = this.automation.container.selectionObject;
              if (selectionObject != null && selectionObject.selectedObjects.count > 0) {
                selectionObject.selectedObjects.clear();
                selectionObject.isSelected = false;
              }
              for (let i = 0; i < srcChildren.count; i++) {
                // Add the condition to display the annotation object only for the current field for which ROI is to be marked/updated
                if (srcChildren.item(i).userId === this.roiParameters.docTypeFieldMappingID.toString()) {
                  srcChildren.item(i).isVisible = true;
                  this.isAlreadyDrawROIClicked = true;
                } else {
                  srcChildren.item(i).isVisible = false;
                }
                const child = srcChildren.item(i);
                // Comment out this code if you need to scale the objects after loading.
                destChildren.add(child);
              }
            }
            for (let i = 0; i < container.layers.count; i++) {
              this.automation.container.layers.add(container.layers.item(i));
            }
            this.automation.automationControl.automationInvalidate(lt.LeadRectD.empty);
          }
        }
      }
      else {
        this.isAlreadyDrawROIClicked = false;
      }
    }
    else {
      let fileName = '';
      let folderPath = '';
      if (isCalledOnLoad) {
        // get the file name without extension and pass to load the respective saved annotations file
        // currently hardcoded, will come as a part of parameter from Ontology definition screen
        if (this.roiParameters.documentImageFilePath == '') {
          this.roiParameters.documentImageFilePath = (this.documentPhysicalRootFolderPathROI);
        }

        folderPath = this.roiParameters.documentImageFilePath;
        // this.roiParameters.documentImageFilePath;
        const splittedArray = folderPath.split('\\');
        fileName = splittedArray[splittedArray.length - 1]; // Take the last section of the folder path to find the file name
      } else {
        folderPath = this.xmlFilePath;
        const splittedArray = folderPath.split('\\');
        fileName = splittedArray[splittedArray.length - 1]; // Take the last section of the folder path to find the file name
      }
      const that = this;

      this.loadXml(fileName, folderPath, this.roiParameters.docTypeFieldMappingID, this.roiParameters.isTabularField).subscribe(data => {
        // if return data is not null and not undefined

        if (data != null && data !== undefined) {
          this.isAlreadyDrawROIClicked = false;
          const annCodecs = new lt.Annotations.Engine.AnnCodecs();
          that.xmlString = data.toString(); // added the returned xml data to variable
          that.containers = annCodecs.loadAll(data.toString());

          if (that.containers !== undefined && that.containers != null && that.containers.length > 0) {
            // loop through the containers and find the container for the current page number
            let container = null;
            // Commented and modified the code to display the single container data for now, will have to pick up the page number from DB and then find out exact field details
            for (let index = 0; index < that.containers.length; index++) {
              container = that.containers[index];
              if (container.pageNumber === that.documentViewer.currentPageNumber) { //that.documentViewer.currentPageNumber
                break;
              }
              container = null;
            }

            // container = that.containers[0];
            //that.documentViewer.gotoPage(that.CurrentPageNumber);
            if (container !== undefined && container != null) {
              const srcChildren = container.children;
              if (srcChildren.count > 0) {
                const destChildren = that.automation.container.children;
                destChildren.clear();
                const selectionObject = that.automation.container.selectionObject;
                if (selectionObject != null && selectionObject.selectedObjects.count > 0) {
                  selectionObject.selectedObjects.clear();
                  selectionObject.isSelected = false;
                }
                for (let i = 0; i < srcChildren.count; i++) {
                  // Add the condition to display the annotation object only for the current field for which ROI is to be marked/updated
                  if (srcChildren.item(i).userId === this.roiParameters.docTypeFieldMappingID.toString()) {
                    srcChildren.item(i).isVisible = true;
                    this.isAlreadyDrawROIClicked = true;
                  } else {
                    srcChildren.item(i).isVisible = false;
                  }
                  const child = srcChildren.item(i);
                  // Comment out this code if you need to scale the objects after loading.
                  destChildren.add(child);
                }
              }
              for (let i = 0; i < container.layers.count; i++) {
                that.automation.container.layers.add(container.layers.item(i));
              }
              that.automation.automationControl.automationInvalidate(lt.LeadRectD.empty);
            }
          }
        }
        else {
          this.isAlreadyDrawROIClicked = false;
        }
      });
    }
  }
  // Method to Load the Annotations file for the specific input document
  // fileName => Input document name without extension
  // folderPath => Entire file folder path of the input document
  private loadXml(fileName: string, folderPath: string, docTypeFieldMappingID: number, isTabularField: Boolean) {

    let xmlData;
    // var params = '?XMLFilePath=' + xmlFilePath;
    const modelData = new ROIXmlModel('', fileName, folderPath, docTypeFieldMappingID, isTabularField);
    const result$ = this.service.postAll('RoiApi/LoadXml', modelData)
      .pipe(map(x => xmlData = x));
    return result$;
  }

  // Method to invoke the get anchor value and bind to model attribute
  displayAnchorValue() {
    this.fetchAnchorValue(this.roiParameters.docTypeFieldMappingID).subscribe(data => {
      this.roiParameters.anchorValue = data.result.value;
    });

  }

  // Method to give the getall call to fetch anchor value for the selected field 
  fetchAnchorValue(sendPrm) {
    const server$ = this.service.getSingle('RoiApi/GetAnchorValueForField?DocumentTypeFieldMappingId=' + sendPrm).
      pipe(map((data: any) => { return data }));
    return server$;
  }

  // Method to instantiate the ROI parameter model object to initial values
  initRoiParameterModel() {
    return new ROIParametersModel(0, 0, false, '', '', '', 0, '');
  }

  // Method to assign the annotation object as rectangle for drawing rectangle
  drawRectangle() {
    // -3 is the object id of rectangle annotation
    // added a check for allowing user to mark only single ROI for the simple header field and allow multiple ROI markings for IsTabularField
    // if already one ROI has been marked for the field, notify the user 
    // if need to change ROI, select and delete exitsing ROI
    // removed table field condition - 23-Jan-2020 => added again on 08th Feb 2020 as it was missed out in check-in multiple times
    // if (this.roiParameters.isTabularField != undefined && this.roiParameters.isTabularField == false && this.isAlreadyDrawROIClicked == true) {
    if (this.isAlreadyDrawROIClicked == true) {
      notify('Only single ROI is allowed for the field. Please delete existing ROI and mark new one.');
    }
    else {
      this.isAlreadyDrawROIClicked = true;
      this.manager.currentObjectId = -3;
      this.isROIModified = true; // added on 08th Feb 2020
    }
  }

  // Delete the selected objects from the current page
  deleteAnnotations() {
    // Make the automation to select the children objects on the current page
    // this.automation.selectObjects(this.automation.container.children);

    // Get the selected objects from the current page
    // var selectedObjects = this.automation.container.selectionObject.selectedObjects;
    // selectedObjects.count;

    // Delete the current selected objects from the current page
    this.automation.deleteSelectedObjects();
    this.isAlreadyDrawROIClicked = false;
    const codecs = new lt.Annotations.Engine.AnnCodecs();
    this.xmlString = codecs.save(this.automation.container, lt.Annotations.Engine.AnnFormat.annotations, this.xmlString, this.documentViewer.currentPageNumber);
    this.isROIModified = true; // added on 08th Feb 2020
  }

  // Method to save the annotation objects -rectangle(s) drawn on the document in variable string
  // TODO -> need to convert the LeadTools coordinates into actual image co-ordinates -> will be done in backend C#
  saveRectangle() {
    try {
      // Step 1 : Save current page annotations
      const codecs = new lt.Annotations.Engine.AnnCodecs();
      this.xmlString = codecs.save(this.automation.container, lt.Annotations.Engine.AnnFormat.annotations, this.xmlString, this.documentViewer.currentPageNumber);

      this.automation.invalidate(lt.LeadRectD.empty);
      this.documentViewer.view.imageViewer.invalidate(lt.LeadRectD.empty);
      this.automation.container.children.clear();

      // get the file name without extension and pass to save annotations file
      if (this.roiParameters.documentImageFilePath == '') {
        this.roiParameters.documentImageFilePath = (this.documentPhysicalRootFolderPathROI);
      }
      const folderPath: string = this.roiParameters.documentImageFilePath; // this.roiParameters.documentImageFilePath; // received from Ontology definition screen
      let fileName = '';
      const splittedArray = folderPath.split('\\');
      fileName = splittedArray[splittedArray.length - 1]; // Take the last section of the folder path to find the file name

      const that = this;
      // Pass the updated XMLString annotation data for save as XML file along with input file name and the file folder path
      this.saveXml(this.xmlString, fileName, folderPath, this.roiParameters.docTypeFieldMappingID, this.roiParameters.isTabularField).subscribe(data => {
        // set the current saved XML file path
        that.xmlFilePath = data.toString();
        // clear the annotations XML stored string text
        that.xmlString = null;
        // clear the annotation containers
        that.containers = null;
        that.tempContainers = null;
        // Load the XML file data into global array list of containers - commented as we will invoke save roi details from front end and close the screen
        // this.loadAllPageAnnotations(false);
        that.saveROIDetails();
      });
      this.automation.container.children.clear();
    }
    catch {

    }
  }

  // Method to post the XML annotations data to API to save in XML File
  // xml => Annotations XML data in string format
  // fileName => Input document name
  // Folder path to save is currently hardcoded to the Clientapp/src/app/assets/LeadTools folder, need to change => TODO
  private saveXml(xml: string, fileName: string, folderPath: string, docTypeFieldMappingID: number, isTabularField: Boolean) {

    let xmlPath;
    const modelData = new ROIXmlModel(xml, fileName, folderPath, docTypeFieldMappingID, isTabularField);
    const result$ = this.service.postAll('RoiApi/SaveXml', modelData
    ).pipe(map(x => xmlPath = x));
    return result$;
  }

  // Main method to invoke the save template method
  saveROIDetails() {

    // create the data to be posted to save template method
    // Set the template detail table data
    this.rOIDetailModelData.documentSubTypeID = this.roiParameters.documentSubTypeID;

    // Set template field table data - Field data will be captured at back end using XML file
    // We will send the XML path to backend to parse and fetch the field data, co-ordinates
    this.rOIFieldModelData.docTypeFieldMappingID = this.roiParameters.docTypeFieldMappingID;
    this.rOIFieldModelData.anchorValue = this.roiParameters.anchorValue;

    // Set the XML file data
    this.rOIXmlModelData.xmlData = this.xmlFilePath;
    this.rOIXmlModelData.docTypeFieldMappingID = this.roiParameters.docTypeFieldMappingID;

    this.rOIViewModelData.docTypeFieldMappingID = this.roiParameters.docTypeFieldMappingID;
    this.rOIViewModelData.rOIDetail = this.rOIDetailModelData;
    this.rOIViewModelData.rOIXml = this.rOIXmlModelData;
    this.rOIViewModelData.rOIField = this.rOIFieldModelData;
    this.rOIViewModelData.isTabularField = this.roiParameters.isTabularField;

    this.saveTemplatePostMethod().subscribe((data: any) => {
      // if (data != undefined && data != '') {
      //   notify(data);
      // }
      // commented the "ROI notification message on 08th Feb 2020 as separate notification is not required
      // if (this.isROIModified == true) { // added if check on 08th Feb 2020
      //   notify("ROI details saved successfully.");
      // }
      // added to clear the parameter values before closing the screen
      this.clearAllDataOnScreenBeforeClose();
    });
  }

  //  document type grid binding
  getdocumentSubTypeList$() {
    const sendPrm = '?id=' + this.selectedDocumentSubtype;
    return this.service.getSingle('OntologyApi/GetSubTypeDocumentBySubtype', sendPrm)
      .pipe(map((data: any) => {
        return new DocumentSubType(data.id, data.documentTypeId, data.name, data.description, data.isStandard,
          data.documentType.name,
          data.docFilterField, data.docFilterValue, data.inputSourceID, data.languageID, data.fileUploaderProfileImage
          , '', '', data.imagePath, data.docCategoryName, data.documentType.documentCatID, data.isActive);
      }));

  }

  // Save template method to invoke the post method for saving template details in database
  saveTemplatePostMethod() {

    let xmlPath;
    const convertedROIFieldModelToData: ROIFieldModel = this.convertROIFieldModelToData(this.rOIViewModelData.rOIField);
    const convertedROIDetailModelToData: ROIDetailModel = this.convertROIDetailModelToData(this.rOIViewModelData.rOIDetail);
    // var convertedROIImageModelToData: ROIImageModel = this.convertROIImageModelToData(this.rOIViewModelData.rOIImage);
    const convertedROIXmlModelToData: ROIXmlModel = this.convertROIXmlModelToData(this.rOIViewModelData.rOIXml);
    if (this.roiParameters.documentImageFilePath == '') {
      this.roiParameters.documentImageFilePath = (this.documentPhysicalRootFolderPathROI + this.documentImageFileNameToBeLoadedROI);
    }
    const data = {
      'ROIField': convertedROIFieldModelToData, 'ROIDetail': convertedROIDetailModelToData,
      'ROIXml': convertedROIXmlModelToData, 'DocTypeFieldMappingID': this.rOIViewModelData.docTypeFieldMappingID, 'DocumentImageFilePath': this.roiParameters.documentImageFilePath,
      'isTabularField': this.roiParameters.isTabularField
    }; // working fine for 5 parameters in model
    const result$ = this.service.postAll('RoiApi/SaveRoiDetails', data).pipe(map(x => xmlPath = x));

    return result$;
  }

  // Method that converts the input TemplateMainModel data into JSON format
  convertROIFieldModelToData(data: ROIFieldModel) {
    return {
      'rOIFieldID': 0,
      'rOIID': 0,
      'docTypeFieldMappingID': data.docTypeFieldMappingID,
      'topX': 0,
      'topY': 0,
      'bottomX': 0,
      'bottomY': 0,
      'anchorValue': data.anchorValue
    };
  }
  // Method that converts the input TemplateDetailModel data into JSON format
  convertROIDetailModelToData(data: ROIDetailModel) {
    return {
      'rOIID': 0,
      'documentSubTypeID': data.documentSubTypeID,
      // 'rOIImageID': data.rOIImageID,
      'pageTopX': 0,
      'pageTopY': 0,
      'pageBottomX': 0,
      'pageBottomY': 0,
      'pageNo': 0,
      'isDefault': true,
      'isActive': true

    };
  }

  // Method that converts the input Savetemplate data into JSON format
  convertROIXmlModelToData(data: ROIXmlModel) {
    return {
      'xmlData': data.xmlData,
      'inputFileName': '',
      'folderPath': '',
      'docTypeFieldMappingID': data.docTypeFieldMappingID,
      'isTabularField': data.isTabularField
    };
  }

  // clear all global variables before closing the screen
  clearAllDataOnScreenBeforeClose() {
    if (this.documentViewer != null) {
      this.documentViewer.thumbnails.dispose();
    }
    if (this.automationControl != null) {
      this.automationControl.imageViewer.dispose();
    }
    this.documentViewer = null;
    this.automationControl = null;
    this.automation = null;
    this.manager = null;
    this.xmlString = '';
    this.xmlFilePath = '';
    this.containers = [];
    this.tempContainers = [];
    this.rOIXmlModelData = new ROIXmlModel('', '', '', 0, 0);
    this.rOIDetailModelData = new ROIDetailModel(0, 0, 0, 0, 0, 0, 0, false, false);
    this.rOIFieldModelData = new ROIFieldModel(0, 0, 0, 0, 0, 0, 0, '');
    this.rOIViewModelData = new ROIViewModel('', '', '', 0, '', 0);
    // this.roiParameters.docTypeFieldMappingID = 0; // id contains the DocTypeFieldMappingID value to be used to identify the field in use
    this.roiParameters.fieldName = '';
    this.roiParameters.isTabularField = false;
    this.roiParameters.isAnchor = false;
    // this.roiParameters.documentSubTypeID = 0;
    this.roiParameters.anchorValue = '';
    this.roiParameters.documentImageFilePath = '';
    this.roiParameters.documentImageVirtualPath = '';
    this.isAlreadyDrawROIClicked = false;
    this.leadToolsJSLicenseFilePathROI = '';
    this.leadToolsJSLicenseDeveloperKeyROI = '';
    this.leadToolsDocumentServiceHostPathROI = '';
    this.documentImageVirtualRootPathROI = '';
    this.documentPhysicalRootFolderPathROI = '';
    this.documentImageFileNameToBeLoadedROI = '';
    this.isROIModified = false; // added on 08th Feb 2020
  }

  //sandeep K
  GetPageNumberForfield() {
    this.GetPageNoForDocumentField().subscribe(data => {
      if (data != null && data.pageNo > 0) {
        this.CurrentPageNumber = data.pageNo;
      }
      else {
        this.CurrentPageNumber = 1;
        //notify("Page number is not available.");
      }
    });
  }

  GetPageNoForDocumentField() {
    const server$ = this.service.getSingle('RoiApi/GetPageNoForDocumentField?DocumentSubTypeID=' + this.DocumentSubTypeID + '&DocumentFieldMappingId=' + this.DocumentFieldMappingId +
      '&DocumentFieldId=' + this.DocumentFieldId).
      pipe(map((data: any) => { return data }));
    return server$;
  }
  //end sandeep k  
  // end of region -- ROI Marking

  popupHiding(e) {
    this.clearAllObjectMode();
    this.getAllTableListwithoutFields(this.selectedDocumentSubtype);

  }

  // Section - to load the document on main SME page viewer section

  loadDocumentSubType() {
    var that = this;
    if (this.selectedDocumentSubtype > 0) {
      this.SetRoiEditVirtualpath(this.selectedDocumentSubtype).subscribe((data: any) => {
        if (data != null && data != undefined) {
          that.leadToolsJSLicenseFilePathROI = data.leadToolsJSLicenseFilePathROI;
          that.leadToolsJSLicenseDeveloperKeyROI = data.leadToolsJSLicenseDeveloperKeyROI;
          that.leadToolsDocumentServiceHostPathROI = data.leadToolsDocumentServiceHostPathROI;
          that.documentImageVirtualRootPathROI = data.documentImageVirtualRootPathROI;
          that.documentImageFileNameToBeLoadedROI = data.documentImageFileNameToBeLoadedROI;
          that.documentPhysicalRootFolderPathROI = data.documentPhysicalRootFolderPathROI;
        }
        that.checkLicenseAndLoadDocumentSubType();
      });
    }
  }
  // Method to set the licensing details of LEADTOOLS and check if valid license is present - allow to proceed if valid license available
  checkLicenseAndLoadDocumentSubType() {
    // LEADTOOLS license file path and developer key to come from database configurations - Right now hardcoded
    const licenseUrl = this.leadToolsJSLicenseFilePathROI; //'http://localhost:4200/assets/LeadTools/LEADTOOLS.lic.txt';
    const developerKey = this.leadToolsJSLicenseDeveloperKeyROI; //'gUvyoUlnIVgSjjDsyTW9v0QYdZuEmQBXQ4edtkPZUE5wQqno';
    const that = this; // variable to resolve the this-that issue of javascript
    lt.RasterSupport.setLicenseUri(licenseUrl, developerKey, function (setLicenseResult) {
      // Check the status of the license
      if (setLicenseResult.result) {
        setTimeout(() => {
          // Set the path of the LEADTOOLS document service host path - running in background, used by document viewer to load and save document + annotations
          lt.Document.DocumentFactory.serviceHost = that.leadToolsDocumentServiceHostPathROI; //'http://localhost:30000';
          lt.Document.DocumentFactory.servicePath = '';
          lt.Document.DocumentFactory.serviceApiPath = 'api';
          // Once license status is verified and validated, invoke open document method
          that.openDocumentSubType();
        }, 10);
      } else {
        // False
       // notify("LEADTOOLS License is invalid or expired.");
      }
    });
  }

  // Method to open the document in LEADTOOLS document viewer and set up default annotations settings to be used for ROI marking
  openDocumentSubType() {
    const createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
    createOptions.viewContainer = document.getElementById('documentDivParentSubtype');
    createOptions.thumbnailsContainer = document.getElementById('thumbnailDivParentSubtype');
    createOptions.useAnnotations = true;
    this.documentViewerSubType = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);

    // currently hardcoded, will come as a part of parameter from Ontology definition screen
    // var url = "http://localhost:4200/assets/LeadTools/Leadtools.pdf";
    // var url = "http://localhost:4200/assets/LeadTools/DocuViewareFlyer.pdf";
    // var url = "http://localhost:4200/assets/LeadTools/ocr1.tif";

    const url = this.documentImageVirtualRootPathROI;
    //url = "http://localhost:4200/assets/LeadTools/Invoice_Demo_27Dec19_20191227202554.tif";
    const that = this;
    if (url == null || url === undefined || url == '') {
      notify("Document not available to load.")
    }
    else {
      lt.Document.DocumentFactory.loadFromUri(url, null)
        .done(function (doc) {
          that.documentViewerSubType.setDocument(doc);
          that.documentViewerSubType.gotoPage(that.CurrentPageNumber);
        })
        .fail(function () { alert('Document does not exist on the path. Please verify the document path.'); });
    }
  }





  documentButtonActionsSubtype = [
    { 'btnName': 'Zoom In', 'icon': 'icon-zoom-in' },
    { 'btnName': 'Zoom Out', 'icon': 'icon-zoom-out' },
  ];


  // Method to Zoom In Page by 1.5 factor
  zoomInPage() {
    this.documentViewerSubType.view.imageViewer.zoom(lt.Controls.ControlSizeMode.none,
      this.documentViewerSubType.view.imageViewer.scaleFactor * 1.5, this.documentViewerSubType.view.imageViewer.defaultZoomOrigin);
  }

  // Method to Zoom Out Page by 0.5 factor
  zoomOutPage() {
    this.documentViewerSubType.view.imageViewer.zoom(lt.Controls.ControlSizeMode.none,
      this.documentViewerSubType.view.imageViewer.scaleFactor * 0.5, this.documentViewerSubType.view.imageViewer.defaultZoomOrigin);
  }


  editTable(data) {
    this.docTypeTable = new DocumentTypeTable(data.id, data.table, data.description, data.documentSubTypeID, data.sequence);
    this.popuptableTitle = "Edit table";
    this.popupBtnSavetext = "Update";
    this.addTablePopupVisible = true;
  }



  // ************************************************** Region SME POP Up SME**********************************************//

  // Table list hide and show
  isShown: boolean = false; // hidden by default
  title: string;
  showTabContentcustom: string = this.customValidationTab[0];
  showFieldContent: string = this.fieldCategorySettings[0];
  getSynonymsArray: any[] = [];
  tabPanelHeader = [{ "ID": 1, "tabName": "Field" }, { "ID": 2, "tabName": "Functions" }, { "ID": 3, "tabName": "Expressions" }];
  deleteSynonyms(totaldata, data, index) {

    if (data.id > 0) {

      this.fieldsynonymslstmodel.push(data);
      this.fieldsynonymslstmodel.find(fieldid => fieldid.id == data.id).isDeleted = true;
      var deleteindex1 = this.getSynonymsArray.indexOf(data);
      this.getSynonymsArray.splice(deleteindex1, 1);

    } else {
      var deleteindex = this.getSynonymsArray.indexOf(data);
      this.getSynonymsArray.splice(deleteindex, 1);
    }

    this.getSynonymsArray.forEach(e => {
      var synindex = this.getSynonymsArray.indexOf(e);
      e.priority = synindex + 1;
    });

    let duplicatesynonyms = [...new Set(this.getSynonymsArray.map((item: any) => item.synonym))];
    if (duplicatesynonyms.length == 0) {
      this.synonymstaberror = false;
    }

  }


  // Clear all running objects from save list
  clearAllObjectMode() {
    // this.vwlist.instance.option('searchValue', '');
    //  this.valsynonym.instance.reset();

    //this.valOntology.instance.reset();


    this.selectedValidations = [];
    this.customRuleValidations = [];
    this.defaultValidations = [];
    this.documentfieldregexlist = [];
    this.defaultExpressions = [];
    this.selectedExpressions = [];
    this.fieldsynonymslstmodel = [];
    this.selectedExtractValidations = [];
    this.defaultExtractValidations = [];
    this.tempcustomRuleValidations = [];
    this.defaultAutoCorrect = [];
    this.selectedAutoCorrect = [];
    this.selectedLocate = [];
    this.defaultLocate = [];
    this.defaultReview = [];
    this.selectedReview = [];
    this.defaultReformat = [];
    this.selectedReformat = [];



    this.synonymstaberror = false;
    this.customstaberror = false;
    this.validationstaberror = false;
    this.regularExpressiontaberror = false;
    this.extractionSequencetaberror = false;
    this.roitaberror = false;


    // Empty model initialization after clear objects
    this.documentfieldmodel = this.initDocumentFieldModel();
    this.synonymmodel = this.initDocumentSynonymsModel();
    this.docfieldValidation = this.initDocumentFieldRuleModel();
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);

    this.showTabContentcustom = 'Field';
    this.getIndex(0, null);
    this.customValidationEdits = false;

    if (this.showTabContent != 'Tables' && this.isShown != true) {
      this.isShown = false;
      this.activateTabContent('Fields');
    }
    else if (this.showTabContent != 'Tables' && this.isShown == true) {
      this.isShown = false;
      this.activateTabContent('Fields');
    }
    else {
      this.showTabContent = 'Tables';
      this.isShown = false;
      this.showTableDetails(this.docTypeTable);
    }

    this.popupVisible = false;
    this.valOntology.instance.reset();
    if (this.vwlist != undefined) {
      this.vwlist.instance.resetOption('searchValue');
    }
    this.isOpened = false;
  }

  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }
  onAddSynonymsArray(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemoveSynonymsArray(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onAdddefaultExpressions(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultExpressions(e) {
    // let name = e.itemElement.children[0].children[0].innerHTML;
    let name = e.itemElement.children[0].children[0].children[0].innerHTML;
    let data = e.fromData.filter(x => x.fieldRegularExpression.name === name.toString().trim());
    // let data = e.fromData.filter(x => x.fieldRegularExpression.name === name);
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;

    e.fromData.splice(fromindex, 1);
    this.selectedExpressions = e.toData;
    this.defaultExpressions = e.fromData;
  }


  onAddselectedExpressions(e) {
    // let name = e.itemData.fieldRegularExpression.name;
    let name = e.itemElement.children[0].children[0].children[0].innerHTML;
    let data = e.fromData.filter(x => x.fieldRegularExpression.name == name.toString().trim());
    e.toData.splice(e.toIndex, 0, data[0]);
  }


  onRemoveselectedExpressions(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedExpressions = e.fromData;
    this.defaultExpressions = e.toData;
  }



  onAddselectedValidations(e) {
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }


  onRemoveselectedValidations(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedValidations = e.fromData;
    this.defaultValidations = e.toData;
  }

  onAdddefaultValidations(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultValidations(e) {

    this.defaultValidations = [];
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    //e.itemElement.children[0].children[2].innerHTML == name
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    this.selectedValidations = e.toData;
    this.defaultValidations = e.fromData;
  }
  //#region AutoCorrect
  onAddselectedAutoCorrect(e) {

    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }
  onRemoveselectedAutoCorrect(e) {

    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedAutoCorrect = e.fromData;
    this.defaultAutoCorrect = e.toData;
  }
  onAdddefaultAutoCorrect(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultAutoCorrect(e) {
    this.defaultAutoCorrect = [];
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    //e.itemElement.children[0].children[2].innerHTML == name
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    this.selectedAutoCorrect = e.toData;
    this.defaultAutoCorrect = e.fromData;
  }
  //#endregion

  //#region reformat

  onAddselectedReformat(e) {
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }
  onRemoveselectedReformat(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedReformat = e.fromData;
    this.defaultReformat = e.toData;
  }
  onAdddefaultReformat(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultReformat(e) {
    this.defaultReformat = [];
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    //e.itemElement.children[0].children[2].innerHTML == name
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    this.selectedReformat = e.toData;
    this.defaultReformat = e.fromData;
  }
  //#endregion

  //#region Locate
  onAddselectedLocate(e) {
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }
  onRemoveselectedLocate(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedLocate = e.fromData;
    this.defaultLocate = e.toData;
  }
  onAdddefaultLocate(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultLocate(e) {
    this.defaultLocate = [];
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    //e.itemElement.children[0].children[2].innerHTML == name
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    this.selectedLocate = e.toData;
    this.defaultLocate = e.fromData;
  }
  //#endregion

  //#region Review
  onAddselectedReview(e) {
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }
  onRemoveselectedReview(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedReview = e.fromData;
    this.defaultReview = e.toData;
  }
  onAdddefaultReview(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultReview(e) {
    this.defaultReview = [];
    let name = e.itemElement.children[0].children[1].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    //e.itemElement.children[0].children[2].innerHTML == name
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    this.selectedReview = e.toData;
    this.defaultReview = e.fromData;
  }
  //#endregion

  activateContent(data) {


    this.showFieldContent = data;
    this.getCategory = '';
    // Check if ROI field selected, then invoke loaddocument() method - 04th Jan 2020

    if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {

      this.GetPageNumberForfield();
      this.loadDocument();
    }
    if (this.showFieldContent.toLowerCase().indexOf('custom') > -1) {
      if (this.customRuleValidations.length > 0 || this.tempcustomRuleValidations.length > 0) {
        this.customValidationEdits = false;

      }
      else {
        this.customValidationEdits = true;

      }
      this.showTabContentcustom = 'Field';
    }
  }



  // Validation Binding and Editing code
  getValidationlist(id: any, functionlist, expressionlist) {
    
    const sendPrm = '?id=' + id;// here id is field - subtype mapping id DocTypeFieldMappingID // pls change 51 to id
    var thisitem = this;
    this.fieldvalidationlist$(sendPrm, id).subscribe(data => {
      this.fieldvalidationmappinglist = data;

      this.selectedValidations
        = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
          && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F7');

      this.selectedValidations = this.selectedValidations.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      });

      this.selectedAutoCorrect = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
        && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F5');

      this.selectedAutoCorrect = this.selectedAutoCorrect.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      });

      this.selectedReformat = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
        && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F10');

      this.selectedReformat = this.selectedReformat.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      });

      this.selectedLocate = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
        && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F3');

      this.selectedLocate = this.selectedLocate.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      });

      this.selectedReview = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
        && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F6');

      this.selectedReview = this.selectedReview.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      });
      // console.log('Data validation custom rule', data.filter(m => m.fieldRuleValidation.isCustomRule == 1));
      // this.tempcustomRuleValidations = data.sort((a, b) => (a.methodSequenceId > b.methodSequenceId) ? 1 : -1)
      // .filter(m => m.id == 0 && m.fieldRuleValidation.isCustomRule == 1 );

      this.customRuleValidations = data.sort((a, b) => (a.methodSequenceId > b.methodSequenceId) ? 1 : -1)
        .filter(m => m.id > 0 && m.isMapped == true && m.isActive == true && m.fieldRuleValidation.isCustomRule == 1);

      this.tempcustomRuleValidations = data.sort((a, b) => (a.methodSequenceId > b.methodSequenceId) ? 1 : -1)
        .filter(m => m.id > 0 && m.isActive == false
          && m.fieldRuleValidation.isCustomRule == 1);


      // custom rule validation more than 0 user will get display list else user will get display the editor
      if (this.customRuleValidations.length > 0 || this.tempcustomRuleValidations.length > 0) {
        this.customValidationEdits = false;
      }
      else {
        this.customValidationEdits = true;
      }

      this.defaultValidations = data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
        .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
          && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F7');


      this.defaultAutoCorrect = data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
        .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
          && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F5');

      this.defaultReformat = data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
        .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
          && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F10');

      this.defaultLocate = data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
        .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
          && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F3');

      this.defaultReview = data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
        .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
          && m.fieldRuleValidation.isExtractionRule === false && m.fieldRuleValidation.functionName == 'F6');


      this.selectedExtractValidations = data.sort((a, b) => {
        return a.methodSequenceId < b.methodSequenceId ? -1 : 1;
      }).filter(m => m.id > 0 && m.isMapped == true && m.isActive == true && m.fieldRuleValidation.isCustomRule == 0
        && m.fieldRuleValidation.isExtractionRule === true);

      this.defaultExtractValidations =
        data.sort((a, b) => (a.fieldRuleValidation.description > b.fieldRuleValidation.description) ? 1 : -1)
          .filter(m => m.isActive == false && m.fieldRuleValidation.isCustomRule == 0
            && m.fieldRuleValidation.isExtractionRule === true);

      thisitem.expFunctionList =
        data.filter(m => m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false).map(item => {
          {
            return this.formDTOexpFunctionList(item);
          }
        });

      thisitem.expFunctionList = thisitem.expFunctionList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

      thisitem.expExpressionList =
        data.filter(m => m.fieldRuleValidation.isCustomRule == 1 && m.id > 0
          && m.fieldRuleValidation.isExtractionRule === false).map(item => { { return this.formDTOexpExpressionList(item); } });

      thisitem.expExpressionList = thisitem.expExpressionList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

      thisitem.formDTOCustomRuleValidation();
    });
  }
  formDTOexpFunctionList(item) {
    return {
      id: item.id, name: item.fieldRuleValidation.name, description: item.fieldRuleValidation.description,
      count: item.fieldRuleValidation.noOfParameters,
      isCustomRule: item.fieldRuleValidation.isCustomRule, isActive: item.fieldRuleValidation.isActive,
      expression: item.fieldRuleValidation.validationExpression,
      tabName: 'Function'
    };
  }
  formDTOexpExpressionList(item) {
    return {
      id: item.id, name: item.fieldRuleValidation.name, description: item.fieldRuleValidation.description,
      count: item.fieldRuleValidation.noOfParameters,
      isCustomRule: item.fieldRuleValidation.isCustomRule, isActive: item.fieldRuleValidation.isActive,
      expression: item.fieldRuleValidation.validationExpression,
      tabName: 'Expression'
    };
  }
  fieldvalidationlist$(sendPrm, docTypeFieldMappingId) {
    return this.service.getAll('OntologyApi/GetAllfieldvalidationbyfield', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return new FieldValidationMapping(item.id, docTypeFieldMappingId, item.fieldRuleValidationId, item.isMapped,
        item.fieldRuleValidation, item.parameterValue, false, item.methodSequenceId, item.dependentMethodSequenceId, item.isActive);
    })));
  }
  // Reg expression List Binding and editing
  getRegExpressionEdit(id: any) {

    const sendPrm = '?id=' + id; // here id is field - subtype mapping id DocTypeFieldMappingID // pls change 51 to id
    this.fieldregularexpressiongrdlist$(sendPrm, id).subscribe(data => {
      this.documentfieldregexlist = data;
      this.selectedExpressions = data.sort((a, b) => (a.fieldRegularExpression.name > b.fieldRegularExpression.name) ? 1 : -1)
        .filter(m => m.id > 0);

      this.defaultExpressions = data.sort((a, b) => (a.fieldRegularExpression.name > b.fieldRegularExpression.name) ? 1 : -1)
        .filter(m => m.id === 0);


    });
  }
  fieldregularexpressiongrdlist$(sendPrm, documentfieldid) {
    return this.service.getAll('OntologyApi/GetAllRegularExpressionMapped', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return new FieldRegExpressionMapping(item.id, documentfieldid, item.fieldRegularExpressionID,
        item.fieldRegularExpression, item.isMapped, false);
    })));
  }
  //Synonyms  Code

  SynonymsEdit(e) {
    this.documentfieldmodel = e;
    const sendPrm = '?id=' + e.id;
    this.getSysnonymslist$(sendPrm).subscribe(data => {
      // this.fieldsynonymslstmodel = data;
      this.getSynonymsArray = data;
    });
    for (var i = 0; i < this.getSynonymsArray.length; i++) {
      this.getSynonymsArray[i]["RowNumber"] = i + 1;
    }
    this.popupVisible = true;
  }
  getSysnonymslist$(sendPrm) {
    return this.service.getAll('OntologyApi/GetSynonymsdetails', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return new SynonymsDetails(item.id, item.docTypeFieldMappingID, item.synonym, item.priority, item.isDeleted);
    })));
  }
  getSysnonymslist(id: any) {
    const sendPrm = '?id=' + id;
    this.getSysnonymslist$(sendPrm).subscribe(data => {
      // this.fieldsynonymslstmodel = data;
      this.getSynonymsArray = data.sort((a, b) => {
        return a.priority < b.priority ? -1 : 1;
      });
      for (let i = 0; i < this.getSynonymsArray.length; i++) {
        this.getSynonymsArray[i].rowNumber = i + 1;
      }
    });
  }
  createSynonyms(synonymsData, fieldData) {
    if (this.synonymstaberror == false) {
      let synonymexist = false;
      if (synonymsData.synonym !== "undefined" && synonymsData.synonym !== "") {
        synonymsData.docTypeFieldID = fieldData.id;
        // this.fieldsynonymslstmodel.push(synonymsData);
        if (this.getSynonymsArray.length > 0) {
          this.getSynonymsArray.forEach(e => {
            if (e.synonym == synonymsData.synonym) {
              synonymexist = true;
              //this.synonymstaberror = true;
            }
          });
        }
        if (!synonymexist) {
          synonymsData.rowNumber = this.getSynonymsArray.length + 1;
          this.getSynonymsArray.forEach(e => {
            var index1 = this.getSynonymsArray.indexOf(e);
            e.priority = index1 + 1;
          });
          synonymsData.priority = this.getSynonymsArray.length + 1;
          this.getSynonymsArray.push(synonymsData);
          // this.getSynonymsArray = this.fieldsynonymslstmodel;
          this.synonymmodel = this.initDocumentSynonymsModel();
          // this.valsynonym.instance.reset();
        }
        else {
          this.synonymmodel = this.initDocumentSynonymsModel();
          notify('Duplicate Synonym');
        }
      }
    }
  }
  formToCustomValidation(data) {
    var fieldcustvalidation = {
      id: data.fieldRuleValidation.id,
      name: data.fieldRuleValidation.validationName.trim(),
      expression: data.fieldRuleValidation.validationExpression,
      description: data.fieldRuleValidation.description,
      noOfParameters: data.fieldRuleValidation.noOfParameters,
      isCustomRule: 1,
      isActive: data.fieldRuleValidation.isActive,
      parameter: data.fieldRuleValidation.parameter,
      fieldRuleValidationID: data.fieldRuleValidation.fieldRuleValidationID,
      documentFieldValidationID: data.fieldRuleValidation.documentFieldValidationID,
      isExtractionRule: data.fieldRuleValidation.isExtractionRule,
      validationSequence: data.fieldRuleValidation.validationSequence,
      methodSequenceId: data.fieldRuleValidation.methodSequenceId,
      dependentMethodSequenceId: data.fieldRuleValidation.dependentMethodSequenceId,
      parameterName: data.fieldRuleValidation.parameterName,
      dependentWordDetails: data.fieldRuleValidation.dependentWordDetails
    };
    var fieldcustvalidation1 = new FieldValidationMapping(data.id, data.docTypeFieldMappingID, data.fieldRuleValidationID,
      true, fieldcustvalidation, '', false, data.methodSequenceId, data.dependentMethodSequenceId, data.isActive);
    return fieldcustvalidation1;
  }


  formDto($data, synonymslst, validationlst, regexlist, AutoCorrectList, Locatelist, refomatlist, reviewlist) {
    const row = <DocumentField>$data;
    return {
      id: row.id,
      documentTypeID: row.documentTypeID,
      documentFieldID: row.documentFieldID,
      fieldName: row.fieldName,
      fielddescription: row.fielddescription,
      fieldDataTypeID: row.fieldDataTypeID,
      fieldDataType: row.fieldDataType,
      documentSubTypeID: row.documentSubTypeID,
      isMandatory: row.isMandatory,
      isTabularField: row.isTabularField,
      fieldSequence: row.fieldSequence,
      tableSequence: row.tableSequence,
      isAnchor: row.isAnchor,
      isActive: row.isActive,
      confidenceLevel: row.confidenceLevel,
      displayName: row.displayName,
      fieldStructure: row.fieldStructure,
      zoneType: row.zoneType,
      filedLocation: row.filedLocation,
      criticallevel: row.criticallevel,
      minConfForBlankOut: row.minConfForBlankOut,
      minConfForColor: row.minConfForColor,
      editable: row.editable,
      confirmBaseOnConfLevel: row.confirmBaseOnConfLevel,
      fieldLevelConf: row.fieldLevelConf,
      charLevelConf: row.charLevelConf,
      fieldDisplayMode: row.fieldDisplayMode,
      masterTableFieldId: row.masterTableFieldId,
      minLength: row.minLength,
      maxLength: row.maxLength,
      documentTypeTableId: row.documentTypeTableId,
      documentTypeTableName: row.documentTypeTableName,
      documentTypeTableDesc: row.documentTypeTableDesc,
      documentSynonoymsList: synonymslst,
      documentValidationList: validationlst,
      documentRegExList: regexlist,
      documentAutoCorrectList: AutoCorrectList,
      documentLocateList: Locatelist,
      documentRefomatList: refomatlist,
      documentReviewList: reviewlist
    };

  }
  // GET ONLY FIELD LIST FOR ADD VALIDATION EXPRESSION EDITOR PAGE ...... Field list
  getAllFieldsExpressionEditor(subtypeid) {
    this.getexpfieldlist$(subtypeid).subscribe(data => {
      this.expFieldList = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    });
  }
  //subtype wise
  getexpfieldlist$(subtypeid) {
    const sendPrm = '?id=' + subtypeid;
    return this.service.getAll('OntologyApi/GetAllDocumentFieldsBySubtypeid', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
      return {
        id: item.documentFieldID, name: item.fieldName,
        description: item.fieldDescription, count: 0, isCustomRule: 0, isActive: 1, expression: '', tabName: 'Field'
      };
    })));
  }
  getRegExpressionExpressionEditor(id: any) {
    const sendPrm = '?id=' + id; // here id is field - subtype mapping id DocTypeFieldMappingID // pls change 51 to id
    this.fieldregularexpressiongrdlist$(sendPrm, id).subscribe(data => {
      this.expExpressionList = data;

    });
  }
  getValidationlistExpressionEditor(id: any) {
    const sendPrm = '?id=' + id;// here id is field - subtype mapping id DocTypeFieldMappingID // pls change 51 to id
    this.fieldvalidationlist$(sendPrm, id).subscribe(data => {
      this.expFunctionList = data.filter(m => m.id > 0 && m.fieldRuleValidation.isCustomRule == 0);
    });
  }
  getallfieldsfunctionslist$() {
    return this.service.getAll('OntologyApi/GetAllFieldValidation').pipe(map((data: any[]) => data.map((item: any) => {
      return {
        id: item.id, name: item.name, description: item.description, count: item.noOfParameters,
        isCustomRule: item.isCustomRule, isActive: item.isActive,
        expression: item.expression, tabName: (item.isCustomRule == 1 ? 'Expression' : 'Function')
      };
    })));
  }
  getallfunctions() {
    const allexp = this.getallfieldsfunctionslist$().pipe(map(items => items.filter(x => x.isCustomRule === false), error => error)
    );
    allexp.subscribe(p => { this.expFieldList = p; });
  }
  formDTOCustomRuleValidation() {

    this.customValidationTab = [{
      "ID": 1,
      "tabName": "Field",
      "content": this.expFieldList
    }
      //   ,
      // {
      //   "ID": 2,
      //   "tabName": "Functions",
      //   "content": this.expFunctionList
      // }
      //   ,
      // {
      //   "ID": 3,
      //   "tabName": "Expressions",
      //   "content": this.expExpressionList
      // }
    ];


  }
  // Add button click - Empty the model -Cusotm Tab
  AddCustomRule() {
    this.docfieldValidation = new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '', '', '');
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
    this.customValidationEdits = true;
    if (this.showTabContentcustom == "" || this.showTabContentcustom == null) { this.showTabContentcustom = 'Field'; this.getIndex(0, null); }
  }
  // on cancel button click - Popup=> Custom Tab inter Cancel  -Cusotm Tab
  onCancelCustomRuleValidationEdits() {
    this.docfieldValidation = new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '', '', '');
    this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
    this.showTabContentcustom = 'Field';
    this.getIndex(0, null);
    this.customValidationEdits = false;
  }
  //Edit on Rule validation in Custom tab
  editCustomRuleValidation(data, index) {

    this.customValidationEdits = true;

    this.customvalidationmapping = new FieldValidationMapping(
      data.id, data.docTypeFieldMappingID, data.fieldRuleValidationID, 1,
      new FieldRuleValidation(data.fieldRuleValidationID, data.fieldRuleValidation.name, data.fieldRuleValidation.expression,
        data.fieldRuleValidation.description, data.fieldRuleValidation.parameterInfo, data.fieldRuleValidation.noOfParameters, data.fieldRuleValidation.isCustomRule,
        data.fieldRuleValidation.isActive, data.fieldRuleValidation.functionName, data.fieldRuleValidation.isExtractionRule, data.fieldRuleValidation.validationSequence, data.fieldRuleValidation.parameterName),
      data.parameterValue, data.isDeleted, data.methodSequenceId, data.dependentMethodSequenceId, data.isActive);

    const toIndex = this.tempcustomRuleValidations.indexOf(data);
    this.customvalidationmapping.rowIndex = toIndex;
  }
  onAdddefaultExtractValidations(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovedefaultExtractValidations(e) {

    let name = e.itemElement.children[0].children[1].innerHTML;
    // let name = e.itemData.fieldRuleValidation.name;
    // let data = e.fromData.filter(x => x.fieldRuleValidation.name === name);

    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    let fromindex = e.fromData.indexOf(data[0]);
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;
    e.fromData.splice(fromindex, 1);
    // e.itemData.isDeleted = false;
    // e.itemData.isMapped = true;
    // e.fromData.splice(e.fromIndex, 1);

    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }

    this.selectedExtractValidations = e.toData;
    this.defaultExtractValidations = e.fromData;
    // this.fieldvalidationmappinglist = [].concat(this.selectedExtractValidations, this.defaultExtractValidations);
  }
  onAddtempcustomRuleValidations(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
  onRemovetempcustomRuleValidations(e) {
    // let name = e.itemElement.children[0].children[1].innerHTML;
    this.tempcustomRuleValidations = [];
    let name = e.itemElement.children[0].children[0].children[0].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    let fromindex = e.fromData.indexOf(data[0]);
    // let data = e.itemData;
    data[0].isDeleted = false;
    data[0].isMapped = true;
    data[0].isActive = true;

    e.fromData.splice(fromindex, 1);

    if (e.toData.length > 0) {
      e.toData.forEach(x => {
        var index3 = e.toData.indexOf(x);
        x.methodSequenceId = index3 + 1;
      });
    }
    else {
      e.toData[0].methodSequenceId = 1;
    }
    this.customRuleValidations = e.toData;
    this.tempcustomRuleValidations = e.fromData;
  }

  onAddcustomRuleValidations(e) {
    let name = e.itemElement.children[0].children[0].children[0].innerHTML;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
    e.toData.splice(e.toIndex, 0, data[0]);
  }



  onRemovecustomRuleValidations(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.customRuleValidations = e.fromData;
    this.tempcustomRuleValidations = e.toData;
  }
  changevalidationExtractParamterValue(index, data, e) {
    if (this.selectedExtractValidations.length > 0) {
      let paramvalindex = this.selectedExtractValidations.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedExtractValidations[paramvalindex].fieldRuleValidation.noOfParameters;

      let existingParamVal = this.selectedExtractValidations[paramvalindex].parameterValue;

      if (this.selectedExtractValidations[paramvalindex].parameterValue != undefined &&
        this.selectedExtractValidations[paramvalindex].parameterValue != null &&
        this.selectedExtractValidations[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i + 1 == index) {
            item.value = e.value;
          }
        });

        const JSON_string = JSON.stringify(result);
        this.selectedExtractValidations[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterName != null &&
          data.fieldRuleValidation.parameterName != '') {

          if (paramvalnoOfParameters > 1) {
            let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index - 1) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x]) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x]) + '\" ,"value": \"' + '\"  },';
              }
            }
          }
          else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + data.fieldRuleValidation.parameterName + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedExtractValidations[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookExtractionParameterAlerts();
    }
  }
  getvalidationExtractparametervalue(data, index) {
    let result = [];
    if (data != null && data != undefined && data != '') {
      // data = data.replace('[', '').replace(']', '');
      result = JSON.parse(data);
      return result[index].value;
    }
    else {
      return null;
    }
  }
  getValidationExtractionparamtername(index, data) {
    if (data != null && data != undefined && data != '') {
      let prmNameArray = data.split(',');

      return prmNameArray[index];
    }
    else {
      return null;
    }
  }
  onAddselectedExtractValidations(e) {
    // e.toData.splice(e.toIndex, 0, e.itemData);
    // let name = e.itemElement.children[0].children[1].innerHTML;
    let name = e.itemElement.children[0].children[1].innerHTML;
    // let name = e.itemData.fieldRuleValidation.name;
    let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());

    // below block would delete parameter values and availbale to user fresh insert
    let existingParamVal = data[0].parameterValue;
    if (existingParamVal.length > 0) {
      if (data[0].parameterValue != undefined &&
        data[0].parameterValue != null &&
        data[0].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          item.value = '';
        });
        const JSON_string = JSON.stringify(result);
        data[0].parameterValue = JSON_string;
        data[0].methodSequenceId = e.toIndex;
        //console.log('onadd', this.selectedExtractValidations);
      }
    }
    // above block would delete parameter values and availbale to user fresh insert
    e.toData.splice(e.toIndex, 0, data[0]);
  }
  onRemoveselectedExtractValidations(e) {
    e.itemData.isDeleted = true;
    e.itemData.isMapped = false;
    e.itemData.isActive = false;
    e.fromData.splice(e.fromIndex, 1);
    this.selectedExtractValidations = e.fromData;
    this.defaultExtractValidations = e.toData;
    // this.fieldvalidationmappinglist = [].concat(this.selectedExtractValidations, this.defaultExtractValidations);
  }
  // onSelectedDragEnd(e) {
  //   if (e.toComponent._$element[0].id == 'extraction' && e.element.id == 'extraction') {


  //     const visibleRows = e.fromData;
  //     const toIndex = e.toIndex;
  //     const fromIndex = e.fromIndex;

  //     visibleRows.splice(fromIndex, 1);
  //     visibleRows.splice(toIndex, 0, e.itemData);

  //     visibleRows.forEach(e => {
  //       var index = visibleRows.indexOf(e);
  //       e.methodSequenceId = index + 1;
  //     });

  //     this.selectedExtractValidations = visibleRows;
  //   }

  // }
  onReorder(e) {
    if (e.element.id == 'synonym') {
      const toIndex1 = e.toIndex;
      const fromIndex1 = e.fromIndex;
      this.getSynonymsArray.splice(fromIndex1, 1);
      this.getSynonymsArray.splice(toIndex1, 0, e.itemData);
      this.getSynonymsArray.forEach(e => {
        var index1 = this.getSynonymsArray.indexOf(e);
        e.priority = index1 + 1;
      });
    }
    if (e.element.id == 'tablelist') {
      const toIndex2 = e.toIndex;
      const fromIndex2 = e.fromIndex;
      this.tabulatedFieldList.splice(fromIndex2, 1);
      this.tabulatedFieldList.splice(toIndex2, 0, e.itemData);
      this.tabulatedFieldList.forEach(e => {
        var index2 = this.tabulatedFieldList.indexOf(e);
        e.sequence = index2 + 1;
      });
      this.updateTableSequence();
    }
    if (e.element.id == 'extraction') {
      const toIndex3 = e.toIndex;
      const fromIndex3 = e.fromIndex;
      this.selectedExtractValidations.splice(fromIndex3, 1);
      this.selectedExtractValidations.splice(toIndex3, 0, e.itemData);
      if (this.selectedExtractValidations.length > 0) {
        if (this.selectedExtractValidations != null && this.selectedExtractValidations.length > 0) {
          this.selectedExtractValidations.forEach(x => {
            var index3 = this.selectedExtractValidations.indexOf(x);
            x.methodSequenceId = index3 + 1;
          });
        }
      }
    }

    if (e.element.id == 'selectValidation') {
      const toIndex4 = e.toIndex;
      const fromIndex4 = e.fromIndex;

      this.selectedValidations.splice(fromIndex4, 1);
      this.selectedValidations.splice(toIndex4, 0, e.itemData);

      if (this.selectedValidations.length > 0) {
        if (this.selectedValidations != null && this.selectedValidations.length > 0) {
          this.selectedValidations.forEach(x => {
            var index3 = this.selectedValidations.indexOf(x);
            x.methodSequenceId = index3 + 1;
          });
        }
      }
    }
    // customrule validation reorder 
    if (e.element.id == 'customrule') {
      const toIndex4 = e.toIndex;
      const fromIndex4 = e.fromIndex;

      this.customRuleValidations.splice(fromIndex4, 1);
      this.customRuleValidations.splice(toIndex4, 0, e.itemData);

      if (this.customRuleValidations.length > 0) {
        if (this.customRuleValidations != null && this.customRuleValidations.length > 0) {
          this.customRuleValidations.forEach(x => {
            var index3 = this.customRuleValidations.indexOf(x);
            x.methodSequenceId = index3 + 1;
          });
        }
      }
    }
  }
  GetTablename(sendprm) {
    const sendPrm = '?dbvalidationId=' + sendprm;
    return this.service.getAll('OntologyApi/GetTablename',sendPrm)
      .pipe(map((data: any) => { return data }));

  }
  GetColumnName(sendprm)
  {
    const sendPrm = '?tblvalidationId=' + sendprm;
    return this.service.getAll('OntologyApi/GetColumnName',sendPrm)
      .pipe(map((data: any) => { return data }));
  }

  changevalidationParamterValue(index, data, e, _controltype) {
    debugger;
    if (e.value != "" && e.value != undefined && _controltype == 'DB') {
      this.GetTablename(e.value).subscribe((data: any)=>{
        this.TblSource= data});
    }else if(e.value != "" && e.value != undefined && _controltype == 'TBL')
    {
      this.GetColumnName(e.value).subscribe((data: any)=>{
        this.Tblcolumn= data});
    }
    if (this.selectedValidations.length > 0) {
      let paramvalindex = this.selectedValidations.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedValidations[paramvalindex].fieldRuleValidation.noOfParameters;
      let existingParamVal = this.selectedValidations[paramvalindex].parameterValue;

      if (this.selectedValidations[paramvalindex].parameterValue != undefined &&
        this.selectedValidations[paramvalindex].parameterValue != null &&
        this.selectedValidations[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i == index) {
            item.value = e.value;
          }
        });
        const JSON_string = JSON.stringify(result);
        this.selectedValidations[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterInfo != null &&
          data.fieldRuleValidation.parameterInfo != '') {
          let prarry = JSON.parse(data.fieldRuleValidation.parameterInfo);
          if (paramvalnoOfParameters > 0) {

              
            // let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + '\"  },';
              }
            }
          } else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + prarry[0].name + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedValidations[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookValidationParameterAlerts();
    }
  }

  changeAutoCorrectParamterValue(index, data, e, _controltype) {

    if (this.selectedAutoCorrect.length > 0) {
      let paramvalindex = this.selectedAutoCorrect.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedAutoCorrect[paramvalindex].fieldRuleValidation.noOfParameters;
      let existingParamVal = this.selectedAutoCorrect[paramvalindex].parameterValue;

      if (this.selectedAutoCorrect[paramvalindex].parameterValue != undefined &&
        this.selectedAutoCorrect[paramvalindex].parameterValue != null &&
        this.selectedAutoCorrect[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i == index) {
            item.value = e.value;
          }
        });
        const JSON_string = JSON.stringify(result);
        this.selectedAutoCorrect[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterInfo != null &&
          data.fieldRuleValidation.parameterInfo != '') {
          let prarry = JSON.parse(data.fieldRuleValidation.parameterInfo);
          if (paramvalnoOfParameters > 0) {


            // let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + '\"  },';
              }
            }
          } else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + prarry[0].name + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedAutoCorrect[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookValidationParameterAlerts();
    }
  }
  changeLocateParamterValue(index, data, e, _controltype) {

    if (this.selectedLocate.length > 0) {
      let paramvalindex = this.selectedLocate.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedLocate[paramvalindex].fieldRuleValidation.noOfParameters;
      let existingParamVal = this.selectedLocate[paramvalindex].parameterValue;

      if (this.selectedLocate[paramvalindex].parameterValue != undefined &&
        this.selectedLocate[paramvalindex].parameterValue != null &&
        this.selectedLocate[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i == index) {
            item.value = e.value;
          }
        });
        const JSON_string = JSON.stringify(result);
        this.selectedLocate[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterInfo != null &&
          data.fieldRuleValidation.parameterInfo != '') {
          let prarry = JSON.parse(data.fieldRuleValidation.parameterInfo);
          if (paramvalnoOfParameters > 0) {


            // let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + '\"  },';
              }
            }
          } else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + prarry[0].name + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedLocate[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookValidationParameterAlerts();
    }
  }
  changeReviewParamterValue(index, data, e, _controltype) {

    if (this.selectedReview.length > 0) {
      let paramvalindex = this.selectedReview.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedReview[paramvalindex].fieldRuleValidation.noOfParameters;
      let existingParamVal = this.selectedReview[paramvalindex].parameterValue;

      if (this.selectedReview[paramvalindex].parameterValue != undefined &&
        this.selectedReview[paramvalindex].parameterValue != null &&
        this.selectedReview[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i == index) {
            item.value = e.value;
          }
        });
        const JSON_string = JSON.stringify(result);
        this.selectedReview[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterInfo != null &&
          data.fieldRuleValidation.parameterInfo != '') {
          let prarry = JSON.parse(data.fieldRuleValidation.parameterInfo);
          if (paramvalnoOfParameters > 0) {


            // let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + '\"  },';
              }
            }
          } else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + prarry[0].name + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedReview[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookValidationParameterAlerts();
    }
  }
  changeRefomatParamterValue(index, data, e, _controltype) {

    if (this.selectedReformat.length > 0) {
      let paramvalindex = this.selectedReformat.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
      let paramvalnoOfParameters = this.selectedReformat[paramvalindex].fieldRuleValidation.noOfParameters;
      let existingParamVal = this.selectedReformat[paramvalindex].parameterValue;

      if (this.selectedReformat[paramvalindex].parameterValue != undefined &&
        this.selectedReformat[paramvalindex].parameterValue != null &&
        this.selectedReformat[paramvalindex].parameterValue != '') {
        let result = JSON.parse(existingParamVal);
        result.forEach((item, i) => {
          if (i == index) {
            item.value = e.value;
          }
        });
        const JSON_string = JSON.stringify(result);
        this.selectedReformat[paramvalindex].parameterValue = JSON_string;
      }
      else {
        var savingparamjson = '[';
        if (data.fieldRuleValidation.parameterInfo != null &&
          data.fieldRuleValidation.parameterInfo != '') {
          let prarry = JSON.parse(data.fieldRuleValidation.parameterInfo);
          if (paramvalnoOfParameters > 0) {


            // let prarry = data.fieldRuleValidation.parameterName.split(',');
            for (let x = 0; x < prarry.length; x++) {
              if (x == index) {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + e.value + '\"},';
              }
              else {
                savingparamjson = savingparamjson + ' {"name":' + '\"' + (prarry[x].name) + '\" ,"value": \"' + '\"  },';
              }
            }
          } else {
            savingparamjson = savingparamjson
              + ' {"name":' + '\"' + prarry[0].name + '\" ,"value": \"' + e.value + '\"},';
          }
        }

        savingparamjson = savingparamjson.slice(0, -1);
        savingparamjson = savingparamjson + ']';
        this.selectedReformat[paramvalindex].parameterValue = savingparamjson.toString();
      }
      this.lookValidationParameterAlerts();
    }
  }
  lookExtractionParameterAlerts() {
    this.extractionSequencetaberror = false;
    if (this.selectedExtractValidations.length > 0) {
      let checklst = this.selectedExtractValidations.filter(x => x.fieldRuleValidation.noOfParameters > 0)
      if (checklst.length > 0) {
        checklst.forEach(x => {
          let existingParamVal = x.parameterValue;
          if (x.parameterValue == '' || x.parameterValue == undefined || x.parameterValue == null) {
            this.extractionSequencetaberror = true;
          }

          if (x.parameterValue != null && x.parameterValue != '') {
            let changeParamArray = existingParamVal.split(',');

            for (let i = 0; i < changeParamArray.length; i++) {

              // let validatesplarray = changeParamArray[i].split(':');
              // if (i + 1 == changeParamArray.length) {
              //   if(validatesplarray[1] =='null }]'){
              //     this.extractionSequencetaberror = true;
              //   }
              //   else if(validatesplarray[1] =='"" }]'){
              //     this.extractionSequencetaberror = true;
              //   }
              // }
              // else{
              //   if(validatesplarray[1] =='null'){
              //     this.extractionSequencetaberror = true;
              //   }
              // }
              let result = JSON.parse(existingParamVal);
              result.forEach((item, i) => {
                if (item.value == '' || item.value == null) {
                  this.extractionSequencetaberror = true;
                }
              });



            }

          }
        });
      }
    }
  }

  getvalidationparametervalue(data, index) {

    let result = [];
    if (data != null && data != undefined && data != '') {

      if (data.parameterValue != null && data.parameterValue != '' && data.parameterValue != undefined) {
        result = JSON.parse(data.parameterValue);
        return result[index].value;
      }


    }
    else {
      return null;
    }
  }

  getValidationparamtername(index, data) {

    if (data != null && data != undefined && data != '') {

      const result = JSON.parse(data);
      return result[index].name;

    }
    else {
      return null;
    }
  }

  getValidationparamtercontrolvalues(index, data) {

    if (data != null && data != undefined && data != '') {

      const result = JSON.parse(data);
      return result[index].ControlValues;

    }
    else {
      return null;
    }
  }

  DbSource: any[];
  TblSource: any[];
  ConnectionString: string;
  dbnames: any;
  Tblcolumn:any[];
  //check parametertype of controls
  getValidationparamterType(index, parameterinfo) {

    if (parameterinfo != null && parameterinfo != undefined && parameterinfo != '') {
      const result = JSON.parse(parameterinfo);
      if (result[index].ControlType == 'D') {

        //fill dropdown using controlvaluessource
        this.controlvaluessource = result[index].ControlValues;
        //this.controlvaluessourceTest=[];
        //this.controlvaluessourceTest= [{ 'ValueId': 1, 'ValueDisplay': 'Single Word' }, { 'ValueId': 2, 'ValueDisplay': 'Multiple Word' }]; //result[index].ControlValues;
        return result[index].ControlType;
      }
      else if (result[index].ControlType == 'DB') {
        //debugger;
        if (this.DbSource==null || this.DbSource==undefined ||this.DbSource==[]) {
          this.GetDBNames().subscribe((data: any) => {
            console.log(data);
           debugger;
           this.DbSource=data;
          });
          return result[index].ControlType;
        }
      }
      return result[index].ControlType;
    } else {
      return null;
    }
  }
  GetDBNames() {
    return this.service.getAll('OntologyApi/Getdbnamesvalidation')
      .pipe(map((data: any) => { return data }));

  }

  lookValidationParameterAlerts() {
    this.validationstaberror = false;
    if (this.selectedValidations.length > 0) {
      let checklst = this.selectedValidations.filter(x => x.fieldRuleValidation.noOfParameters > 1)
      if (checklst.length > 0) {
        checklst.forEach(x => {
           
          let existingParamVal = x.parameterValue;
          if (x.parameterValue == '' || x.parameterValue == undefined || x.parameterValue == null) {
            this.validationstaberror = true;
          }

          if (x.parameterValue != null && x.parameterValue != '') {
            let result = JSON.parse(existingParamVal);
            if (x.fieldRuleValidation.parameterInfo != null && x.fieldRuleValidation.parameterInfo != '') {
              let fldRulevalidation = JSON.parse(x.fieldRuleValidation.parameterInfo);
              result.forEach((item, i) => {
                if (fldRulevalidation[i].IsMandatory.toLowerCase() == 'true') {
                  if (item.value == '' || item.value == null) {
                    this.validationstaberror = true;
                  }
                }
              });
            }
          }
        });
      }
    }
  }

  getIsManadatoryParameter(index, parameterinfo) {

    if (parameterinfo != null && parameterinfo != undefined && parameterinfo != '') {
      const result = JSON.parse(parameterinfo);
      return result[index].IsMandatory.toLowerCase();
    } else {
      return null;
    }
  }

  itemClick(e) {
    const a = this.customvalidationmapping.fieldRuleValidation.validationExpression;
    const b = e;

    if (this.caretPos === 1 && this.customvalidationmapping.fieldRuleValidation.validationExpression.length > 1) {
      this.caretPos = (this.customvalidationmapping.fieldRuleValidation.validationExpression).length + 1;
    }
    const position = this.caretPos;
    this.customvalidationmapping.fieldRuleValidation.validationExpression = [a.slice(0, position), b, a.slice(position)].join('');
    this.caretPos = this.customvalidationmapping.fieldRuleValidation.validationExpression.length + 2;
  }
  ontologyValuedblclick(e, myTextArea) {
    const paracountfunc = e.count;

    let concatenatestring = '';
    if (this.showTabContentcustom === 'Functions') {
      concatenatestring = e.name + '(';
      if (e.count != null) {
        if (e.count > 1) {
          for (let i = 1; i <= e.count - 1; i++) {
            concatenatestring = concatenatestring + ' , ';
          }
        }
        concatenatestring = concatenatestring + ')  ';
      }
    }

    if (this.showTabContentcustom === 'Field') {
      concatenatestring = '[' + e.name + ']  ';
    }

    if (this.showTabContentcustom === 'Expressions') {
      concatenatestring = '' + e.name + '  ';
    }


    const a = this.customvalidationmapping.fieldRuleValidation.validationExpression;
    const b = concatenatestring;
    const position = this.caretPos;
    this.customvalidationmapping.fieldRuleValidation.validationExpression = [a.slice(0, position), b, a.slice(position)].join('');
    // myTextArea.nativeElement.focus();
    // alert(this.caretPos);
    if (this.selectedtype === 'Functions') {
      this.caretPos = this.customvalidationmapping.fieldRuleValidation.validationExpression.length - (paracountfunc + (2 * paracountfunc));
    } else {
      this.caretPos = this.customvalidationmapping.fieldRuleValidation.validationExpression.length;
    }
    // alert(this.caretPos);
  }
  getCaretPos(oField) {
    this.customvalidationmapping.fieldRuleValidation.validationExpression = oField.value;
    if (oField.selectionStart || oField.selectionStart === '0') {
      this.caretPos = oField.selectionStart;
      // alert(this.caretPos);
    }
  }
  // save Custom rule validation on fly and save in temp basis -Cusotm Tab
  saveTempValidation(targetGroup) {
    let result = targetGroup.instance.validate().isValid;
    if (result) {
      var varcustomrulevalidation = this.formToCustomValidation(this.customvalidationmapping);

      if (this.customvalidationmapping['rowIndex'] == undefined) {
        varcustomrulevalidation['rowIndex'] = (this.tempcustomRuleValidations.length - 1) + 1;
        this.tempcustomRuleValidations.push(varcustomrulevalidation);
        //this.expExpressionList.push(this.formDTOexpExpressionList(varcustomrulevalidation));// 3455 -- Adding rule in  Custom Expression list on fly
      }
      else {
        var index = this.customvalidationmapping['rowIndex']
        this.tempcustomRuleValidations[index] = varcustomrulevalidation;
        this.tempcustomRuleValidations[index].rowIndex = index;
      }
      this.onCancelCustomRuleValidationEdits();
      this.showTabContentcustom = 'Field';
      this.getIndex(0, null);
      this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
    }
  }
  validateSummaryValue(synonymsData) {
    let synonymexist = false;
    this.synonymstaberror = false;
    if (synonymsData.synonym !== "undefined" && synonymsData.synonym !== "") {
      synonymsData.rowNumber = this.getSynonymsArray.length + 1;
      if (this.getSynonymsArray.length > 0) {
        this.getSynonymsArray.filter(x => x != synonymsData).forEach(e => {
          if (e.synonym == synonymsData.synonym) {
            synonymexist = true;
            this.synonymstaberror = true;
            notify('Duplicate Synonym');
          }
        });
      }
    }
  }
  validateValidationMandatoryFieldValue(eventData) {
    if (eventData.value == '' || eventData.value == null) {
      this.validationstaberror = true;
      return false;
    }
    else {
      return true;
    }
  }
  validateextractionMandatoryFieldValue(eventData) {
    if (eventData.value == '' || eventData.value == null) {
      this.extractionSequencetaberror = true;
      return false;
    }
    else {
      return true;
    }
  }
  validateNameCustomRuleEditorPopup(eventData) {
    if (this.customValidationEdits == true) {
      if (eventData.value == '' || eventData.value == null) {
        return false;
      }
      else {
        // this.valOntology.instance.validate().isValid = true;
        return true;
      }
    }
  }
  validateDescriptionCustomRuleEditorPopup(eventData) {
    if (this.customValidationEdits == true) {
      if (eventData.value == '' || eventData.value == null) {
        return false;
      }
      else {
        return true;
      }
    }
  }
  validateExpressionCustomRuleEditorPopup(eventData) {
    if (this.customValidationEdits == true) {
      if (eventData.value == '' || eventData.value == null) {
        return false;
      }
      else {
        return true;
      }
    }
  }
  validateFieldMandatoryFieldValue(eventData) {
    if (eventData.value == '' || eventData.value == null) {
      return false;
    }
    else {
      return true;
    }
  }

  formToCustomValidationNew(data) {
    var fieldcustvalidation = {
      id: data.fieldRuleValidation.id,
      name: data.fieldRuleValidation.name,
      expression: data.fieldRuleValidation.expression,
      description: data.fieldRuleValidation.description,
      noOfParameters: data.fieldRuleValidation.noOfParameters,
      isCustomRule: 1,
      isActive: data.fieldRuleValidation.isActive
    };
    var fieldcustvalidation1 = new FieldValidationMapping(data.id, data.docTypeFieldMappingID, data.fieldRuleValidationID,
      true, fieldcustvalidation, '', false, data.methodSequenceId, data.dependentMethodSequenceId, data.isActive);
    return fieldcustvalidation1;

  }
  // prevent submit event on enter
  onEnterKeySynonymAdd(e) {
    if (e.event.keyCode == 13) {
      e.event.preventDefault();
      return false;
    }
  }
  // prevent submit event on enter -Cusotm Tab
  onEnterKeyCustomSearch(e) {
    if (e.event.keyCode == 13) {
      e.event.preventDefault();
      return false;
    }
  }
  // search logic of custom tab Fieldlist, Function list, expression list
  searchCustomValidationtabdata(e) {
    let searchExpr = e.event.target.value;
    if (this.showTabContentcustom === 'Functions') {
      if (e.value != '') {
        this.customValidationTab[1].content = [];
        this.customValidationTab[1].content =
          this.expFunctionList.length > 0 ? this.expFunctionList.filter(x =>
            x.description.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1
            || x.name.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1) : this.expFunctionList;
      }
      else {
        this.customValidationTab[1].content = this.expFunctionList;
      }
    }

    if (this.showTabContentcustom === 'Field') {
      if (e.value != '') {
        this.customValidationTab[0].content = [];
        this.customValidationTab[0].content =
          this.expFieldList.length > 0 ? this.expFieldList.filter(x => x.description.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1
            || x.name.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1) : this.expFieldList;
      }
      else {
        this.customValidationTab[0].content = this.expFieldList;
      }
    }

    if (this.showTabContentcustom === 'Expressions') {
      if (e.value != '') {
        this.customValidationTab[2].content = [];
        this.customValidationTab[2].content =
          this.expExpressionList.length > 0 ? this.expExpressionList.filter(x => x.description.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1
            || x.name.toLowerCase().indexOf(searchExpr.toLowerCase()) > -1) : this.expExpressionList;
      }
      else {
        this.customValidationTab[2].content = this.expExpressionList;
      }
    }
  }
  validateSynonymsValue(eventData) {
    if (eventData.value.length > 400) {
      this.synonymstaberror = true;
      return false;
    }
    else {
      this.synonymstaberror = false;
      return true;
    }
  }


  // checkvalidationOnExtraction : is validate the Extraction Validation & Validation with their data
  checkvalidationOnalidation(x) {
    let boolValid = true;
    let existingParamVal = x.parameterValue;
    if (x.parameterValue == '' || x.parameterValue == undefined || x.parameterValue == null) {
      // this.validationstaberror = true;
      boolValid = false;
    }

    if (x.parameterValue != null && x.parameterValue != '') {
      let result = JSON.parse(existingParamVal);
      result.forEach((item, i) => {

        if (item.value == '' || item.value == null) {
          // this.validationstabekrror = true;
          boolValid = false;
        }
      });
    }
    return boolValid;
  }

  //**************************************** REGION SME POP UP END **************************************************************************************************** */
  saveAutoCorrectArray: any[];
  saveLocateArray: any[];
  saveReviewArray: any[];
  saveRefomarArray: any[];
  onFormSubmit($e) {
     
    this.isOpened = true;
    this.lookValidationParameterAlerts();
    this.lookExtractionParameterAlerts();
    let result = this.valOntology.instance.validate();

    if (result.isValid && this.validationstaberror != true
      && this.synonymstaberror != true && this.customstaberror != true
      && this.regularExpressiontaberror != true && this.extractionSequencetaberror != true
      && this.roitaberror != true
    ) {

      this.fieldsynonymslstmodel = [];
      this.saveRegExArray = [];
      this.saveValidationArray = [];
      this.saveAutoCorrectArray = [];
      this.saveLocateArray = [];
      this.saveRefomarArray = [];
      this.saveReviewArray = [];


      if (this.selectedValidations.length > 0) {
        this.selectedValidations.forEach(x => {
          this.saveValidationArray.push(x);
        });
      }

      if (this.defaultValidations.length > 0) {
        var savevalidation = this.defaultValidations.filter(d => d.id > 0);
        if (savevalidation != null && savevalidation.length > 0) {
          savevalidation.forEach(x => {
            this.saveValidationArray.push(x);
          });
        }
      }

      if (this.selectedAutoCorrect.length > 0) {
        this.selectedAutoCorrect.forEach(x => {
          this.saveAutoCorrectArray.push(x);
        });
      }

      if (this.defaultAutoCorrect.length > 0) {
        var saveAutoCorrect = this.defaultAutoCorrect.filter(d => d.id > 0);
        if (saveAutoCorrect != null && saveAutoCorrect.length > 0) {
          saveAutoCorrect.forEach(x => {
            this.saveAutoCorrectArray.push(x);
          });
        }
      }
      if (this.selectedLocate.length > 0) {
        this.selectedLocate.forEach(x => {
          this.saveLocateArray.push(x);
        });
      }

      if (this.defaultLocate.length > 0) {
        var defaultLocate = this.defaultLocate.filter(d => d.id > 0);
        if (defaultLocate != null && defaultLocate.length > 0) {
          defaultLocate.forEach(x => {
            this.saveLocateArray.push(x);
          });
        }
      }
      if (this.selectedReformat.length > 0) {
        this.selectedReformat.forEach(x => {
          this.saveRefomarArray.push(x);
        });
      }

      if (this.defaultReformat.length > 0) {
        var defaultReformat = this.defaultReformat.filter(d => d.id > 0);
        if (defaultReformat != null && defaultReformat.length > 0) {
          defaultReformat.forEach(x => {
            this.saveRefomarArray.push(x);
          });
        }
      }
      if (this.selectedReview.length > 0) {
        this.selectedReview.forEach(x => {
          this.saveReviewArray.push(x);
        });
      }

      if (this.defaultReview.length > 0) {
        var defaultReview = this.defaultReview.filter(d => d.id > 0);
        if (defaultReview != null && defaultReview.length > 0) {
          defaultReview.forEach(x => {
            this.saveReviewArray.push(x);
          });
        }
      }

      // if (this.defaultExtractValidations.length > 0) {
      //   var savevExtractvalidation = this.defaultExtractValidations.filter(d => d.id > 0);
      //   if (savevExtractvalidation != null && savevExtractvalidation.length > 0) {
      //     savevExtractvalidation.forEach(x => {
      //       this.saveValidationArray.push(x);
      //     });
      //   }
      // }

      // if (this.selectedExtractValidations.length > 0) {
      //   if (this.selectedExtractValidations != null && this.selectedExtractValidations.length > 0) {
      //     let i = 0;
      //     this.selectedExtractValidations.forEach(x => {
      //       // i = i + 1;
      //       // x.methodSequenceId = i;
      //       this.saveValidationArray.push(x);
      //     });
      //   }
      // }

      // Add deleted mapped 
      // this.saveRegExArray = this.selectedExpressions;
      // if (this.defaultExpressions.length > 0) {
      //   var saveexpression = this.defaultExpressions.filter(d => d.id > 0);
      //   if (saveexpression != null && saveexpression.length > 0) {
      //     saveexpression.forEach(m => {
      //       this.saveRegExArray.push(m);
      //     });
      //   }
      // }


      var newlyaddedsynonyms = this.getSynonymsArray.filter(d => d.id == 0 && d.isDeleted == false);
      var mappedsynonyms = this.getSynonymsArray.filter(d => d.id > 0 && d.isDeleted == false);
      if (newlyaddedsynonyms != null && newlyaddedsynonyms.length > 0) {
        newlyaddedsynonyms.forEach(x => {
          this.fieldsynonymslstmodel.push(x);
        });
      }
      if (mappedsynonyms != null && mappedsynonyms.length > 0) {
        mappedsynonyms.forEach(x => {
          this.fieldsynonymslstmodel.push(x);
        });
      }

      // block to implement custom rule validation added custom rule validations
      if (this.customRuleValidations.length > 0) {
        this.customRuleValidations.forEach(x => {
          x.docTypeFieldMappingID = this.documentfieldmodel.id;
          this.saveValidationArray.push(x);
        });
      }

      // block to implement custom rule validation removed custom rule  validation 
      if (this.tempcustomRuleValidations.length > 0) {
        if (this.tempcustomRuleValidations != null && this.tempcustomRuleValidations.length > 0) {
          this.tempcustomRuleValidations.forEach(x => {
            x.isDeleted = true;
            x.isMapped = false;
            x.isActive = false;
            this.saveValidationArray.push(x);
          });
        }
      }



      if (this.documentfieldmodel.id === 0) {
        this.documentfieldmodel.isActive = true;

        //block to add custom rule validation 

        // return;
        if (this.docTypeTable.id > 0) {
          this.documentfieldmodel.documentTypeTableId = this.docTypeTable.id;
          this.documentfieldmodel.documentTypeTableDesc = this.docTypeTable.description;
          this.documentfieldmodel.documentTypeTableName = this.docTypeTable.name;
          //calculate fieldsequence for table field.....when create new field then auto increment field sequnce
        }

        const docfield = this.formDto(this.documentfieldmodel, this.fieldsynonymslstmodel, this.saveValidationArray, this.saveRegExArray, this.saveAutoCorrectArray,
          this.saveLocateArray, this.saveRefomarArray, this.saveReviewArray);
        const post$ = this.service.postAll('OntologyApi/SaveOntologyDetail', docfield);
        const attribute$ = this.getdocumentfieldlist$(this.formsearchfilterDto()).pipe(map(x => { this.docFieldlist = x; }));
        const final$ = post$.pipe(concat(attribute$));
        final$.subscribe(
          (data: any) => {
            if (data != undefined) {
              if (data['result'].value != "Field name already exists") {
                // Invoke the save for ROI Marking section depending on the doctypefieldmappingid returned value
                if (data.docFieldMappingId) {
                  this.roiParameters.docTypeFieldMappingID = data.docFieldMappingId;
                  this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
                  this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
                  this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
                  this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
                  if (this.isROIModified == true) { // Added the if check on 08th Feb 2020 to avoid unnecessary save of ROI
                    this.saveRectangle();
                  }
                }
                // end of save ROI Marking
                this.popupVisible = false;
              }
              this.clearAllObjectMode();
            }
            this.getAllTableListwithoutFields(this.selectedDocumentSubtype);
            notify(data['result'].value);
          }, err => { notify('Error SME Popup'); }
        );
      } else {
        if (this.docTypeTable.id > 0) {
          this.documentfieldmodel.documentTypeTableId = this.docTypeTable.id;
          this.documentfieldmodel.documentTypeTableDesc = this.docTypeTable.description;
          this.documentfieldmodel.documentTypeTableName = this.docTypeTable.name;
        }

        const docfield = this.formDto(this.documentfieldmodel, this.fieldsynonymslstmodel, this.saveValidationArray, this.saveRegExArray, this.saveAutoCorrectArray
          , this.saveLocateArray, this.saveRefomarArray, this.saveReviewArray);
        // const docfield = this.formDto(this.documentfieldmodel);         
        const put$ = this.service.put('OntologyApi/updateOntologyDetail', docfield);
        const attribute$ = this.getdocumentfieldlist$(this.formsearchfilterDto()).pipe(map(x => { this.docFieldlist = x; }));
        const final$ = put$.pipe(concat(attribute$));
        final$.subscribe(
          (data: any) => {
            if (data != undefined) {
              if (data['result'].value != "Field name already exists" && data['result'].value != 'Validations are used in processed documents') {
                // Invoke the save for ROI Marking section depending on the doctypefieldmappingid returned value
                if (data.docFieldMappingId) {
                  this.roiParameters.docTypeFieldMappingID = data.docFieldMappingId;
                  this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
                  this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
                  this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
                  this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
                  if (this.isROIModified == true) { // Added the if check on 08th Feb 2020 to avoid unnecessary save of ROI
                    this.saveRectangle();
                  }
                }
                // end of save ROI Marking
                this.popupVisible = false;
              }
              this.clearAllObjectMode();
            }
            this.getAllTableListwithoutFields(this.selectedDocumentSubtype);
            notify(data['result'].value);
          }, err => { notify('Error while updating Ontology Detail'); }
        );
      }

    }
    else {
      notify("Please fill valid values in error tab");
    }
  }



  activateAdvanceOptions(data) {
    this.isOpened = data;
    if (data === true) {
      this.scrollToBottom();
    }
    else {
      this.scrollToTop();
    }
  }

  public scrollToBottom(): void {

    this.directiveRef.update();
    this.directiveRef.scrollToBottom();
    //  if (this.type === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToBottom();
    // } else if (this.type === 'component' && this.perfectScroll && this.perfectScroll.directiveRef) {
    //   this.perfectScroll.directiveRef.update();
    //   this.perfectScroll.directiveRef.scrollTo(200);
    // } 
    // if (this.type === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToBottom();
    // } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
    //   this.componentRef.directiveRef.update();
    //    this.componentRef.directiveRef.scrollToBottom();
    // }
  }

  public scrollToTop(): void {
    // if (this.type === 'directive' && this.directiveRef) {
    //   this.directiveRef.scrollToRight();
    // } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
    //   this.componentRef.directiveRef.scrollToRight();
    // }
  }

}
