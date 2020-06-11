
import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy, NgModule } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {
    JsonViewModel, ManualHandlingInputModel, ManualHandlingOutputModel, DocumentExtractionDetailModel, DocumentExtractionModel,
    ManualHandlingVModel, FieldRejectionModel, SearchValueJsonModel, DocumentExtractionDetailMultiSuspectModel,
    ExtractedMultiSuspectModel, FieldDetailsViewModel, MultipleSuspectVModel, TableRowjsonModel, ManualHandlingValidationModel,
    FieldValidationInputModel, DocumentName, TableCellValidationModel, SelectedRowCellData, TableExtractionMIReturnData
} from 'src/app/models/manualhandling.module';

import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { map, concat, merge, tap, filter, single, pairwise, timeInterval } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import notify from 'devextreme/ui/notify';
import { parse } from 'querystring';
// added by ashwini -- start
import { DocumentField } from 'src/app/models/documentfield.module';
import { FieldRuleValidation } from 'src/app/models/FieldRuleValidation.module';
import { FieldValidationMapping } from 'src/app/models/FieldValidationMapping.module';
import { FieldRegExpressionMapping } from 'src/app/models/fieldRegExpressionMapping.module';
import { SynonymsDetails } from 'src/app/models/Synonyms.module';
import { DocumentTypeTable } from 'src/app/models/documenttypetable.module';
// added by ashwini -- end

import { DxValidationGroupComponent } from 'devextreme-angular';
import { element } from 'protractor';
import { debug } from 'util';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ROIXmlModel, ROIFieldModel, ROIDetailModel, ROIViewModel, ROIParametersModel } from 'src/app/models/roimarking.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BrowserModule } from '@angular/platform-browser';
import { DxTabPanelModule, DxListComponent } from 'devextreme-angular'; //DxListComponent added on 3-Feb-2020
import {
    DxDataGridComponent,
    DxDataGridModule,
    DxSelectBoxModule
} from 'devextreme-angular';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';
import { NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
// added by ashwini on 6-Jan-2020 -- start
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
    T = 84,
    C = 67,
    V = 86,
    HOME_KEY = 36,
    END_KEY = 35,
    LEFT_ARROW = 37,
    RIGHT_ARROW = 39,
    P = 80,
}
// added by ashwini on 6-Jan-2020 -- end
@Component({
    selector: 'app-quality-check',
    templateUrl: './quality-check.component.html',
    styleUrls: ['./quality-check.component.scss']
})
export class QualityCheckComponent extends ComponentbaseComponent implements OnInit, OnDestroy {
    //;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    IntervalId: NodeJS.Timer;
    // added by ashwini on 6-Jan-2020 -- start
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {


        //ctrl+Alt+F -- Open Field Tab 
        if (event.ctrlKey && event.altKey && (event.keyCode == KEY_CODE.F)) {
            this.activateTabContent("Fields");
            //alert('Open Field Tab')
        }
        //ctrl+Alt+T -- Open Table Tab
        if (event.ctrlKey && event.altKey && (event.keyCode == KEY_CODE.T)) {
            this.activateTabContent("Tables");
            //alert('Open Table Tab')
        }
        //Ctrl+Alt+D > Discard Button
        if (event.ctrlKey && event.altKey && (event.keyCode == KEY_CODE.D)) {
            this.discardChangePopup();
            //alert('Discard Button')
        }
        //Alt+C > Cancel Button
        if (event.altKey && (event.keyCode == KEY_CODE.C)) {
            this.cancelChangePopup();
            //alert('Cancel Button')
        }
        // Alt+V > Forward to Veto Button
        if (event.altKey && (event.keyCode == KEY_CODE.V)) {
            this.forwardChangePopup();
            //alert('Forward to Veto Button')
        }
        // Alt+S > Save Button
        if (event.altKey && (event.keyCode == KEY_CODE.S)) {
            this.SaveDocumentFields();
            //alert('Save Button')
        }
        // Alt+Q > QC Save Button
        if (event.altKey && (event.keyCode == KEY_CODE.Q)) {
            this.qcSavePopup();
            //alert('Save Button')
        }
        // HOME Key > First 
        if ((event.keyCode == KEY_CODE.HOME_KEY)) {
            this.activateButton("First");
            //alert('First')
        }
        // END Key > Last  
        if ((event.keyCode == KEY_CODE.END_KEY)) {
            this.activateButton("Last");
            //alert('Last')
        }
        // LEFT_ARROW > Previous 
        if ((event.keyCode == KEY_CODE.LEFT_ARROW)) {
            this.activateButton("Previous");
            //alert('Previous')
        }
        // RIGHT_ARROW Key > Next 
        if ((event.keyCode == KEY_CODE.RIGHT_ARROW)) {
            this.activateButton("Next");
            //alert('Next')
        }
        // Alt+I > Zoom In
        if (event.altKey && (event.keyCode == KEY_CODE.I)) {
            this.activateButton("Zoom In");
            //alert('Zoom In')
        }
        // Alt+O > Zoom Out
        if (event.altKey && (event.keyCode == KEY_CODE.O)) {
            this.activateButton("Zoom Out");
            //alert('Zoom Out')
        }
        // Alt+P > Fit to Page
        if (event.altKey && (event.keyCode == KEY_CODE.P)) {
            this.activateButton("Fit to page");
            //alert('Fit to Page')
        }
        // Alt+W > Fit to Width
        if (event.altKey && (event.keyCode == KEY_CODE.W)) {
            this.activateButton("Fit to width");
            //alert('Fit to Width')
        }
        // Alt+A > Actual Size
        if (event.altKey && (event.keyCode == KEY_CODE.A)) {
            this.activateButton("Actual size");
            //alert('Actual size')
        }


    }
    // added by ashwini on 6-Jan-2020 -- end
    @ViewChild('valDiscardGroup', { static: false }) valDiscardGroup: DxValidationGroupComponent;
    @ViewChild('valForwardtoVetoGroup', { static: false }) valForwardtoVetoGroup: DxValidationGroupComponent;
    @ViewChild('valQCGroup', { static: false }) valQCGroup: DxValidationGroupComponent;
    @ViewChild('targetFieldGroup', { static: false }) targetFieldGroup: DxValidationGroupComponent;
    @ViewChild('divDocumentFields', { static: false }) divDocumentFields: ElementRef;
    @ViewChild('spnRejectionReason', { static: false }) spnRejectionReason: ElementRef;
    @ViewChild('spnDocumentID', { static: false }) spnDocumentID: ElementRef;
    @ViewChild('valOntology', { static: false }) valOntology: DxValidationGroupComponent; // added on 20-jan-2020
    @ViewChild('vwlist', { static: false }) vwlist: DxListComponent; // added on 3-Feb-2020
    @ViewChild('targetGroup', { static: false }) targetGroup: DxValidationGroupComponent; // added on 3-Feb-2020
    //SLIDER
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];




    documentfieldmodel: DocumentField;
    fieldvalidationmappinglist: any[] = [];
    selectedValidations: any[] = [];
    customRuleValidations: any[] = []; // added by ashwini on 17-Jan-2020
    tempcustomRuleValidations: any[] = [];// custom tab propety declaration 
    selectedExtractValidations: any[] = []; // added by ashwini on 17-Jan-2020
    defaultExtractValidations: any[] = []; // added by ashwini on 17-Jan-2020
    expFieldList: any[] = []; // added by ashwini on 17-Jan-2020
    expFunctionList: any;   // added by ashwini on 17-Jan-2020
    expExpressionList: any; // added by ashwini on 17-Jan-2020
    customValidationEdits: boolean = false; // added by ashwini on 17-Jan-2020
    docTypeTable: DocumentTypeTable; // added by ashwini on 20-Jan-2020
    defaultValidations: any[] = [];
    documentfieldregexlist: any[] = [];
    defaultExpressions: any[] = [];
    selectedExpressions: any[] = [];
    fieldsynonymslstmodel: any[];
    synonymmodel: SynonymsDetails;
    dataF: any;
    fielddatatypelist: any;
    saveValidationArray: any[] = [];
    saveRegExArray: any[] = [];
    customvalidationmapping: any;
    docFieldlist: any;
    selectedDocumentSubtype: any;
    selectedDocumentCategory: any;
    selectedDocumentType: any;
    customValidationTab: any[] = [];
    extractionSequences: any[] = [];
    popuptableTitle: string;
    popupBtnSavetext: string;
    // added by ashwini -- end
    //****End Region Start SME-POPUP */
    roleWiseModuleName = '';//"ManualHandling"; //as per menu permission will be set  
    isDocumentLoaded = false; // Flag to disable the buttons on screen if no document loaded
    objManualHandlingInputModel: ManualHandlingInputModel;
    currentdocumentHeaderID: number;
    documentSubTypeId: number = 0;
    RejectionReason: any;
    DocumentID: number = 0;
    DocumentExtractionDid: number;
    DocumentExtractionId: number;
    DocumentTypeFieldMappingId: number;
    TableRowjsonModel: TableRowjsonModel[];
    DocumentExtractionDetailModel: DocumentExtractionDetailModel;
    gridFieldsModelData: any[];
    currentDocumentExtractionData: DocumentExtractionModel;

    dataJson: any[];
    // LEADTOOLS document viewer object
    documentViewerMH;
    // Automation control object that works with LEADTOOLS ImageViewer
    automationControlMH;
    // LEADTOOLS Annotations.Automation.AnnAutomation
    automationMH;
    // LEADTOOLS automationMH manager
    managerMH;
    private _operationHandler: lt.Document.Viewer.DocumentViewerOperationEventHandler;

    lstDocumentExtractionDetailModel: any[];
    lstDocumentExtractionDetailModelDropDown: any[]; // added by drop down Success and Rejected
    lstDocumentExtractionDetailModelTemp: any[]; // added by drop down Success and Rejected     
    lsCount: number = 0;  // added by ashwini to get list count
    lstPermissionTypeForUser: any[];
    PermissionRight: string = '';
    objMultipleSuspectVModel: MultipleSuspectVModel
    gridtableData: any[] = [];
    tableheadingIndex: number = 0;
    tableTab: any[];
    gridTableHeading: any[] = [];
    qualitytabledata: JsonViewModel;
    tableSequenceHeadinglist: any[] = [];
    lstManualHandlingVModel: ManualHandlingVModel;
    tablesquencearray: any[];

    openQcRemarksPopup = false;
    qcRemarks: string = '';
    lstSaveDocumentExtractionDetailModel: DocumentExtractionDetailModel[];
    vetoRemarks: string = '';
    discardRemarks: string = '';
    isManualHandlingScreen = false;
    isQualityCheckScreen = false;
    isVetoScreen = false;
    documentPhysicalPath: string = '';

    //Sandeep K
    docfieldValidation: FieldRuleValidation;
    //End    
    alltableSequence: any[] = [];
    Tablequalitydata: any[];
    TableDataPush: any[] = [];
    returnDataModel: DocumentExtractionDetailModel[] = [];
    sequenceNum: number = 0;

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
    //Sandeep K
    CurrentPageNumber: any;
    DocumentSubTypeID: any;
    DocumentFieldMappingId: any;
    DocumentFieldId: any;
    //End Sandeep K
    private _operationHandlerROI: lt.Document.Viewer.DocumentViewerOperationEventHandler;
    isROIModified: boolean = false; // added on 08th Feb 2020
    // End of ROI Marking region
    //isCapturedData = false;
    previousUrl: string;
    isUserRedirected: boolean = false;
    redirectedDocumentHeaderID: number = 0;
    caretPos = 1; //added on 28-Jan-2020
    selectedtype: any; //added on 28-Jan-2020
    synonymstaberror: boolean = false; // added on 28-Jan-2020
    customstaberror: boolean = false; // added on 28-Jan-2020
    validationstaberror: boolean = false; // added on 28-Jan-2020
    regularExpressiontaberror: boolean = false; // added on 28-Jan-2020
    extractionSequencetaberror: boolean = false; // added on 28-Jan-2020
    roitaberror: boolean = false; // added on 28-Jan-2020
    defaultDropdownSelectedValue: any[] = [];//number; //bind default dropdown value
    objDocumentName: DocumentName;
    currentSelectedDocumentExtractionDid: any = 0; // Added on 03 Feb 2020 - to display only associated validation rules methods for multiple suspects

    IsForwardtoVetoOption: any; // added on 14-Feb-2020
    IscheckForwardtoVetoOption = false; // added on 14-Feb-2020
    IsShowHidePopUpProfileSetting = true; // added on 20-Feb-2020 -- TBD => hardcoded right now, Implementation -> Show/Hide field validation pop-over on MI screen
    lstTableCellValidationModel: TableCellValidationModel[] = []; //added on 15 Feb20
    lstSelectedRowCellData: SelectedRowCellData[] = []; //added on 20 Feb 20
    currPageNumber: string = ''; // added on 21-Feb-2020 
    TotpageCount: string = ''; // added on 21-Feb-2020
    // to be used to set the cursor position to the  first character with confidence level less than this value
    LowestCharacterConfidenceToSetInTextField: number = 7; // added on 22nd Feb 2020 - TBD => hardcoded right now, to be fetched from configuration setting.

    focusedRowKey: number = 0;
    ispageNo = false; // added on 26-Feb-2020 - Do not show page numbers when there are no documents for processing
    clickedLabelId = 0; // Added on 28th Feb 2020 - To be used for passing the HTML element ID to be used to set cursor of the newly captured text on the fly
    chkmsg: string = '';
    contmsg: string = '';
    alertmessage: any = false;
    //----------------------declare global variable


    constructor(private elRef: ElementRef, private router: Router, private service: DataService, private route: ActivatedRoute, private message: MessageService) {
        super('Manual Handling', 'Manualintervantions', message, service, environment.apiBaseUrl);
        //-----------------------Get Previous URL
        setTimeout(() => {
            this.router.events
                .subscribe((event) => {
                    if (event instanceof NavigationStart) {
                        localStorage.setItem("PreviousUrl", this.router.url);
                        this.previousUrl = this.router.url;
                    }
                });
        }, 2000);
        this.ClearIconClick = this.ClearIconClick.bind(this); // Added on 21st Feb 2020 for table clear column click
        //-----------------------
        this.addField();
        this.onReorder = this.onReorder.bind(this); // added by ashwini on 17-Jan-2020
        this.fieldsynonymslstmodel = []; // added by ashwini on 17-Jan-2020        
        this.synonymmodel = this.initDocumentSynonymsModel();
        this.fieldDataTypeValue$().subscribe(data => { this.fielddatatypelist = data; });

        this.validateFieldMandatoryFieldValue = this.validateFieldMandatoryFieldValue.bind(this);
        this.validateValidationMandatoryFieldValue = this.validateValidationMandatoryFieldValue.bind(this);
        this.validateextractionMandatoryFieldValue = this.validateextractionMandatoryFieldValue.bind(this);
        this.validateDescriptionCustomRuleEditorPopup = this.validateDescriptionCustomRuleEditorPopup.bind(this);
        this.validateNameCustomRuleEditorPopup = this.validateNameCustomRuleEditorPopup.bind(this);

        // added by ashwini -- end
        //Sandeep K region start
        this.docfieldValidation = this.initDocumentFieldRuleModel();
        this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
        this.docTypeTable = this.initDocumentTypeTableModel(); // added by ashwini on 20-Jan-2020 
        //Sandeep K region end        
        // initialise the roi parameter object model
        this.roiParameters = this.initRoiParameterModel();
    }

    ngOnInit() {
        this.docfieldValidation = this.initDocumentFieldRuleModel();
        this.roleWiseModuleName = this.setModuleNameHeading().trim().replace(" ", "");
        this.ForwardtoVetoOption(); // added on 14-Feb-2020
        this.controlRoleSpecificButtonVisibility();
        this.readDataForDisplayModule();
        this.fieldDataTypeValue$().subscribe(data => { this.fielddatatypelist = data; });
    }
    ngAfterViewInit() {
        this.autoSaveContent();
    }

    private autoSaveContent() {
        this.IntervalId = setInterval(() => {
            this.AutoSavefillData()
        }, 60000);

    }

    qualityCheckTabs = [
        'Fields', 'Tables'
    ]

    priorities = [
        "All",
        "Successful",
        "Rejected"
    ];

    // Show the tab content on click
    showTabContentQC: string = this.qualityCheckTabs[0];
    showTabContent: string = this.qualityCheckTabs[0]; // added on 20-Jan-2020, modified on 12th Feb 2020
    activateTabContent(data) {
        // Added on 29th Feb 2020 - Clear the highlight and magnified image object on tab switch
        try {
            if (this.documentViewerMH != null && this.documentViewerMH != undefined) {
                var magnifyMode = <lt.Controls.ImageViewerSpyGlassInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.spyGlassModeId);
                if (magnifyMode != null && magnifyMode != undefined) {
                    magnifyMode.manualStop();
                }
            }
            //clear previous selected text
            this.automationMH.container.children.clear();
            this.documentViewerMH.text.clearSelection(0);
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
        }
        catch{ }
        // end of code - 29th Feb 2020

        // After 100 milliseconds, call "onSizeChanged" to recalculate the viewer internals - added on 13th Feb 2020
        if (this.documentViewerMH != null) {
            setTimeout(() => {
                this.documentViewerMH.view.imageViewer.onSizeChanged();
            }, 100);
        }
        this.showTabContent = data; // added on 20-Jan-2020
        this.fieldAnimationOptionsVisible = 0;//Reset value of text visibility
        this.togglePopupWindowDropdown = 0;//Reset value of dropdown visibility
        this.currentSelectedDocumentExtractionDid = 0;
        this.showTabContentQC = data;
        if (this.showTabContentQC == this.qualityCheckTabs[0]) {
            this.isTableShown = true;
            this.gridtableData = [];
            this.fieldTableAnimationOptionsVisible = 0; //if table and field tab switch then rest popup visisbility
        }
        else {
            this.isTableShown = false;
            try {
                //show 1st table data and 1st row data on click on table tab
                this.showTableDetails(this.tabulatedFieldList[0], this.tabulatedFieldList[0].tablename, 0)
            }
            catch{

            }

        }
    }
    //#region Sandeep K region start
    initDocumentFieldRuleModel() {
        return new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '','','');
    }
    initFieldValidationMapping() {
        return new FieldValidationMapping(0, 0, 0, false, null, '', false, 0, 0, true);
    }
    initDocumentFieldModel() {
        return new DocumentField(0, 0, 0, 0, '', '', 0, 1, '', false, 0, 1, 0, null, null, null, 0, '', '', false, 1.00,'',0,0,0,0,0,0,false,false,0,0,0,0,1,100);
    }

    initDocumentRegExpressionModel() {
        return new FieldRegExpressionMapping(0, 0, 0, null, false, false);
    }


    operatorSymbol = [
        'AND', 'OR', '=', '==', '<', '<=', '>=', '>>', '|', '(', ')', '[', ']'
    ]

    fieldCategorySettings = [
        'Synonyms', 'Validations', 'Custom', 'Regular Expression', 'Extraction Sequence', 'ROI'
    ]


    //#region New Table  Fileds ontology Wise 
    tabulatedFieldList: any;
    newcolumns: any[] = [];
    TableFileds: any;
    tableQualityChecks: any[] = [];
    Ontolgyto_ExtractionModel: any[] = [];
    tableLength: number;
    ExtractionTable: any[] = [];
    identify = 0;
    finaldta: any[] = [];
    index = 0;
    qualityCheck: any[] = [];
    TempArray = [];
    tblExtraction = [];
    tblOntology = [];
    tblSource: string;
    outPutArray = [];
    columnName = [];
    IsFirstTimeData: boolean;
    max: number;
    TableExtractionData: any;
    TableDataForClear: any;
    TableExtractionMIData: TableExtractionMIReturnData[] = [];
    isFromExtraction: Boolean = false; // Added on 25th Feb 2020 for checking if the  extraction is invoked for click and capture and bind data accordingly

    TableROIDetails = [];

    // TableROIDetails = [
    //     { 'DocTypeFieldMappingID': 11, 'PageNumber': 1, 'DocumentHeaderId': 5972, 'TableSequence': 4, 'DocumentSubTypeId': 5, 'boundingBox': { 'CoordinateXO': 293, 'CoordinateX1': 1115, 'CoordinateY0': 810, 'CoordinateY1': 904 } },
    //     //{ 'DocTypeFieldMappingID': 5447, 'PageNumber': 1, 'DocumentHeaderId': 50496, 'TableSequence': 1, 'boundingBox': { 'CoordinateXO': 1140, 'CoordinateX1': 1321, 'CoordinateY0': 817, 'CoordinateY1': 907 } },
    //     { 'DocTypeFieldMappingID': 12, 'PageNumber': 1, 'DocumentHeaderId': 5972, 'TableSequence': 4, 'DocumentSubTypeId': 5, 'boundingBox': { 'CoordinateXO': 1446, 'CoordinateX1': 1628, 'CoordinateY0': 823, 'CoordinateY1': 907 } },
    //     { 'DocTypeFieldMappingID': 13, 'PageNumber': 1, 'DocumentHeaderId': 5972, 'TableSequence': 4, 'DocumentSubTypeId': 5, 'boundingBox': { 'CoordinateXO': 1628, 'CoordinateX1': 1815, 'CoordinateY0': 820, 'CoordinateY1': 914 } },
    //     { 'DocTypeFieldMappingID': 14, 'PageNumber': 1, 'DocumentHeaderId': 5972, 'TableSequence': 4, 'DocumentSubTypeId': 5, 'boundingBox': { 'CoordinateXO': 2015, 'CoordinateX1': 2287, 'CoordinateY0': 829, 'CoordinateY1': 914 } }];

    formsearchTablefilterDto() {

        return {
            DocumentCategoryId: 0, //this.docSubTypeModel.docCategoryId,
            DocumentTypeId: 0,//this.docSubTypeModel.documentTypeId,
            DocumentSubTypeId: this.documentSubTypeId,//39
            LanguageId: 0,
            FilterbyId: 0,
            Filtervalue: '',
            DocCategoryName: 0,//this.docSubTypeModel.docCategoryName,
            DocumentTypeName: 0,//this.docSubTypeModel.documentTypeName,
            DocumentSubTypeName: 0// this.docSubTypeModel.name
        };

    }
    //base on parameter get field list 
    //bind all respective model data like synonyms and other

    //tableFieldOntology: FieldDetailsViewModel;
    GetExtractionTableDetails() {

        this.GetTableSequqnce(this.currentdocumentHeaderID, this.documentSubTypeId).subscribe(data => {
            this.lstManualHandlingVModel = data;
            this.gridFieldsModelData = data.lstDocumentExtractionDetailModel;
            this.tableTab = this.lstManualHandlingVModel.lstDocumentExtractionDetailModel.filter(item => item.isTabularField == true && item.tableSequence != null && item.tableSequence != 0);
            this.tblExtraction = data.lsttableDefination;
            this.GetOntologyTableDetails();
            // removed the if-else condition as GetOntologyTableDetails() needs to be called for Table field ontology
            // if (this.tableTab.length > 0) {               
            // this.GetOntologyTableDetails();
            // } else {
            //     // Commented on 13th Feb 2020 - because if table field is not defined, there is no need to invoke and bind the ontolgoy definition for table
            //     //this.GetOntologyTableDetails();           
            // }
            this.TempArray = [];
        });
    }

    //Get table extraction  data sequence wise
    GetTableSequqnce(documentHeaderID, documentSubTypeId) {
        //documentHeaderID = 30;
        // documentSubTypeId = 4157;
        const server$ = this.service.getSingle('ManualHandlingApi/GetTableSequence?documentHeaderID=' + documentHeaderID + '&moduleName=' + this.roleWiseModuleName
            + "&documentSubTypeId=" + documentSubTypeId).
            pipe(map((data: any) => {
                //console.log(data); 
                return data
            }));
        return server$;
    }

    tblColumnValidationOntology: any[]; //added for table column ontology for empty table 
    CleartblOntology: any[];


    //get table ontology of perticular subtype
    GetOntologyTableDetails() {
        const sendPrm = this.formsearchTablefilterDto();
        this.getTablefieldlist$(sendPrm).subscribe(data => {
            this.docFieldlist = data;
            this.tblOntology = data.lsttableDefination;
            debugger;
            const newontology = JSON.parse(JSON.stringify(this.tblOntology));
            this.CleartblOntology = JSON.parse(JSON.stringify(this.tblOntology));
            console.log(this.CleartblOntology);
            this.tblColumnValidationOntology = data.lstColumnOntologyDetail; //added by sheetal
            this.OntologyTableDetailInGroup(data.lsttbleOntology);
            this.ExtraionDetailTableDataInGroups();
            // Added on 13th Feb 2020 - to hide the Table Tab when table is not defined in ontology
            if (this.tblOntology == null) {
                this.qualityCheckTabs.pop();
            }
            // End of code added on 13th Feb 2020
        });
    }
    //table ontology sorting using table name wise
    OntologyTableDetailInGroup(data) {
        var groups = data.filter(l => l.isTabularField == true).sort((a, b) => { return a.tableSequence < b.tableSequence ? -1 : 1; }).reduce(function (obj, item) {
            obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence]
                = obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence] || [];
            obj['TableSequence ' + item.documentTypeTableName != null ? item.documentTypeTableName : item.tableSequence].push(
                {
                    docTypeFieldMappingId: item.id, documentTypeFieldId: item.documentFieldID, documentTypeID: item.documentTypeID, documentSubTypeID: item.documentSubTypeID,
                    fieldName: item.fieldName,
                    fieldDataTypeID: item.fieldDataTypeID, isMandatory: item.isMandatory, fieldDataType: item.fieldDataType,
                    fielddescription: item.fielddescription,
                    isTabularField: item.isTabularField, fieldSequence: item.fieldSequence, isAnchor: item.isAnchor,
                    documentTypeTableId: item.documentTypeTableId, documentTypeTableName: item.documentTypeTableName
                    , documentTypeTableDesc: item.documentTypeTableDesc, isActive: item.isActive, tableSequence: item.tableSequence
                }
            );
            return obj;
        }, {});
        this.tabulatedFieldList = Object.keys(groups).map(function (key) {
            return {
                table: key, fields: groups[key], id: groups[key][0].documentTypeTableId, name: groups[key][0].documentTypeTableName,
                description: groups[key][0].documentTypeTableDesc, documentSubTypeID: groups[key][0].documentSubTypeID, tableSequence: groups[key][0].tableSequence
            };
        });

        this.AddTabularFieldOntologyDetailsLikeValidationROI();
    }

    //added on 8 Feb 20 //get table field ontology details for display
    AddTabularFieldOntologyDetailsLikeValidationROI() {
        try {
            var processTabulatedFieldList: any[] = this.tabulatedFieldList;
            for (let cln of processTabulatedFieldList) {
                for (let fild of cln.fields) {

                    if (this.lstManualHandlingVModel.lstDocumentExtractionDetailModel === undefined && this.lstManualHandlingVModel.lstDocumentExtractionDetailModel.length != 0) {

                        var fieldItemDetail = this.lstManualHandlingVModel.lstDocumentExtractionDetailModel.filter(x => x.docTypeFieldMappingId == fild.docTypeFieldMappingId);

                        const result = this.fomrModelConvert(cln.table, fild, this.identify, fieldItemDetail.objFieldDetailsViewModel);

                        fild.objFieldDetailsViewModel = fieldItemDetail[0].objFieldDetailsViewModel;
                    }

                    //added else to bind validtaion model for table column which is not saved into DB
                    else {

                        if (this.tblColumnValidationOntology.length > 0) {

                            var objColumnValidationOntology = this.tblColumnValidationOntology.filter(x => x.docTypeFieldMappingID == fild.docTypeFieldMappingId)[0];

                            const result = this.fomrModelConvert(cln.table, fild, this.identify, objColumnValidationOntology.objFieldDetailsViewModel);

                            fild.objFieldDetailsViewModel = objColumnValidationOntology.objFieldDetailsViewModel;
                        }
                    }

                }
            }
            this.tabulatedFieldList = processTabulatedFieldList;
        }
        catch{
            console.log("Error in AddFieldValidationToTabularFields");
        }
    }

    //this method call while ontology table clicks
    showTableDetails(data, tablename, index) {
        debugger;
        {
            //this.TempArray = []; //commented on 24 Feb 2020
            const OntolgyTableSequence = data.tableSequence;
            const result = this.ExtractionTable.filter(x => x.tableSequence == OntolgyTableSequence);

            //---------------------to resolved table field display issue
            if (result.length > 0)
                var documentExtractionId = result[0].fields[0].documentExtractionDid
            this.TableDataForClear = data;
            //-------------------end to resolved table field display issue
            const TableDataExist = this.tblExtraction.filter(x => x.tableSequence == OntolgyTableSequence);

            // Added if isFromExtraction condition on 25th Feb 2020 - for click and capture table using ROI on the fly
            // if ((result.length > 0 && documentExtractionId != 0 && TableDataExist[0].tableData != "[]") || (this.isFromExtraction == true ||  TableDataExist[0].tblSource == 'Extraction' && TableDataExist[0].tableData != "[]")) {
            if ((result.length > 0 && documentExtractionId != 0 && TableDataExist[0].tableData != "[]") || this.isFromExtraction == true) {
                this.tableLength = this.tableTab.length;
                this.sequenceNum = OntolgyTableSequence;
                this.tblSource = 'Extraction'
                const dataExtraction = this.tblExtraction.filter(x => x.tableSequence == OntolgyTableSequence);

                this.TempArray = JSON.parse(dataExtraction[0].tableData); //JSON.parse(this.tblExtraction[OntolgyTableSequence].tableData);
                this.columnName = Object.keys(JSON.parse(dataExtraction[0].tableData)[0]);
                // if (this.columnName.includes('__KEY__')) {
                this.columnName = this.columnName.filter(item => item !== '__KEY__');
                this.columnName = this.columnName.filter(item => item !== 'RowNumber');
                this.columnName = this.columnName.filter(item => item !== 'RowValidation');
                // }
                this.TableFileds = data.fields;
                this.isTableShown = false;
                this.isShown = !this.isShown;
                this.title = data.table;
                this.isFromExtraction = false; // added on 25th Feb 2020 to reset the flag
            }
            else if (result.length > 0 && documentExtractionId == 0 && TableDataExist[0].tableData != "[]" && this.isFromExtraction == false) {
                this.tableLength = this.tableTab.length;
                this.sequenceNum = OntolgyTableSequence;
                this.tblSource = 'Extraction'
                const dataExtraction = this.tblExtraction.filter(x => x.tableSequence == OntolgyTableSequence);

                this.TempArray = JSON.parse(dataExtraction[0].tableData); //JSON.parse(this.tblExtraction[OntolgyTableSequence].tableData);
                this.columnName = Object.keys(JSON.parse(dataExtraction[0].tableData)[0]);
                // if (this.columnName.includes('__KEY__')) {
                this.columnName = this.columnName.filter(item => item !== '__KEY__');
                this.columnName = this.columnName.filter(item => item !== 'RowNumber');
                this.columnName = this.columnName.filter(item => item !== 'RowValidation');
                // }
                this.TableFileds = data.fields;
                this.isTableShown = false;
                this.isShown = !this.isShown;
                this.title = data.table;
            }
            else {
                this.tableLength = 0;
                this.sequenceNum = OntolgyTableSequence;
                this.tblSource = 'Ontology'
                const dataOntology = this.tblOntology.filter(x => x.tableSequence == OntolgyTableSequence);
                this.TempArray = JSON.parse(dataOntology[0].tableData);
                this.columnName = Object.keys(JSON.parse(dataOntology[0].tableData)[0]);
                // if (this.columnName.includes('__KEY__')) {
                this.columnName = this.columnName.filter(item => item !== '__KEY__');
                this.columnName = this.columnName.filter(item => item !== 'RowNumber');
                this.columnName = this.columnName.filter(item => item !== 'RowValidation');
                // }

                // if (this.TempArray.length > 1) { 
                if (this.TempArray.length > 0) {
                    this.IsFirstTimeData = false;
                }
                else {
                    this.TempArray = [];
                }
                //console.log(this.columnName);
                // this.TempArray=[];
                //this.TempArray=JSON.parse(this.tblOntology[OntolgyTableSequence].tableData);
                this.TableFileds = data.fields;
                this.isTableShown = false;
                this.isShown = !this.isShown;
                this.title = data.table;
            }

            //added on 20 Dec 20
            if (this.TempArray.length > 0) {
                var rowNumberToDisplay = this.TempArray[0].RowNumber;
                if(rowNumberToDisplay==0)
                rowNumberToDisplay=1
                this.GetSelectedRowCellData(this.columnName, this.TempArray, rowNumberToDisplay, this.TableFileds);
            }
            else {
                this.ClearTable(data);
                this.GetSelectedRowCellData(this.columnName, this.TempArray, 1, this.TableFileds);
            }



            //this.GetSelectedRowCellData(this.columnName, this.TempArray, 1, this.TableFileds);
            //used for index
            // this.GetSelectedRowCellData(this.columnName, this.TempArray, 0, this.TableFileds);

            // // Added for save validtaion model
            // this.TempArray.forEach(rowelement => {
            //     this.CreateTableCellValidationModel(rowelement.RowNumber, 0, 0, 0, '', '', this.sequenceNum);
            // }
            // );

        }
    }
    TableMark($data) {
        debugger
        this.TableROIDetails = [];
        this.tableRubberBandInteractiveMode($data.tableSequence, $data.fields);
        this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand, this.documentViewerMH.currentPageNumber);
    }
    ExtractTable($data) {

        if ($data.table == this.TableDataForClear.table) {
            if (this.TableExtractionMIData != undefined) {

                const result = this.TableExtractionMIData.filter(x => x.tableSequence == $data.tableSequence);
                if (result.length > 0) {
                    for (let index = 0; index < this.TableExtractionMIData.length; index++) {
                        if (this.TableExtractionMIData[index].tableSequence == $data.tableSequence) {
                            this.TableExtractionMIData.splice(index, 1);
                        }
                    }
                }
            }
            var that = this;
            this.TableExtractionMI(this.TableROIDetails).subscribe(data => {

                if (data.tableExtractSortedJson != "[]" && data.tableSequence == $data.tableSequence) {
                    that.TableExtractionMIData.push(data); //add extracted data in TableExtractionMIData
                    const result_tblExtra = that.tblExtraction.filter(x => x.tableSequence == $data.tableSequence);

                    if (result_tblExtra.length > 0) {
                        that.tblExtraction.forEach(X => {
                            if (X.tableSequence == $data.tableSequence) {
                                X.tableData = data.tableExtractSortedJson;
                                if (X.tableData != "[]") {
                                    that.isFromExtraction = true; // set flag to true for extraction on the fly using click and capture
                                } else {
                                    //notify('Table not extract');
                                    // Added on 29-Feb-2020 - message style/toast -- start
                                    //var that=this;
                                    var contmsgVal="Table not extract";
                                    that.displayAlertmessage("F",contmsgVal);
                                    //Added on 29-Feb-2020 - message style/toast -- end 
                                }
                            }
                        });
                    }
                    else {
                        that.tblOntology.forEach(X => {
                            if (X.tableSequence == $data.tableSequence) {
                                X.tableData = data.tableExtractSortedJson;
                                if (X.tableData != "[]") {
                                    that.isFromExtraction = true; // set flag to true for extraction on the fly using click and capture
                                } else {
                                    this.isFromExtraction = false
                                    //notify('Table not extract');
                                    // Added on 29-Feb-2020 - message style/toast -- start
                                    var contmsgVal="Table not extract";
                                    that.displayAlertmessage("F",contmsgVal);
                                    //Added on 29-Feb-2020 - message style/toast -- end 
                                }
                            }
                        });
                    }
                }
                //that.TempArray = data.tableExtractSortedJson;
                // Added on 25th Feb 2020 for testing
                that.showTableDetails($data, $data.table, 0)
            });
            this.documentViewerMH.view.imageViewer.interactiveModes.clear();
        }else
        {
            //notify('Please click against matching table');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Please click against matching table";
            that.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        } 
    }

    //if table details present in extractiondetail then sorting tablesequnce in group
    //filed sorting under table
    ExtraionDetailTableDataInGroups() {

        var groupstable = this.tableTab.filter(l => l.isTabularField == true).sort((a, b) => { return a.tableSequence < b.tableSequence ? -1 : 1; }).reduce(function (obj, item) {
            obj['TableSequence ' + item.tableSequence != null ? item.tableSequence : item.tableSequence]
                = obj['TableSequence ' + item.tableSequence != null ? item.tableSequence : item.tableSequence] || [];
            obj['TableSequence ' + item.tableSequence != null ? item.tableSequence : item.tableSequence].push(
                {
                    documentExtractionDid: item.documentExtractionDid,
                    documentExtractionId: item.documentExtractionId,
                    docTypeFieldMappingId: item.docTypeFieldMappingId,
                    fieldValue: item.fieldValue,
                    searchedWords: item.searchedWords,
                    documentTypeFieldId: item.documentTypeFieldId,
                    fieldName: item.fieldName,
                    isMandatory: item.isMandatory,
                    isTabularField: item.isTabularField,
                    fieldSequence: item.fieldSequence,
                    tableSequence: item.tableSequence
                }
            );
            return obj;
        }, {});
        this.ExtractionTable = Object.keys(groupstable).map(function (key) {
            return {
                table: key, fields: groupstable[key], tableSequence: groupstable[key][0].tableSequence
            };
        });
    }

    //Ontology to Extraction Model if Extraction model is empty Convert 
    fomrModelConvert(tablename, Modeldata, identify, objFieldDetailsViewModel) {

        return {
            'documentExtractionDid': Modeldata.documentExtractionDid,
            'documentExtractionId': Modeldata.documentExtractionId,
            'docTypeFieldMappingId': Modeldata.docTypeFieldMappingId,
            'fieldValue': Modeldata.fieldValue,
            'searchedWords': '',
            'documentTypeFieldId': Modeldata.documentTypeFieldId,
            'fieldName': Modeldata.fieldName,
            'isMandatory': Modeldata.isMandatory,
            'isTabularField': Modeldata.isTabularField,
            'fieldSequence': Modeldata.fieldSequence,
            'tableSequence': Modeldata.tableSequence,
            'table': tablename,
            'objFieldDetailsViewModel': objFieldDetailsViewModel//added for ontology data
        }

    }

    //if Extraction Table is Empty then work with the help of ontology model
    OntologyModelSort(tabulatedFieldList: any) {
        for (let cln of tabulatedFieldList) {
            for (let fild of cln.fields) {
                const result = this.fomrModelConvert(cln.table, fild, this.identify, '');
                this.tableQualityChecks.push(result);
                this.newcolumns.push(fild.fieldName);
            }
            this.alltableSequence.push({ Heading: this.newcolumns, Rows: this.qualityCheck });
            this.Ontolgyto_ExtractionModel.push(this.tableQualityChecks);
            this.newcolumns = [];
            this.tableQualityChecks = [];
            this.qualityCheck = [];
        }
    }

    //Extraction model is not empty then sort in this function 
    ExtractionTableFiledSort(ExtractionData: any) {
        for (let cln of ExtractionData) {
            for (let fild of cln.fields) {
                const result = this.fomrModelConvert(cln.table, fild, this.identify, '');
                this.tableQualityChecks.push(result);
                this.newcolumns.push(fild.fieldName);
            }
            this.alltableSequence.push({ Heading: this.newcolumns, Rows: this.tableQualityChecks });
            //   this.Ontolgyto_ExtractionModel.push(this.tableQualityChecks);
            this.newcolumns = [];
            this.tableQualityChecks = [];
            this.qualityCheck = []
        }
    }

    getMax(arr, prop) {
        this.max = 0;

        if (arr.length == 1) {
            return 1;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].hasOwnProperty(prop)) {
                var count = arr[i][prop];
                if (count == '' || count == 'undefined') {
                    count = 0;
                }
                if (parseInt(count) > this.max)
                    this.max = count;
            }

        }
        return this.max + 1;
    }

    //this method call on grid opration like insert and update and delete 

    logEvent(e, FiledRowsValue: any, action) {


        if (action == 'Insert') {
            for (var i = 0; i < this.columnName.length; i++) {
                if (!e.data.hasOwnProperty(this.columnName[i])) {

                    e.data[this.columnName[i]] = '';

                }
            }
            if (!e.data.hasOwnProperty('RowNumber')) {
                // e.data['RowNumber'] = this.getMax(FiledRowsValue, 'RowNumber');  
                var rownum = this.getMax(FiledRowsValue, 'RowNumber');
                e.data['RowNumber'] = rownum;

                //this.CreateTableCellValidationModel(rownum, 0, 0, 0, '', '');//create rownumber for validation
            }
            if (!e.data.hasOwnProperty('RowValidation')) {
                e.data['RowValidation'] = "T";
            }
        }

        if (action == 'Delete') {

            //if deleted record is selected in textbox then clear the textbox and set max rownumber
            let deletedRow = this.lstSelectedRowCellData.filter(x => x.rowNumber == e.data.RowNumber);
            //this.currentTableMaxRow =this.currentTableMaxRow -1;
            if (deletedRow != null) {
                if (this.TempArray.length != 0) {
                    var rowNumberToDisplay = this.TempArray[0].RowNumber;
                    // this.GetSelectedRowCellData(this.columnName, this.TempArray, 0, this.TableFileds); //used for index
                    this.GetSelectedRowCellData(this.columnName, this.TempArray, rowNumberToDisplay, this.TableFileds);


                    // to mainatain table wise validation status
                    this.tblExtraction.forEach(element => {
                        if (element.tableSequence == this.sequenceNum) {
                            element.tableData = JSON.stringify(this.TempArray);
                        }
                    });
                }
                else {
                    this.addNewRowData();
                }
            }
            return;
        }

        //this.alltableSequence[this.sequenceNum].Rows = FiledRowsValue;

        if (this.tblSource == 'Extraction') {

            const result = this.tblExtraction.filter(x => x.tableSequence == this.sequenceNum)[0];
            result.tableData = JSON.stringify(FiledRowsValue);
            this.tblExtraction[this.tblExtraction.indexOf(result)] = result;
            //notify('Row data Added successfully');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Row data Added successfully";
                this.displayAlertmessage("S",contmsgVal); 
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
        else {

            const result = this.tblOntology.filter(x => x.tableSequence == this.sequenceNum)[0];
            result.tableData = JSON.stringify(FiledRowsValue);
            this.tblOntology[this.tblOntology.indexOf(result)] = result;

            //notify('Row data Added successfully');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Row data Added successfully";
                this.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 

        }
    }
    //Clear Tabel Row
    // private static isChief(position) {
    //     return position && ["CEO", "CMO"].indexOf(position.trim().toUpperCase()) >= 0;
    // };
    // isCloneIconVisible(e) {
    //     debugger;
    //     return !e.row.isEditing && !QualityCheckComponent.isChief(e.row.data.Position);
    // }
    ClearIconClick(e) {
        //debugger;
        var clonedItem = Object.assign({}, e.row.data);
        const result = Object.keys(clonedItem);
        this.TempArray.forEach(x => x.RowNumber == clonedItem.RowNumber)
        this.TempArray.forEach(X => {
            if (X.RowNumber === clonedItem.RowNumber) {

                for (let item of result) {

                    if (item === "RowNumber") {

                    } else {
                        X[item] = "";
                    }

                }
            }
        });

        //-------------------added by sheetal

        let clearRow = this.lstSelectedRowCellData.filter(x => x.rowNumber == clonedItem.RowNumber);
        if (clearRow.length != 0) {
            this.lstSelectedRowCellData.forEach(element => {
                element.fieldValue = '';
                element.overAllValidationStatus = 1;
            });
        }

        e.row.values = [];
        e.row = [];


    }

    // //Clear Table All
    ClearTable(CurrentTable) {

        if (CurrentTable.table == this.TableDataForClear.table) {
            const result = this.TableDataForClear;
            this.tblExtraction.forEach(X => {
                if (X.tableSequence == this.TableDataForClear.tableSequence) {
                    X.tableData = "[]";// 
                }
            });
            debugger;
            this.tblOntology.forEach(X => {
                if (X.tableSequence == this.TableDataForClear.tableSequence) {
                    X.tableData = "[]";//
                    const results = this.CleartblOntology.filter(x => x.tableSequence == this.TableDataForClear.tableSequence);
                    X.tableData = results[0].tableData;
                }
            });

            this.TempArray = [];

            //------------ added by sheetal to reset value on clear     
            this.currentTableMaxRow = 0;
            this.currentTableRow = 0;
            this.addNewRowData();


            // clear validtaion model for clear table
            this.lstTableCellValidationModel = this.lstTableCellValidationModel.filter(x => x.tableSequence != this.TableDataForClear.tableSequence);
        }
        else {
            //notify('Please click against matching table');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Please click against matching table";
                this.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
    }

    // ClearTable() {
    //     debugger;
    //    // const result = this.TableDataForClear;
    //     this.tblExtraction.forEach(X => {
    //         if (X.tableSequence == 1) {
    //             X.tableData =this.tblOntology[1-1].tableData;//"[]"; 
    //         }
    //     });

    //     this.TempArray = [];      
    // }



    //get table data and create dynamic property of page load and sort out data 
    //depending ontology and extraction base
    getTablefieldlist$(sendPrm) {
        return this.service.postAll('ManualHandlingApi/getTablefieldlist', sendPrm).
            pipe(map((data: any) => {
                return data;
            }));
    }

    //data create in  format in model for saveTable api call
    fomrSaveModel(lstManualHandlingVModel, docFieldlist,isForwarded) {
        return {
            '_ManualHandlingVModel': lstManualHandlingVModel,
            '_TableOntology': docFieldlist,
            '_tableDefinationOntology': this.tblOntology,
            '_tableDefinationExtraction': this.tblExtraction,
            'isForwarded':isForwarded //added on 29 Fen 2020
        }
    }

    //save table data in this method
    TableSave() {
        //debugger;
        if (this.tblOntology != null)  //if table is defined in ontology then only save Table api call 
        {
            const values = this.fomrSaveModel(this.lstManualHandlingVModel, this.docFieldlist,false)
            this.outPutArray.push(this.lstManualHandlingVModel);
            this.outPutArray.push(this.docFieldlist);
            const post$ = this.service.postAll('ManualHandlingApi/SaveTable', values);
            post$.subscribe(
                data => {
                    this.tableQualityChecks = [];
                    //notify(data['result'].value);
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal=data['result'].value;
                    this.displayAlertmessage("S",contmsgVal);
                    //Added on 29-Feb-2020 - message style/toast -- end 
                //}, err => { notify('Error TableSave'); } // commented on 29-Feb-2020
            }, err => { 
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Error TableSave";
                    this.displayAlertmessage("S",contmsgVal);
                //Added on 29-Feb-2020 - message style/toast -- end 
             }
            );
        }
    }
    //Table Extraction click to call this method.....extract table on the fly using ROI
    TableExtractionMI(TableROIDetails: any) {
        const server$ = this.service.postAll('ManualHandlingApi/TableExtractionMI', TableROIDetails).
            pipe(map((data: any) => { return data }));
        return server$;
    }
    //#endregion
    bindDocumentFields() {
        this.documentFieldList(this.objManualHandlingInputModel.documentHeaderID, this.documentSubTypeId).subscribe(data => {
            // bind the field data to grid data source. Need to filter header fields and table fields
            // the header fields will be binded separately and table field data will be binded separately
            //this.gridFieldsModelData = data.lstDocumentExtractionDetailModel;

            this.objMultipleSuspectVModel = data;
            //this.lstDocumentExtractionDetailModel = data.lstDocumentExtractionDetailModel;
            this.lstDocumentExtractionDetailModel = data.lstDocumentExtractionDetailModel.filter(item => item.isTabularField == false);;
            this.DocumentExtractionId = data.objDocumentExtractionModel.documentExtractionId;


            this.lstDocumentExtractionDetailModelDropDown = this.lstDocumentExtractionDetailModel;// added by ashwini
            this.lstDocumentExtractionDetailModelTemp = this.lstDocumentExtractionDetailModel; // added by ashwini
            this.lsCount = this.lstDocumentExtractionDetailModel.length + 3; // added by ashwini on 10-Jan-2020
            this.lstPermissionTypeForUser = data.lstPermissionTypeForuser; // added on 23-Jan-2020

            // bind the document extraction header data to variable to be used during save
            if (data.objDocumentExtractionModel != null && data.objDocumentExtractionModel != undefined) {
                this.currentDocumentExtractionData = data.objDocumentExtractionModel;
            }

            this.bindDropdownSelectedValue();
            // Bind table data
            // get the table field list from all field list
            //;
            //this.tableTab = this.lstManualHandlingVModel.lstDocumentExtractionDetailModel.filter(item => item.isTabularField === true);

            //this.bindTableFieldData(tableFieldData);
            this.displayEditIcon();

        });
        this.GetExtractionTableDetails();
        // added on 29-Jan-2020 -- start
        this.getpopupTitle(this.documentSubTypeId).subscribe(data => {
            // this.smePopupTitle = data.docCategoryName + ' >> ' + data.documentname + ' >> ' + data.documentTypeName;
            this.smePopupTitle = 'Category : ' + data.docCategoryName + ' | Type : ' + data.documentname + ' |  Subtype : ' + data.documentTypeName;//dilip changes 19022020
        });
        // added on 29-Jan-2020 -- end

    }


    //Bind Multisuspect value with high average confidance
    bindDropdownSelectedValue() {
        var multisuspectDataprocess = this.lstDocumentExtractionDetailModel;
        var that = this;
        var elementIndex = 0;
        multisuspectDataprocess.forEach(elementdata => {
            var fieldMultiSuspectModel: ExtractedMultiSuspectModel[] = elementdata.multipleSuspects;

            // If text box field => loop and put empty value in the array, if drop down push the default value
            // as text box and drop down will be dynamically created and index array defaultDropdownSelectedValue should match the sequence of fields
            //start if dropdown =
            if (fieldMultiSuspectModel.length > 1) {
                fieldMultiSuspectModel.forEach(elementMultiSuspectData => {
                    if (elementMultiSuspectData.isDefaultSelected == 1) {
                        elementMultiSuspectData.isSelected = true;
                        that.defaultDropdownSelectedValue.push(elementMultiSuspectData.documentExtractionDid);
                        // Set the average confidence of the selected text from drop down with highest value
                        elementdata.averageConfidance = elementMultiSuspectData.averageConfidance;
                    }
                }
                );
            }//end if dropdown 
            else { // if text box
                that.defaultDropdownSelectedValue.push("");
            }
            elementIndex = elementIndex + 1;
        });
    }

    documentFieldList(documentHeaderID, documentSubTypeId) {
        const server$ = this.service.getSingle('ManualHandlingApi/GetManualHandlingPageData?documentHeaderID=' + documentHeaderID + '&moduleName=' + this.roleWiseModuleName
            + "&documentSubTypeId=" + documentSubTypeId).
            pipe(map((data: any) => { return data }));
        return server$;
    }

    CreateInputParameter(DocumentExtractionId, DocumentExtractionDid, DocTypeFieldMappingId, CoOrdinateX0, CoOrdinateX1, CoOrdinateY0, CoOrdinateY1, PageNumber) {
        return {

            'documentHeaderId': this.currentdocumentHeaderID,
            'documentSubTypeId': this.documentSubTypeId,
            'documentExtractionId': DocumentExtractionId,
            'documentExtractionDid': DocumentExtractionDid,
            'docTypeFieldMappingId': DocTypeFieldMappingId,
            'moduleName': this.roleWiseModuleName,
            'coOrdinateX0': Math.round(CoOrdinateX0),
            'coOrdinateX1': Math.round(CoOrdinateX1),
            'coOrdinateY0': Math.round(CoOrdinateY0),
            'coOrdinateY1': Math.round(CoOrdinateY1),
            'pageNumber': PageNumber,
            'imagePhysicalPath': this.documentPhysicalPath,
        };
    }


    CreateTableInputParameter(DocTypeFieldMappingId, DocumentSubTypeId, PageNumber, TableSequence, CoOrdinateX0, CoOrdinateX1, CoOrdinateY0, CoOrdinateY1) {
        return {
            'DocTypeFieldMappingID': DocTypeFieldMappingId,
            'DocumentSubTypeId': DocumentSubTypeId,
            'PageNumber': PageNumber,
            'DocumentHeaderId': this.currentdocumentHeaderID,
            'TableSequence': TableSequence,
            'boundingBox': { 'CoordinateXO': CoOrdinateX0, 'CoordinateX1': CoOrdinateX1, 'CoordinateY0': CoOrdinateY0, 'CoordinateY1': CoOrdinateY1 },
        };
    }


    //#region Filed and Leadtools

    // Discard changes popup
    CancelPopupVisible = false;
    cancelChangePopup() {
        this.CancelPopupVisible = true;
        this.qcRemarks = '';
        this.vetoRemarks = '';
        this.discardRemarks = '';
    }

    // Discard changes popup
    discardChangesPopupVisible = false;
    discardChangePopup() {
        this.qcRemarks = '';
        this.vetoRemarks = '';
        this.discardRemarks = '';
        this.discardChangesPopupVisible = true;
    }

    // Forward changes popup
    forwardChangesPopupVisible = false;
    forwardChangePopup() {

        if (typeof this.targetFieldGroup === "undefined") {
            this.qcRemarks = '';
            this.vetoRemarks = '';
            this.discardRemarks = '';
            var data = "Fields";
            this.activateTabContent(data);
            this.forwardChangesPopupVisible = true;
        }
        else {
            // removed the validation check on Forward as discussed - 29th Jan 2020
            // let result = this.targetFieldGroup.instance.validate();
            // if (result.isValid) {
            this.qcRemarks = '';
            this.vetoRemarks = '';
            this.discardRemarks = '';
            this.forwardChangesPopupVisible = true;
            // }
            // else {
            //     notify("Please enter all mandatory field value");
            // }
        }
    }

    // QC  changes popup
    qcSavePopupVisible = false;
    qcSavePopup() {

        if (typeof this.targetFieldGroup === "undefined") {
            this.qcRemarks = '';
            this.vetoRemarks = '';
            this.discardRemarks = '';
            var data = "Fields";
            this.activateTabContent(data);
            this.qcSavePopupVisible = true;
        }
        else {
            let result = this.targetFieldGroup.instance.validate();
            if (result.isValid) {
                // Submit values to the server
                this.qcRemarks = '';
                this.vetoRemarks = '';
                this.discardRemarks = '';
                this.qcSavePopupVisible = true;
            }
            else {
                //notify("Please enter all mandatory field values");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Please enter all mandatory field values";
                this.displayAlertmessage("F",contmsgVal);
                //Added on 29-Feb-2020 - message style/toast -- end 
            }
        }
    }


    // Save for Manual handling and Veto changes 
    SaveDocumentFields() {
        //debugger;
        if (typeof this.targetFieldGroup === "undefined") {
            var data = "Fields";
            this.activateTabContent(data);
            this.saveDocumentModifications('', '', '', false, false);
        }
        else {
            let result = this.targetFieldGroup.instance.validate();
            if (result.isValid) {
                this.saveDocumentModifications('', '', '', false, false);
            }
            else {
                //notify("Please enter all mandatory field value");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Please enter all mandatory field value";
                this.displayAlertmessage("F",contmsgVal);
	            //Added on 29-Feb-2020 - message style/toast -- end 
            }
        }
    }

    fieldAnimationOptionsVisible: any;
    toggleWithAnimationOptions(data) {
        this.fieldAnimationOptionsVisible = data;
        this.togglePopupWindowDropdown = data;//Reset value of dropdown visibility
        this.currentSelectedDocumentExtractionDid = data;
    }

    togglePopupWindowDropdown: any;
    onFieldChange(data, currentSelectBoxId) {
        //debugger
        this.togglePopupWindowDropdown = data;
        //$("#txtCapturedData").text("");
        //this.isCapturedData = false;
        // get the document field mapping ID and set the isselected as true in the data model so that while saving multiple suspects data
        // we will need to pass only the isSelected = true value
        var currentField = this.lstDocumentExtractionDetailModel.filter(item => item.docTypeFieldMappingId == data);
        if (currentField != undefined && currentField != null) {
            var currentValue = $("#link" + currentSelectBoxId + " input").val();
            if (currentValue != undefined && currentValue != null && currentValue != "") {
                currentField[0].multipleSuspects.forEach(element => {
                    if (element.documentExtractionDid == currentValue) {
                        element.isSelected = true;
                        this.currentSelectedDocumentExtractionDid = element.documentExtractionDid; // Added on 03 Feb 2020

                        //added for changing average confidace as per selected value
                        currentField[0].averageConfidance = element.averageConfidance;

                        //on dropdown value change as per value change rule status
                        this.clearROISelection(data, element.documentExtractionDid, 'dropdown')

                        // Added the following section to display the selected value in the label text
                        var selectedText = "";
                        // get the element if select box or text box and then accordingly set the selected text                       
                        selectedText = $("#link" + currentSelectBoxId + " input.dx-texteditor-input").val();
                        // loop through the confidence text and create span for the values with blue color and mark less than 9 confidence text character with red color  
                        // var confidenceText = document.createElement('span'); // commented on 21-Feb-2020
                        //confidenceText.style.color = "blue"; // commented on 21-Feb-2020
                        //confidenceText.style.fontWeight = "bold"; // commented on 21-Feb-2020
                        //var percentageConfidence = (parseFloat(element.averageConfidance) * 10); // commented on 21-Feb-2020
                        // confidenceText.innerHTML = percentageConfidence + ' | ' + selectedText;  // commented on 21-Feb-2020
                        // display the selected text value with confidence only when text is not empty
                        //if (selectedText != "") { // commented on 21-Feb-2020
                        //    $("#txtCapturedData").append(confidenceText); // commented on 21-Feb-2020
                        // } // commented on 21-Feb-2020
                        //this.isCapturedData = true;

                        // Find out the ROI for the extracted selected data from drop down and highlight on the viewer
                        this.GetROIOfSearchValue(data, element.documentExtractionDid).subscribe(data => {
                            // added empty check condition on 24th Dec 2019
                            if (data != undefined && data != null) {
                                // field row click - highlighted the value on image and display the confidence level text
                                // Added on 24th Feb 2020 currentSelectBoxId => to be used for setting cursor at specific location in input box after highlight on viewer
                                this.highlightSelectedFieldValueOnViewer(data, element.averageConfidance, selectedText, currentSelectBoxId); // added average confidence - 21st Feb 2020
                                //this.addConfidenceLevelText(data);    // added on 20th Feb 2020    
                                //this.magnifySelectedTextData(data); // added on 20th Feb 2020                         
                            }
                            else {
                                // console.log("ROI for the field not found."); // modified, instead of showing notification message, logged empty ROI in console
                            }
                        });
                    }
                    else {
                        element.isSelected = false;
                    }
                });
            }
        }
        // end of code added for multiple suspects
    }
    displayEditIcon() {
        this.lstPermissionTypeForUser.forEach(element => {

            if (element.permissionTypeID == 1) {
                this.PermissionRight = "T";
            }
            else if (element.permissionTypeID == 2) {
                this.PermissionRight = "T";
            }
            else if (element.permissionTypeID == 4) {
                this.PermissionRight = "T";
            }
            else {
                if (element.permissionTypeID == 3 && this.PermissionRight == "T") {
                    this.PermissionRight = "T"
                }
                else {

                    this.PermissionRight = "F"
                }
            }

        });
        // end of code added for multiple suspects
    }
    //#endregion


    // tableTab = [
    //     { id: 1, text: "Material details", hint: 'Take only the final total and add details', columns: 6 },
    //     { id: 2, text: "Effort hours", hint: 'Take only the final total and add details', columns: 5 },
    //     { id: 3, text: "Material details", hint: 'Take only the final total and add details', columns: 2 },
    // ];



    documentButtonActions = [
        { 'btnName': 'First', 'icon': 'dx-icon-arrowleft' },
        { 'btnName': 'Previous', 'icon': 'dx-icon-chevrondoubleleft' },
        { 'btnName': 'Next', 'icon': 'dx-icon-chevrondoubleright' },
        { 'btnName': 'Last', 'icon': 'dx-icon-arrowright' },
        { 'btnName': 'Zoom In', 'icon': 'icon-zoom-in' },
        { 'btnName': 'Zoom Out', 'icon': 'icon-zoom-out' },
        { 'btnName': 'Fit to page', 'icon': 'icon-fit-to-page' },
        { 'btnName': 'Fit to width', 'icon': 'icon-fit-to-width' },
        { 'btnName': 'Actual size', 'icon': 'icon-actual-size' }
        //,
        //{ 'btnName': 'Magnify', 'icon': 'image' },
    ];

    // Active Button group
    // Active Button group sandeep K
    selectedButton: string;
    activateButton(data) {
        this.selectedButton = data;
        switch (this.selectedButton) {
            case this.documentButtonActions[0].btnName: {
                this.loadFirstPage();
                break;
            }
            case this.documentButtonActions[1].btnName: {
                this.loadPreviousPage();
                break;
            }
            case this.documentButtonActions[2].btnName: {
                this.loadNextPage();
                break;
            }
            case this.documentButtonActions[3].btnName: {
                this.loadLastPage();
                break;
            }
            case this.documentButtonActions[4].btnName: {
                this.zoomInPage();
                break;
            }
            case this.documentButtonActions[5].btnName: {
                this.zoomOutPage();
                break;
            }
            case this.documentButtonActions[6].btnName: {
                this.fitToPage();
                break;
            }
            case this.documentButtonActions[7].btnName: {
                this.fitToWidth();
                break;
            }
            case this.documentButtonActions[8].btnName: {
                this.actualSize();
                break;
            }
            case this.documentButtonActions[9].btnName: {
                this.setMagnify(this.documentViewerMH.view.imageViewer);
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }

    tableFieldSummary: any;
    toggleTableFieldSummary(data) {
        this.tableFieldSummary = data;
    }


    redirect() {
        //this.clearAllGlobalObjects(); // commented on 21-Feb-2020
        //this.router.navigate(['./executor']);  // commented on 21-Feb-2020
        location.reload(); // added on 21-Feb-2020
    }
    //****Region Start SME-POPUP */
    // added by ashwini -- start
    getCategory: string = '';

    smePopupTitle: string;
    popupVisible = false;
    //****End Region Start SME-POPUP */
    dataE = [{
        id: 19,
        documentTypeID: 1,
        documentFieldID: 23,
        documentSubTypeID: 4,
        fieldName: "Invoice amount",
        fielddescription: "invoice amount",
        fieldDataTypeID: 2,
        isMandatory: true,
        fieldDataType: "String",
        isTabularField: false,
        fieldSequence: 1,
        tableSequence: 1,
        isAnchor: false
    }];

    showEditsPopup(MappingId, name) {

        this.selectedValidations = []; // added by ashwini on 17-Jan-2020
        this.popupVisible = true;
        this.getCategory = name;
        this.showFieldContent = name;
        const sendPrm = '?documentMappingId=' + MappingId;
        this.getdocumentfieldlistTesting$(sendPrm).subscribe(data => {

            var dataF = data[0];
            this.docFieldlist = dataF;

            this.documentfieldmodel = dataF;
            this.getAllFieldsExpressionEditor();
            this.getValidationlist(dataF.id, this.expFunctionList, this.expExpressionList); //on 28-Jan-2020
            this.getRegExpressionEdit(dataF.documentFieldID);
            this.getSysnonymslist(dataF.id);
            this.formDTOCustomRuleValidation(); // added by ashwini on 17-Jan-2020
            this.synonymmodel = this.initDocumentSynonymsModel();
            // set the model parameters to be used for ROI Marking - added on 08th Jan 2020
            this.roiParameters.docTypeFieldMappingID = dataF.id;
            this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
            this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
            this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
            this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
            // Check if ROI field selected, then invoke loaddocument() method - 08th Jan 2020
            this.DocumentSubTypeID = this.documentfieldmodel.documentSubTypeID;
            this.DocumentFieldMappingId = dataF.id;
            this.DocumentFieldId = dataF.documentFieldID;

            if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
                this.GetPageNumberForfield();
                this.loadDocumentROI();
            }
            this.showTabContentcustom = 'Field';//diip changes 19022020
            // end of region - 08th Jan 2020
        });
    }
    // getdocumentfieldlistTesting$(sendPrm) {

    //     return this.service.getAll('OntologyApi/GetfiltereddocumentfieldNew', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
    //         return new DocumentField(item.id, item.documentFieldID, item.documentTypeID, item.documentSubTypeID,
    //             item.fieldName, item.fieldDescription,
    //             item.fieldDataTypeID, item.isMandatory, item.fieldDataType,
    //             item.isTabularField, item.fieldSequence, item.tableSequence, item.isAnchor, item.documentValidationList,
    //             item.documentSynonoymsList, item.documentRegExList,
    //             0, '', '', false, item.confidenceLevel
    //         );
    //     })));
    // }
    getdocumentfieldlistTesting$(sendPrm) {
        return this.service.getAll('OntologyApi/GetfiltereddocumentfieldNew', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
            return new DocumentField(item.id, item.documentFieldID, item.documentTypeID, item.documentSubTypeID,
                item.fieldName, item.fieldDescription,
                item.fieldDataTypeID, item.isMandatory, item.fieldDataType,
                item.isTabularField, item.fieldSequence, item.tableSequence, item.isAnchor, item.documentValidationList,
                item.documentSynonoymsList, item.documentRegExList, item.documentTypeTableId, item.documentTypeTableName,
                item.documentTypeTableDesc, item.isActive, item.confidenceLevel,item.displayName,item.fieldStructure,item.zoneType,item.filedLocation,
                item.criticallevel, item.minConfForBlankOut, item.minConfForColor,item.editable,item.confirmBaseOnConfLevel,item.fieldLevelConf,item.charLevelConf,item.fieldDisplayMode,item.masterTableFieldId,
                item.minLength,item.maxLength
            );
        })));
    }

    addField() {
        this.documentfieldmodel = new DocumentField(0, 0, this.selectedDocumentType, this.selectedDocumentSubtype, '', '', 0, 1, '', false, 1, 1, 0, null, null, null, 0, '', '', false, 1.00,'',0,0,0,0,0,0,false,false,0,0,0,0,1,100);
    }


    SynonymsEditNew(MappingId) {
        this.popupVisible = true;
    }

    // getDocumentField$(sendPrm) {
    //     return this.service.getAll('OntologyApi/GetfiltereddocumentfieldNew', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
    //         return new DocumentField(item.id, item.documentFieldID, item.documentTypeID, item.documentSubTypeID,
    //             item.fieldName, item.fieldDescription,
    //             item.fieldDataTypeID, item.isMandatory, item.fieldDataType,
    //             item.isTabularField, item.fieldSequence, item.tableSequence, item.isAnchor, item.documentValidationList,
    //             item.documentSynonoymsList, item.documentRegExList, 0, '', '', false, item.confidenceLevel
    //         );
    //     })));
    // }

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
    // added by ashwini -- start



    initDocumentSynonymsModel() {
        return new SynonymsDetails(0, 0, '', 0, false);
    }
    // added by ashwini on 20-Jan-2020 -- start
    initDocumentTypeTableModel() {
        return new DocumentTypeTable(0, '', '', this.selectedDocumentSubtype, 0);
    }


    //get document sub type detail 
    //used for parameter set for get list of Field
    //set the input paarameter from dashboard list 

    formsearchfilterDto() {
        return {
            DocumentTypeFieldMappingId: this.documentfieldmodel.id //this.selectedDocumentCategory,
        };
    }

    // added by ashwini -- end

    // Load document and bind document rejection reason, document headerID, documentSubTypeId
    readDataForDisplayModule() {
        //debugger;
        if (this.redirectedDocumentHeaderID == -1 && this.isUserRedirected == true) {
            setTimeout(() => {
                this.backToPreviousURL();
            }, 2000);

            return;
        }

        this.fetchDocumentToDisplay().subscribe(data => {
            if (data != null && data.documentHeaderID > 0) {
                this.isDocumentLoaded = false;
                this.objManualHandlingInputModel = data;
                this.RejectionReason = data.reason;
                this.currentdocumentHeaderID = data.documentHeaderID;
                this.documentSubTypeId = data.documentSubTypeId;
                this.DocumentID = data.documentHeaderID;
                this.bindDocumentFields();
                this.loadDocument();
            }
            else if (data.documentHeaderID == -99) {
                //notify("Document has been already processed.");
                var contmsgVal="Document has been already processed.";
                this.displayAlertmessage("S",contmsgVal);
            }
            else {
                this.isDocumentLoaded = true;
                //notify("Document not available for processing. Please re-try after some time.");
                var contmsgVal="Document not available for processing. Please re-try after some time.";
                this.displayAlertmessage("F",contmsgVal);
            }
        });
    }

    // call api to get next document
    fetchDocumentToDisplay() {
        //debugger;
        if (this.redirectedDocumentHeaderID != 0 && this.redirectedDocumentHeaderID != -1) {
            const server$ = this.service.getSingle('ManualHandlingApi/GetDocumentByHeaderID?moduleName=' + this.roleWiseModuleName +
                "&documentHeaderID=" + this.redirectedDocumentHeaderID).
                pipe(map((data: any) => { return data }));

            this.redirectedDocumentHeaderID = -1;
            return server$;
        }
        else {
            const server$ = this.service.getSingle('ManualHandlingApi/GetNextDocument?moduleName=' + this.roleWiseModuleName).
                pipe(map((data: any) => { return data }));
            return server$;
        }
    }

    //#region --------------------------------Save into DB

    // Method which validates the field value data for IsMandatory field
    validateMandatoryFieldValue(eventData) {
        if (eventData.value == '' || eventData.value == null) {
            return false;
        }
        else {
            return true;
        }
    }

    saveQCDocumentModifications() {
        this.saveDocumentModifications(this.qcRemarks, '', '', false, false);
        this.qcSavePopupVisible = false;
    }

    // Method to invoke the save post call when forwarding document to veto
    forwardToVeto() {

        this.saveDocumentModifications('', this.vetoRemarks, '', true, false);
        this.forwardChangesPopupVisible = false;
    }

    // Methdd to invoke the save post call when discarding the document from Veto
    discardDocumentWithReason() {
        this.saveDocumentModifications('', '', this.discardRemarks, false, true);
        this.discardChangesPopupVisible = false;
    }
    //Method to save fill data automatic
    AutoSavefillData() {

        // Step 1 - set the DocumentExtractionModel model data to be updated in DocumentExtraction table
        let documentExtractionDataModel: DocumentExtractionModel = new DocumentExtractionModel(0, 0, 0, 0, null);
        documentExtractionDataModel.documentHeaderId = this.currentdocumentHeaderID;
        documentExtractionDataModel.documentExtractionId = this.currentDocumentExtractionData.documentExtractionId;
        documentExtractionDataModel.documentSubTypeId = this.currentDocumentExtractionData.documentSubTypeId == 0 ? this.documentSubTypeId : this.currentDocumentExtractionData.documentSubTypeId;

        // Step 2 - Set the List<DocumentExtractionDetailModel> model data to be updated in DocumentExtractionDetail table
        // make use of this.gridFieldsModelData which contains the updated manually entered data
        this.lstSaveDocumentExtractionDetailModel = this.CovertMultipleSuspectToDocumentExtractionDetail(this.lstDocumentExtractionDetailModel);
        let documentExtractionDetailDataModel: DocumentExtractionDetailModel[] = this.lstSaveDocumentExtractionDetailModel;

        // Step 3 - Set the Output View model object - ManualHandlingVModel to be passed for Save method
        let manualHandlingDataVModel: ManualHandlingVModel = new ManualHandlingVModel(null, null, null, null, null, null, '', '', '', null);
        manualHandlingDataVModel.objDocumentExtractionModel = documentExtractionDataModel;
        manualHandlingDataVModel.lstDocumentExtractionDetailModel = documentExtractionDetailDataModel;

        // Step 4 - Convert the view model data to required JSON format
        const convertedDocumentExtractionModelToData: DocumentExtractionModel = this.convertDocumentExtractionModelToData(manualHandlingDataVModel.objDocumentExtractionModel);
        const convertedDocumentExtractionDetailModeltoData: DocumentExtractionDetailModel[] = this.convertDocumentExtractionDetailModeltoData(manualHandlingDataVModel.lstDocumentExtractionDetailModel);

        const data = {
            'objDocumentExtractionModel': convertedDocumentExtractionModelToData,
            'lstDocumentExtractionDetailModel': convertedDocumentExtractionDetailModeltoData,
            'ModuleName': this.roleWiseModuleName, 'DocumentStatus': "0", 'QCRemarks': manualHandlingDataVModel.qcRemarks,
            'VetoReason': manualHandlingDataVModel.vetoReason, 'DiscardReason': manualHandlingDataVModel.discardReason
        };

        this.invokePostAutoSaveManualHandlingData(data).subscribe(data => {

        //}, err => { notify('Error Auto Save fill Data') });
    }, err => { 
        // Added on 29-Feb-2020 - message style/toast -- start
        var contmsgVal="Error Auto Save fill Data";
        this.displayAlertmessage("F",contmsgVal);
        //Added on 29-Feb-2020 - message style/toast -- end 
     });

    }
    // Method to take the document parameters, create the data to be saved in the view model format and invoke save document extraction details API
    saveDocumentModifications(QCRemarks: string, VetoReason: string, DiscardReason: string, IsForwardToVeto: boolean, IsDocumentDiscard: boolean) {
        //debugger; 
        // If forward to Veto => do not execute the validations
        //if (IsForwardToVeto == false) {
        if (IsForwardToVeto == false && IsDocumentDiscard == false) { // added on 22-feb-2020 => do not execute the validations for DocumentDiscard
            try {
                let result = this.targetFieldGroup.instance.validate();
                if (!result.isValid) {
                    //notify("Please enter all mandatory field value");
                    var contmsgVal="Please enter all mandatory field value";
                    this.displayAlertmessage("F",contmsgVal);
                    return;
                }
            } catch{
                //notify("Please enter all mandatory field value");
                var contmsgVal="Please enter all mandatory field value";
                this.displayAlertmessage("F",contmsgVal);
                // return; //commented for testing
            }
        }
        // Step 1 - set the DocumentExtractionModel model data to be updated in DocumentExtraction table
        let documentExtractionDataModel: DocumentExtractionModel = new DocumentExtractionModel(0, 0, 0, 0, null);
        documentExtractionDataModel.documentHeaderId = this.currentdocumentHeaderID;
        documentExtractionDataModel.documentExtractionId = this.currentDocumentExtractionData.documentExtractionId;
        documentExtractionDataModel.documentSubTypeId = this.currentDocumentExtractionData.documentSubTypeId == 0 ? this.documentSubTypeId : this.currentDocumentExtractionData.documentSubTypeId;

        // Step 2 - Set the List<DocumentExtractionDetailModel> model data to be updated in DocumentExtractionDetail table
        // make use of this.gridFieldsModelData which contains the updated manually entered data
        this.lstSaveDocumentExtractionDetailModel = this.CovertMultipleSuspectToDocumentExtractionDetail(this.lstDocumentExtractionDetailModel);
        let documentExtractionDetailDataModel: DocumentExtractionDetailModel[] = this.lstSaveDocumentExtractionDetailModel;

        // step 3 - Set the input model to be used when putting the document after failure in rejection queue
        let documentManualHandlingInputDataModel: ManualHandlingInputModel = this.objManualHandlingInputModel;

        // Step 4 - Set the Output View model object - ManualHandlingVModel to be passed for Save method
        let manualHandlingDataVModel: ManualHandlingVModel = new ManualHandlingVModel(null, null, null, null, null, null, '', '', '', null);
        manualHandlingDataVModel.objDocumentExtractionModel = documentExtractionDataModel;
        manualHandlingDataVModel.lstDocumentExtractionDetailModel = documentExtractionDetailDataModel;
        (IsForwardToVeto == true ? manualHandlingDataVModel.qcRemarks = VetoReason : (QCRemarks == '') ? manualHandlingDataVModel.qcRemarks = '' : manualHandlingDataVModel.qcRemarks = QCRemarks);
        (VetoReason == '') ? manualHandlingDataVModel.vetoReason = '' : manualHandlingDataVModel.vetoReason = VetoReason;
        (DiscardReason == '') ? manualHandlingDataVModel.discardReason = '' : manualHandlingDataVModel.discardReason = DiscardReason;
        manualHandlingDataVModel.objManualHandlingInputModel = documentManualHandlingInputDataModel;

        // Step 5 - Convert the view model data to required JSON format
        const convertedDocumentExtractionModelToData: DocumentExtractionModel = this.convertDocumentExtractionModelToData(manualHandlingDataVModel.objDocumentExtractionModel);
        const convertedDocumentExtractionDetailModeltoData: DocumentExtractionDetailModel[] = this.convertDocumentExtractionDetailModeltoData(manualHandlingDataVModel.lstDocumentExtractionDetailModel);
        const convertedManualHandlingInputModeltoData: ManualHandlingInputModel = this.convertManualHandlingInputModeltoData(manualHandlingDataVModel.objManualHandlingInputModel);

        const data = {
            'objDocumentExtractionModel': convertedDocumentExtractionModelToData,
            'lstDocumentExtractionDetailModel': convertedDocumentExtractionDetailModeltoData,
            'objDocumentProcessLogModel': null, 'objManualHandlingInputModel': convertedManualHandlingInputModeltoData,
            'ModuleName': this.roleWiseModuleName, 'DocumentStatus': "0", 'QCRemarks': manualHandlingDataVModel.qcRemarks,
            'VetoReason': manualHandlingDataVModel.vetoReason, 'DiscardReason': manualHandlingDataVModel.discardReason
        };

        // Step 6 - Invoke save post method
        if (IsDocumentDiscard) {
            this.invokePostDiscardDocument(data).subscribe(data => {
                //notify("Document discarded successfully. Loading next document for processing.");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Document discarded successfully. Loading next document for processing.";
                this.displayAlertmessage("S",contmsgVal);
                //Added on 29-Feb-2020 - message style/toast -- end 
                this.clearAllGlobalObjects();
                this.readDataForDisplayModule();
                //this.ngOnInit(); // added on 24-Feb-2020 to refresh the component
            //}, err => { notify('Error DiscardDocument') }); // commented on 29-Feb-2020
        }, err => { 
            //Added on 29-Feb-2020 - message style/toast -- end 
                var contmsgVal="Error DiscardDocument";
                this.displayAlertmessage("F",contmsgVal);
                //Added on 29-Feb-2020 - message style/toast -- end 
         });
        }
        else {
            if (IsForwardToVeto) {
                // this.invokePostSaveAndForwardtoVeto(data).subscribe(data => {
                //     var TabledataParameter = this.TableSave();
                //     notify("Document modifications done successfully and forwarded to Veto. Loading next document for processing.");
                //     this.clearAllGlobalObjects();
                //     this.readDataForDisplayModule();
                // }, err => { notify('Error SaveAndForwardtoVeto') });

                this.ForwardHeaderAndTableFields(data,true);
            }
            else {

                if (this.roleWiseModuleName != "Veto") {

                    //------------------added for testing
                    if (this.CheckValidationForTableCell() == true) {

                      //  notify("Table validtaion done")
                    }
                    else
                    {
                       notify("Table validtaion failed")
                    return;
                    }
                    //-------------------------------

                    this.invokeValidateSaveData(data).subscribe(validationOutput => {

                        if (validationOutput.overAllValidationStatus == true) {

                            //added CheckValidationForTableCell() open coment after table implementation
                            if (this.CheckValidationForTableCell() == true) {
                               // this.SaveFieldDataAfterValidation(data);
                               this.SaveHeaderAndTableFields(data,false);
                            }
                        }
                        else {
                            //---------------------
                            this.SetRuleExecutionValidationStatus(validationOutput);
                            //-----------------------
                            //notify('Validation execution status failed. Please correct the field values.');
                            // Added on 29-Feb-2020 - message style/toast -- start
                            var contmsgVal="Validation execution status failed. Please correct the field values.";
                            this.displayAlertmessage("F",contmsgVal);
                            //Added on 29-Feb-2020 - message style/toast -- end 
                        }
                    });
                } // end of not veto 
                else {
                   // this.SaveFieldDataAfterValidation(data);
                   this.SaveHeaderAndTableFields(data,false);
                }
            }
        }
    }

    SetRuleExecutionValidationStatus(validationOutput: ManualHandlingValidationModel) {
        if (validationOutput.fieldValidation != null && validationOutput.fieldValidation != undefined) {
            this.lstDocumentExtractionDetailModel.forEach(
                element => {
                    validationOutput.fieldValidation.forEach(
                        elementValidation => {
                            if (elementValidation.docTypeFieldMappingId == element.docTypeFieldMappingId) {

                                if (elementValidation.validationStatus == false) {
                                    element.ruleExecutionStatus = false;
                                    element.overAllValidationStatus = false;



                                    //set validation status in poup-----------------
                                    element.objFieldDetailsViewModel.lstFieldRejectionModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID); // added documentExtractionDid to uniquely identify the validation method for multiple suspects
                                            //elementPopupValidation.isValid = currentFieldValidationDetail[0].status;
                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue; //as per new rule execution method
                                            if (elementPopupValidation.docValidationRuleId == 0) { // added if condition to resolve the issue of runtime validation status set when docValidationRuleId is present
                                                elementPopupValidation.docValidationRuleId = -99; //TEMPORRAY ASSIGNED id                                  
                                            }
                                        }
                                    );
                                    element.objFieldDetailsViewModel.lstCustomRuleValidationModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID); // added documentExtractionDid to uniquely identify the validation method for multiple suspects
                                            //elementPopupValidation.isValid = currentFieldValidationDetail[0].status;
                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                            if (elementPopupValidation.docValidationRuleId == 0) {  // added if condition to resolve the issue of runtime validation status set when docValidationRuleId is present
                                                elementPopupValidation.docValidationRuleId = -99; //TEMPORRAY ASSIGNED id      
                                            }
                                        }
                                    );
                                    //-----------------------set validation status in poup End-----
                                }
                                else {
                                    element.ruleExecutionStatus = true;
                                    element.overAllValidationStatus = true;

                                    //set validation status in poup-----------------------
                                    element.objFieldDetailsViewModel.lstFieldRejectionModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID); // added documentExtractionDid to uniquely identify the validation method for multiple suspects
                                            // elementPopupValidation.isValid = currentFieldValidationDetail[0].status;
                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                        }
                                    );
                                    element.objFieldDetailsViewModel.lstCustomRuleValidationModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID); // added documentExtractionDid to uniquely identify the validation method for multiple suspects
                                            //elementPopupValidation.isValid = currentFieldValidationDetail[0].status;
                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                        }
                                    );
                                    //--------------------------set validation status in poup End-------
                                }
                            }
                        }

                    );
                }
            );
        }
    }

    CovertMultipleSuspectToDocumentExtractionDetail(listDocumentExtractionDetailMultisuspectModel: DocumentExtractionDetailMultiSuspectModel[]) {
        let returnDataModel: DocumentExtractionDetailModel[] = [];
        listDocumentExtractionDetailMultisuspectModel.forEach(element => {
            returnDataModel.push({
                docTypeFieldMappingId: element.docTypeFieldMappingId,
                documentExtractionId: element.documentExtractionId,
                documentExtractionDid: (element.multipleSuspects.length == 1 ? element.multipleSuspects[0].documentExtractionDid :
                    (((element.multipleSuspects.filter(obj => obj.isSelected == true).length != 0) ? element.multipleSuspects.filter(obj => obj.isSelected == true)[0].documentExtractionDid
                        : element.multipleSuspects[0].documentExtractionDid))),
                fieldValue: (element.multipleSuspects.length == 1 ? element.multipleSuspects[0].fieldValue :
                    (((element.multipleSuspects.filter(obj => obj.isSelected == true).length != 0) ? element.multipleSuspects.filter(obj => obj.isSelected == true)[0].fieldValue
                        : element.multipleSuspects[0].fieldValue))),
                searchedWords: "",
                documentTypeFieldId: element.documentTypeFieldId,
                fieldName: element.fieldName,
                isMandatory: element.isMandatory,
                isTabularField: element.isTabularField,
                fieldSequence: element.fieldSequence,
                tableSequence: 0,
                objFieldDetailsViewModel: element.objFieldDetailsViewModel //added for validation save
            });
        });

        return returnDataModel;
    }
    // Method to convert the data object into DocumentExtractionModel format
    convertDocumentExtractionModelToData(data: DocumentExtractionModel) {
        return {
            'documentExtractionId': data.documentExtractionId,
            'documentHeaderId': data.documentHeaderId,
            'documentSubTypeId': data.documentSubTypeId,
            'lastUpdateby': 0,
            'lastUpdateDate': new Date()
        };
    }

    // Method to convert the data object into DocumentExtractionDetailModel[] format
    convertDocumentExtractionDetailModeltoData(data: DocumentExtractionDetailModel[]) {
        let returnDataModel: DocumentExtractionDetailModel[] = [];
        data.forEach(element => {
            returnDataModel.push(
                {
                    'documentExtractionDid': element.documentExtractionDid,
                    'documentExtractionId': element.documentExtractionId,
                    'docTypeFieldMappingId': element.docTypeFieldMappingId,
                    'fieldValue': element.fieldValue,
                    'searchedWords': ((element.searchedWords == null || element.searchedWords == undefined) ? '' : element.searchedWords),
                    'documentTypeFieldId': element.documentTypeFieldId,
                    'fieldName': element.fieldName,
                    'isMandatory': element.isMandatory,
                    'isTabularField': element.isTabularField,
                    'fieldSequence': element.fieldSequence,
                    'tableSequence': element.tableSequence,
                    'objFieldDetailsViewModel': this.convertFieldDetailsViewModeltoData(element.objFieldDetailsViewModel), //added for validation save
                }
            )
        });
        return returnDataModel;
    }

    //added for validation save
    convertFieldDetailsViewModeltoData(data: FieldDetailsViewModel) {
        let returnDataModel: FieldDetailsViewModel;
        // data.forEach(element => {
        // returnDataModel.push(
        returnDataModel = {
            'lstFieldROIModel': null,
            'lstFieldRejectionModel': data.lstFieldRejectionModel,
            'lstCustomRuleValidationModel': data.lstCustomRuleValidationModel,
            'lstExtractionSequenceModel': data.lstExtractionSequenceModel,
            'lstFieldSynonymModel': null,
            'lstRegExpressionModel': null,
            'lstAllRejectionModel': null,
        }
        // )
        //});
        return returnDataModel;
    }


    // Method to convert the data object into ManualHandlingInputModel format
    convertManualHandlingInputModeltoData(data: ManualHandlingInputModel) {
        return {
            'documentHeaderID': data.documentHeaderID,
            'statusId': data.statusId,
            'documentStatus': data.documentStatus,
            'reason': data.reason,
            'moduleId': data.moduleId,
            'moduleName': data.moduleName,
            'documentSubTypeId': data.documentSubTypeId,
            'documentPath': data.documentPath,
            'documentImageVirtualPath': data.documentImageVirtualPath,

            'leadToolLicenseFile': data.leadToolLicenseFile,
            'leadTooldeveloperKey': data.leadTooldeveloperKey,
            'projectVirtualRootPath': data.projectVirtualRootPath,
            'leadToolsJSLicenseFilePath': data.leadToolsJSLicenseFilePath,
            'leadToolsJSDeveloperKey': data.leadToolsJSDeveloperKey,
            'leadToolsDocumentServiceHostPath': data.leadToolsDocumentServiceHostPath,
            'documentAllocationId': data.documentAllocationId,
            // 'documentImageVirtualRootPath': data.documentImageVirtualRootPath,
            // 'documentImageFileNameToBeLoaded': data.documentImageFileNameToBeLoaded,
            // 'documentPhysicalRootFolderPath': data.documentPhysicalRootFolderPath
        }
    }

    // call api to invoke the validtaion api
    invokeValidateSaveData(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/ExecuteValidationForFields', data)//.pipe(map(x => x));
            .pipe(map((data: any) => { return data }));
        return result$;
    }

    SaveFieldDataAfterValidation(data: any) {
        //debugger;
        this.invokePostSaveData(data).subscribe(data => {
            var TabledataParameter = this.TableSave();
            //notify("Document modifications done successfully. Loading next document for processing.");
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Document modifications done successfully. Loading next document for processing.";
            this.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
            this.clearAllGlobalObjects();
            this.readDataForDisplayModule();
        //}, err => { notify('Error occurred while saving field data modifications.') });
    }, err => { 
        // Added on 29-Feb-2020 - message style/toast -- start
        var contmsgVal="Error occurred while saving field data modifications.";
        this.displayAlertmessage("F",contmsgVal);
        //Added on 29-Feb-2020 - message style/toast -- end 
     });
    }

    // Method to make the post save API call and return the resultsF
    invokePostSaveData(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/Save', data).pipe(map(x => x));
        return result$;
    }

    // Method to invoke the auto save data using API call
    invokePostAutoSaveManualHandlingData(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/AutoSaveManualHandlingData', data).pipe(map(x => x));
        return result$;
    }
    // Method to invoke the save and forward to veto API call
    invokePostSaveAndForwardtoVeto(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/SaveAndForwardtoVeto', data).pipe(map(x => x));
        return result$;
    }

    // Method to invoke the discard from veto API call
    invokePostDiscardDocument(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/DiscardDocument', data).pipe(map(x => x));
        return result$;
    }

    // Method to clear all global objects on save/cancel/before next document load
    clearAllGlobalObjects() {
        //debugger;
        // added null condition for all except documentViewerMH
        let divTables = document.getElementById('divDocumentTables'),
            divTablesGrid = document.getElementById('divDocumentTables')
        if (divTables != null) {
            document.getElementById('divDocumentTables').style.display = 'none';
        }
        if (divTables != null) {
            document.getElementById('divDocumentTablesGrid').style.display = 'none'; // added on 12-feb-2020
        }
        if (this.divDocumentFields != null) {
            this.divDocumentFields.nativeElement.remove();
        }
        if (this.spnDocumentID != null) {
            this.spnDocumentID.nativeElement.innerHTML = "";
        }
        if (this.spnRejectionReason != null) {
            this.spnRejectionReason.nativeElement.innerHTML = "";
        }
        // commented on 21-Feb-2020 
        // if (this.documentViewerMH != null) {
        //     this.documentViewerMH.thumbnails.dispose();
        // }
        if (this.automationControlMH != null) {
            this.automationControlMH.imageViewer.dispose();
        }
        this.documentViewerMH = null;
        this.automationControlMH = null;
        this.automationMH = null;
        this.managerMH = null;
        this.lstDocumentExtractionDetailModel = null;
        this.objManualHandlingInputModel = null;
        this.fieldsynonymslstmodel = null;
        this.fieldvalidationmappinglist = null;
        this.documentfieldregexlist = null;
        this.documentfieldmodel = null;
        this.synonymmodel = null;
        this.currentdocumentHeaderID = 0;
        this.documentSubTypeId = 0;
        this.currentDocumentExtractionData = null;
        this.openQcRemarksPopup = false;
        this.qcRemarks = '';
        this.vetoRemarks = '';
        this.discardRemarks = '';
        this.RejectionReason = "";
        this.currentdocumentHeaderID = 0;
        this.documentSubTypeId = 0;
        this.DocumentID = 0;

    }

    //endregion-----------------Save Data

    // Method to load the document on page load on page initialization after valid LEADTOOLS license check
    loadDocument() {
        this.checkLicenseAndLoadDocument();
    }

    // Method to set the licensing details of LEADTOOLS and check if valid license is present - allow to proceed if valid license available
    checkLicenseAndLoadDocument() {
        debugger;
        // LEADTOOLS license file path and developer key to come from database configurations - Right now hardcoded
        var licenseUrl = this.objManualHandlingInputModel.leadToolsJSLicenseFilePath; //"http://localhost:4200/assets/LeadTools/LEADTOOLS.lic.txt";
        var developerKey = this.objManualHandlingInputModel.leadToolsJSDeveloperKey;

        var that = this; // variable to resolve the this-that issue of javascript
        lt.RasterSupport.setLicenseUri(licenseUrl, developerKey, function (setLicenseResult) {
            // Check the status of the license 
            if (setLicenseResult.result) {
                setTimeout(() => {
                    // Set the path of the LEADTOOLS document service host path - running in background, used by document viewer to load and save document + annotations
                    lt.Document.DocumentFactory.serviceHost = that.objManualHandlingInputModel.leadToolsDocumentServiceHostPath; //"http://localhost:30000";
                    lt.Document.DocumentFactory.servicePath = "";
                    lt.Document.DocumentFactory.serviceApiPath = "api";
                    // Once license status is verified and validated, invoke open document method
                    that.openDocument();
                }, 10);
            }
            else {
                // False => TODO => LEADTOOLS License is invalid or expired, need to prompt to user
                //notify("LEADTOOLS License is invalid or expired."); 
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="LEADTOOLS License is invalid or expired.";
                that.displayAlertmessage("F",contmsgVal);
                //Added on 29-Feb-2020 - message style/toast -- end 
            }
        });
    }

    // Method to open the document in LEADTOOLS document viewer and set up default annotations settings to be used for ROI marking
    openDocument() {

        var createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
        createOptions.viewContainer = document.getElementById("documentDivParent");
        // createOptions.thumbnailsContainer = document.getElementById("thumbnailDivParent");
        createOptions.useAnnotations = true;
        this.documentViewerMH = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);

        //this.documentViewerMH.view.imageViewer.autoCreateCanvas = true;
        var url = this.objManualHandlingInputModel.documentImageVirtualPath;
        this.documentPhysicalPath = this.objManualHandlingInputModel.documentPath;

        var that = this;
        if (url == null || url === undefined || url == '') {
            //notify("Document not available to load.")
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Document not available to load.";
            this.displayAlertmessage("F",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
        else {

            lt.Document.DocumentFactory.loadFromUri(url, null)
                .done(function (doc) {

                    // Set the document in the viewer 
                    that.documentViewerMH.setDocument(doc);

                    // Set only once - se rubber band interactive mode for the document viewer
                    //  that.setRubberBandInteractiveMode();
                    //that.setSelectTextInteractiveMode();
                    that.documentViewerMH.gotoPage(1);

                    // set up the default annotation manager, objects, bind to the document viewer
                    that.setUpDefaultAnnotations();

                    // initialise the document operation events which allows to handle 36 different events
                    // reference link:https://www.leadtools.com/help/leadtools/v20/dh/javascript/doxui/documentvieweroperation.html
                    that.documentOperationEvent();

                    // added on 20-Feb-2020 - By default display "Fit to Width" page on MI load
                    that.fitToWidth();
                    that.currPageNumber = that.documentViewerMH.currentPageNumber;
                    that.TotpageCount = that.documentViewerMH.pageCount;
                    that.ispageNo = true; // added on 25-Feb-2020 - Do not show page numbers when there are no documents for processing

                })
                //.fail(function () { notify("Document does not exist on the path. Please verify the document path."); }); // commented and added below on 29-Feb-2020
                .fail(function () { 
                    var contmsgVal="Document does not exist on the path. Please verify the document path.";
                    that.displayAlertmessage("F",contmsgVal);
                 });
        }
    }

    // Method to set up the default parameters for annotations feature to be used to draw rectangle
    setUpDefaultAnnotations() {
        // Create and set up the automation managerMH using the HTML5 rendering engine
        const renderingEngine = new lt.Annotations.Rendering.AnnHtml5RenderingEngine();
        this.managerMH = lt.Annotations.Automation.AnnAutomationManager.create(renderingEngine);

        // Added on 09th Oct 2019
        this.managerMH.createDefaultObjects();

        // var currentObject = <HTMLSelectElement>document.getElementById("currentObject");
        const that = this;
        // When the current object ID changes, we need to update our select
        this.managerMH.currentObjectIdChanged.add(function (sender, e) {
            // var currentObjectId = that.managerMH.currentObjectId;
            that.managerMH.currentObjectId = -1; // sender.currentObjectId;
        });

        // Create an instance of the Automation control object that works with LEADTOOLS ImageViewer
        this.automationControlMH = new lt.Annotations.JavaScript.ImageViewerAutomationControl(); // new lt.Demos.Annotations.ImageViewerAutomationControl();
        // Attach our image viewer
        this.automationControlMH.imageViewer = this.documentViewerMH.view.imageViewer; // imageViewer;
        // Set the image viewer interactive mode
        const automationInteractiveMode = new lt.Annotations.JavaScript.AutomationInteractiveMode(); // new lt.Demos.Annotations.AutomationInteractiveMode();
        automationInteractiveMode.automationControl = this.automationControlMH;
        this.documentViewerMH.view.imageViewer.defaultInteractiveMode = automationInteractiveMode;
        // set up the automationMH (will create the container as well)
        this.automationMH = new lt.Annotations.Automation.AnnAutomation(this.managerMH, this.automationControlMH);
        // Add handler to update the container size when the image size changes
        this.documentViewerMH.view.imageViewer.itemChanged.add(function (sender, e) {
            // Single page container attachment
            const container = that.automationMH.container;
            container.size = container.mapper.sizeToContainerCoordinates(that.documentViewerMH.view.imageViewer.imageSize);
        });

        // set up this automation as the active one
        this.automationMH.active = true;
    }

    // add the document operation handler to handle events from document viewer
    documentOperationEvent() {
        this._operationHandler = this.documentViewerMH.operation.add((sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => this.documentViewer_Operation(sender, e));
    }

    // method fired when any event is fired from document viewer - handle the page change event to clear the annotation objects
    private documentViewer_Operation(sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
        var lblPageno = e.pageNumber; // added on 28-feb-2020 - Page number should be change while moving over the page using scrollbar 
        this.currPageNumber = lblPageno.toString(); // added on 28-feb-2020 - Page number should be change while moving over the page using scrollbar 
        switch (e.operation) {
            case lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged:
                this.automationMH.container.children.clear();
                this.documentViewerMH.text.clearSelection(0);
                // Invalidate it - added on 12th Feb 2020 - clear the highlight annotation item on focus lost
                this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
                break;
            default:
                break;
        }
    }

    //On click of field display ROI => has been called on FocusIN of the field - drop down + text box
    rowClickEvent(docTypeFieldMappingId, $eventData, averageConfidance, selectedExtractionDid) {
        //this.isCapturedData = false;
        //$("#txtCapturedData").text("");

        var selectedText = "";
        // get the element if select box or text box and then accordingly set the selected text
        if ($("#" + $eventData.element.id + " input").length == 1) {
            selectedText = $("#" + $eventData.element.id + " input").val();
        }
        else {
            selectedText = $("#" + $eventData.element.id + " input.dx-texteditor-input").val();
            // For drop down, the selected DID wont be always at 0th position which is passed through HTML
            // so dynamically calculate the selected DID and set and pass to fetch the ROI
            selectedExtractionDid = $("#" + $eventData.element.id + " input").val();
        }
        // loop through the confidence text and create span for the values with blue color and mark less than 9 confidence text character with red color  
        // var confidenceText = document.createElement('span');  // commented on 21-Feb-2020
        // confidenceText.style.color = "blue";  // commented on 21-Feb-2020
        // confidenceText.style.fontWeight = "bold"; // commented on 21-Feb-2020
        // var percentageConfidence = (parseFloat(averageConfidance) * 10); // commented on 21-Feb-2020
        // confidenceText.innerHTML = percentageConfidence + ' | ' + selectedText;  // commented on 21-Feb-2020
        // display the selected text value with confidence only when text is not empty // commented on 21-Feb-2020
        //if (selectedText != "") {  // commented on 21-Feb-2020
        //$("#txtCapturedData").append(confidenceText);  // commented on 21-Feb-2020

        //} // commented on 21-Feb-2020
        //this.isCapturedData = true;

        try {
            // // clear previous selected text
            this.automationMH.container.children.clear();
            this.documentViewerMH.text.clearSelection(0);
            // Invalidate it - added on 12th Feb 2020 - clear the highlight annotation item on focus lost
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
        }
        catch{

        }
        var that = this;
        // Added on 24th Feb 2020 to be used for setting cursor at specific location in input box after highlight on viewer
        var currentHTMLInputElementId = $eventData.element.id.charAt($eventData.element.id.length - 1);

        this.GetROIOfSearchValue(docTypeFieldMappingId, selectedExtractionDid).subscribe(data => {
            // added empty check condition on 24th Dec 2019
            if (data != undefined && data != null) {
                // field row click - highlighted the value on image and display the confidence level text
                that.highlightSelectedFieldValueOnViewer(data, averageConfidance, selectedText, currentHTMLInputElementId);// added average confidence - 21st Feb 2020
                //that.addConfidenceLevelText(data);      // added on 20th Feb 2020          
                //that.magnifySelectedTextData(data); // // added on 20th Feb 2020
            }
            else {
                //  console.log("ROI for the field not found."); // modified, instead of showing notification message, logged empty ROI in console
            }
        });
    }

    // call api to get ROI for fields
    GetROIOfSearchValue(fieldMappingId, selectedDocumentExtractionDID) {
        var documentHeaderID = this.objManualHandlingInputModel.documentHeaderID;
        const server$ = this.service.getSingle('ManualHandlingApi/GetROIDetailsForField?docTypeFieldMappingID=' + fieldMappingId + '&moduleName=' + this.roleWiseModuleName +
            '&documentHeaderID=' + documentHeaderID + '&selectedDocumentExtractionDID=' + selectedDocumentExtractionDID).
            pipe(map((data: any) => { return data }));

        return server$;
    }

    // Method to highlight the field data on image using the ROI of the fetched field value
    // Added on 24th Feb 2020 currentSelectedHTMLInputBoxId => to be used for setting cursor at specific location in input box after highlight on viewer
    highlightSelectedFieldValueOnViewer(eventDataFieldValue, averageConfidenceValue, selectedFieldTextValue, currentSelectedHTMLInputBoxId) {
        const inch = 720.0;
        var xDPI = eventDataFieldValue.xdpi;
        var yDPI = eventDataFieldValue.ydpi;

        var topX = eventDataFieldValue.wordX0Cordinate;
        var topY = eventDataFieldValue.wordY0Cordinate;
        var bottomX = eventDataFieldValue.wordX1Cordinate;
        var bottomY = eventDataFieldValue.wordY1Cordinate;
        (topX != "" && topX != null) ? topX = parseFloat(topX) : 0;
        (topY != "" && topY != null) ? topY = parseFloat(topY) : 0;
        (bottomX != "" && bottomX != null) ? bottomX = parseFloat(bottomX) : 0;
        (bottomY != "" && bottomY != null) ? bottomY = parseFloat(bottomY) : 0;

        const pageNumber = eventDataFieldValue.pageNumber;
        this.documentViewerMH.gotoPage(pageNumber);

        // Get the current document 
        var doc = this.documentViewerMH.document;

        let startX: number = topX;
        let startY: number = topY;
        let width: number = (bottomX - startX);
        let height: number = (bottomY - startY);

        if (xDPI == 0 && yDPI == 0) {
            startX = (startX * inch) / 300;
            startY = (startY * inch) / 300;
            width = (width * inch) / 300;
            height = (height * inch) / 300;
        }
        var that = this;

        // Added Highlight Object - 08th Feb 2020 - Display the selected text with red color box using "Highlight Annotation" object
        // Reference link : https://www.leadtools.com/support/forum/posts/t12337-
        var rect = doc.rectToPixels(lt.LeadRectD.create(startX, startY, width, height));
        var imageViewer = that.documentViewerMH.view.imageViewer;
        rect = imageViewer.convertRect(imageViewer.items.item(pageNumber - 1), lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, rect); // Might be optional, showed same result without        
        rect = this.automationMH.containers.get_item(pageNumber - 1).mapper.rectToContainerCoordinates(rect);

        // added on 11th Feb 2020 - Commented on 21st Feb 2020 to test without scroll the image
        imageViewer.set_activeItem(imageViewer.items.item(pageNumber - 1));
        imageViewer.gotoItemByIndex(pageNumber - 1);
        var scrollRect = this.automationMH.containers.get_item(pageNumber - 1).mapper.rectFromContainerCoordinates(rect); // rect from hilite annotation
        scrollRect.x = scrollRect.x - 100;
        scrollRect.y = scrollRect.y - 100;
        var ld = lt.LeadPointD.create(scrollRect.x, scrollRect.y);
        imageViewer.scrollBy(ld);
        // End of added on 11th Feb 2020

        var doc = this.documentViewerMH.document;
        var bounds = doc.rectToPixels(lt.LeadRectD.create(startX, startY, width, height));

        var imageViewer = this.documentViewerMH.view.imageViewer;
        bounds = imageViewer.convertRect(imageViewer.items.item(pageNumber - 1), lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, bounds);

        // The width and height of our redirect canvas 
        const canvasWidth = ((bounds.width) * 4.5);
        const canvasHeight = ((bounds.height) * 5);

        // Create the SpyGlass mode 
        const mode = new lt.Controls.ImageViewerSpyGlassInteractiveMode();
        // mode.workCompleted.add((sender, e) => {
        //     if (mode.redirectCanvas) {
        //         // Clear after drawing on redirected canvas 
        //         const ctx = mode.redirectCanvas.getContext("2d");
        //         ctx.clearRect(0, 0, mode.redirectCanvas.width, mode.redirectCanvas.height)
        //     }
        // });
        mode.size = lt.LeadSizeD.create(canvasWidth, canvasHeight);
        mode.redirectCanvas = null;
        mode.backgroundColor = "transparent";
        mode.crosshairColor = "transparent";
        mode.borderColor = null;

        mode.drawImage.add((sender, e) => {
            var currentRectangle = lt.LeadRectD.create(bounds.x, bounds.y, bounds.width, bounds.height);

            var rect = currentRectangle;//e.destinationRectangle;
            var ctx = e.context;

            // added the zoom factor - scale factor
            ctx.scale(4, 4);
            ctx.save();
            // Undo offset of the spyglass 
            ctx.translate(-(rect.x - 2), -(rect.y - 1));
            // Draw the view 
            this.documentViewerMH.view.imageViewer.renderRedirect(ctx, new lt.Controls.ImageViewerRenderRedirectOptions(), lt.LeadRectD.empty);
            ctx.restore();
        });

        // Add the mode to the viewer 
        this.documentViewerMH.view.imageViewer.interactiveModes.clear();
        this.documentViewerMH.view.imageViewer.interactiveModes.add(mode);
        mode.shape = lt.Controls.ImageViewerSpyGlassShape.rectangle;

        // mode.manualStart(lt.LeadPointD.create(0, 0));
        // var startPositionY = (bounds.y + bounds.height + 50);
        // mode.manualMove(lt.LeadPointD.create(bounds.x, startPositionY));
        mode.manualStart(lt.LeadPointD.create(0, 0));
        mode.manualMove(lt.LeadPointD.create(bounds.x + 40, bounds.y + 125));

        setTimeout(() => {
            var hiliteObj = new lt.Annotations.Engine.AnnHiliteObject();
            hiliteObj.hiliteColor = "Yellow"; // This could be made configurable - changed on 21st Feb 2020
            hiliteObj.opacity = 0.8; // This could be made configurable
            // Set the points for the hilite -> increased 100px diagonally of the highlighted area
            hiliteObj.get_points().add(lt.LeadPointD.create(rect.left - 10, rect.top - 10));
            hiliteObj.get_points().add(lt.LeadPointD.create(rect.right + 10, rect.top - 10));
            hiliteObj.get_points().add(lt.LeadPointD.create(rect.right + 10, rect.bottom + 10));
            hiliteObj.get_points().add(lt.LeadPointD.create(rect.left - 10, rect.bottom + 10));
            // Add the object to the automation container
            this.automationMH.containers.get_item(pageNumber - 1).get_children().add(hiliteObj);
            this.automationMH.selectObject(null);
            // End of code - 08th Feb 2020        

            // Added on 20th Feb 2020 => display the text confidence for the extracted value
            const textConfidenceObj = new lt.Annotations.Engine.AnnTextObject();
            // // Set the points for the hotspot 
            textConfidenceObj.points.add(lt.LeadPointD.create(rect.left - 700, rect.top + 150));
            textConfidenceObj.points.add(lt.LeadPointD.create((rect.left - 700) + 2000, rect.top + 150));
            textConfidenceObj.points.add(lt.LeadPointD.create((rect.left - 700) + 2000, rect.top + 380));
            textConfidenceObj.points.add(lt.LeadPointD.create(rect.left - 700, rect.top + 380));
            textConfidenceObj.text = eventDataFieldValue.wordConfidenceText;
            textConfidenceObj.stroke = null;
            textConfidenceObj.font = new lt.Annotations.Engine.AnnFont("Roboto", 24);
            textConfidenceObj.font.fontWeight = lt.Annotations.Engine.AnnFontWeight.normal;
            textConfidenceObj.textForeground = lt.Annotations.Engine.AnnSolidColorBrush.create("blue");
            textConfidenceObj.fill = lt.Annotations.Engine.AnnSolidColorBrush.create("#eee");
            // Add the object to the automationMH container 
            this.automationMH.container.children.add(textConfidenceObj);
            // Invalidate it 
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
            // End of code Added on 20th Feb 2020    

            // Added on 22 Feb 2020 => Word Average Confidence text
            const textAverageConfidenceObj = new lt.Annotations.Engine.AnnTextObject();
            // // Set the points for the hotspot 
            textAverageConfidenceObj.points.add(lt.LeadPointD.create(rect.left - 1000, rect.top + 390));
            textAverageConfidenceObj.points.add(lt.LeadPointD.create((rect.left - 1000) + 290, rect.top + 390));
            textAverageConfidenceObj.points.add(lt.LeadPointD.create((rect.left - 1000) + 290, rect.top + 620));
            textAverageConfidenceObj.points.add(lt.LeadPointD.create(rect.left - 1000, rect.top + 620));
            textAverageConfidenceObj.text = (averageConfidenceValue * 10).toString();
            textAverageConfidenceObj.stroke = lt.Annotations.Engine.AnnStroke.create(
                lt.Annotations.Engine.AnnSolidColorBrush.create("black"),
                lt.LeadLengthD.create(2));
            textAverageConfidenceObj.font = new lt.Annotations.Engine.AnnFont("Roboto", 24);
            textAverageConfidenceObj.font.fontWeight = lt.Annotations.Engine.AnnFontWeight.normal;
            textAverageConfidenceObj.textForeground = lt.Annotations.Engine.AnnSolidColorBrush.create("brown");
            textAverageConfidenceObj.fill = lt.Annotations.Engine.AnnSolidColorBrush.create("#FFFFFF");
            textAverageConfidenceObj.borderStyle = lt.Annotations.Engine.AnnBorderStyle.normal;
            // Add the object to the automationMH container 
            this.automationMH.container.children.add(textAverageConfidenceObj);
            // Invalidate it 
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
            // End of code for word average confidence text

            // Added on 22 Feb 2020 - selected field text value - ocr/manually entered value
            const textFieldValueObj = new lt.Annotations.Engine.AnnTextObject();
            // // Set the points for the hotspot 
            textFieldValueObj.points.add(lt.LeadPointD.create(rect.left - 700, rect.top + 390));
            textFieldValueObj.points.add(lt.LeadPointD.create((rect.left - 700) + 2000, rect.top + 390));
            textFieldValueObj.points.add(lt.LeadPointD.create((rect.left - 700) + 2000, rect.top + 620));
            textFieldValueObj.points.add(lt.LeadPointD.create(rect.left - 700, rect.top + 620));
            textFieldValueObj.text = selectedFieldTextValue;
            textFieldValueObj.stroke = null;
            textFieldValueObj.font = new lt.Annotations.Engine.AnnFont("Roboto", 24);
            textFieldValueObj.font.fontWeight = lt.Annotations.Engine.AnnFontWeight.normal;
            textFieldValueObj.textForeground = lt.Annotations.Engine.AnnSolidColorBrush.create("black");
            textFieldValueObj.fill = lt.Annotations.Engine.AnnSolidColorBrush.create("#F5F5DC");
            // Add the object to the automationMH container 
            this.automationMH.container.children.add(textFieldValueObj);
            // Invalidate it 
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
            // End of code for text value - could be OCR value or manually entered
        }, 100);

        // Added on 24th Feb 2020 - to set cursor position to character having low confidence      
        for (var i = 0; i < eventDataFieldValue.wordConfidenceText.length; i++) {
            if (eventDataFieldValue.wordConfidenceText.charAt(i) < this.LowestCharacterConfidenceToSetInTextField) {
                var inputElement = <HTMLInputElement>(document.getElementById("link" + currentSelectedHTMLInputBoxId));
                if (inputElement != null && inputElement != undefined) {
                    // If it is header field, single text box element
                    if (inputElement.getElementsByTagName("input").length == 1) {
                        inputElement.getElementsByTagName("input")[0].setSelectionRange(i, i); //.selectionStart = i
                        break;
                    } else { // If select box, multiple text box element
                        for (var index = 0; index < inputElement.getElementsByTagName("input").length; index++) {
                            // Fetch the editor input box and then set cursor in this found text box element
                            if (inputElement.getElementsByTagName("input")[index].className == "dx-texteditor-input") {
                                inputElement.getElementsByTagName("input")[index].setSelectionRange(i, i);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            // else {
            //     inputElement.getElementsByTagName('input')[0].setSelectionRange(i,i);
            // }
        }

        // Clear the global selected label ID after captured text is displayed and highlighted  - 28th Feb 2020                              
        this.clickedLabelId = 0;
        // end of code - 24th Feb 2020

        // Commented on 08th Feb 2020 - selectText object only highlights with gray color, hence used highlight annotation object
        // const selectText = () => {
        //     // SelectText requires the rectangle to be in control pixel coordinates, so convert. First to pixels... 
        //     var bounds = doc.rectToPixels(lt.LeadRectD.create(startX, startY, width, height));
        //     // And then using the image viewer in the view to control. The item is the one at page number - 1 
        //     var imageViewer = that.documentViewerMH.view.imageViewer;
        //     bounds = imageViewer.convertRect(imageViewer.items.item(pageNumber - 1), lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, bounds);
        //     // Select it, all lines 
        //     that.documentViewerMH.text.selectText(bounds, lt.Document.Viewer.DocumentViewerSelectTextMode.line);
        // }
        // if (this.documentViewerMH.text.hasDocumentPageText(pageNumber)) {
        //     selectText();
        // }
        // else {
        //     this.documentViewerMH.operation.add(function (sender, e) {
        //         if (e.operation === lt.Document.Viewer.DocumentViewerOperation.getText && e.isPostOperation) {
        //             selectText();
        //         }
        //     });
        //     this.documentViewerMH.text.getDocumentPageText(pageNumber);
        // }
    }
    // Method to display the confidence level text above the highlighted text
    addConfidenceLevelText(eventDataFieldValue) {
        const inch = 720.0;
        var xDPI = eventDataFieldValue.xdpi;
        var yDPI = eventDataFieldValue.ydpi;

        var topX = eventDataFieldValue.wordX0Cordinate;
        var topY = eventDataFieldValue.wordY0Cordinate;
        var bottomX = eventDataFieldValue.wordX1Cordinate;
        var bottomY = eventDataFieldValue.wordY1Cordinate;
        (topX != "" && topX != null) ? topX = parseFloat(topX) : 0;
        (topY != "" && topY != null) ? topY = parseFloat(topY) : 0;
        (bottomX != "" && bottomX != null) ? bottomX = parseFloat(bottomX) : 0;
        (bottomY != "" && bottomY != null) ? bottomY = parseFloat(bottomY) : 0;
        let startX: number = topX;
        let startY: number = topY;
        let width: number = (bottomX - startX);
        let height: number = (bottomY - startY);

        if (xDPI == 0 && yDPI == 0) {
            startX = (startX * inch) / 300;
            startY = (startY * inch) / 300;
            width = (width * inch) / 300;
            height = (height * inch) / 300;
        }
        startY = startY - 100;

        const stampObj = new lt.Annotations.Engine.AnnTextObject();
        // // Set the points for the hotspot 
        stampObj.points.add(lt.LeadPointD.create(startX - 10, startY));
        stampObj.points.add(lt.LeadPointD.create(startX + width + 50, startY));
        stampObj.points.add(lt.LeadPointD.create(startX + width + 50, startY + height + 50));
        stampObj.points.add(lt.LeadPointD.create(startX - 10, startY + height + 50));

        stampObj.text = eventDataFieldValue.wordConfidenceText;
        stampObj.fill = null;//new lt.Annotations.Engine.AnnBrush();
        stampObj.stroke = null;
        stampObj.font = new lt.Annotations.Engine.AnnFont("Arial", 12);
        stampObj.font.fontWeight = lt.Annotations.Engine.AnnFontWeight.extraBold;
        //stampObj.textBackground = new ltAnnotationsEngine.AnnBrush();

        // Add the object to the automationMH container 
        this.automationMH.container.children.add(stampObj);
        // Invalidate it 
        this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
    }

    //#region ---------------------Implement field wise validation 

    clearROISelection(paraDocTypeFieldMappingId, paraDocumentExtractionDid, controlType) {
        //debugger;
        //this.isCapturedData = false;
        //$("#txtCapturedData").text("");

        // Added on 20th Feb 2020
        if (this.documentViewerMH != null && this.documentViewerMH != undefined) {
            var magnifyMode = <lt.Controls.ImageViewerSpyGlassInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.spyGlassModeId);
            if (magnifyMode != null && magnifyMode != undefined) {
                magnifyMode.manualStop();
            }
        }
        // End of code Added on 20th Feb 2020

        try {
            this.automationMH.container.children.clear();
            this.documentViewerMH.text.clearSelection(0);
            // Invalidate it - added on 12th Feb 2020 - clear the highlight annotation item on focus lost
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
        }
        catch{

        }
        var listFilterData: any;
        listFilterData = this.lstDocumentExtractionDetailModelTemp.filter(item => item.docTypeFieldMappingId == paraDocTypeFieldMappingId);

        var fieldValueToValidate = "";

        if (controlType == "dropdown") {
            listFilterData = listFilterData[0].multipleSuspects.filter(item => item.documentExtractionDid == paraDocumentExtractionDid && item.isSelected == true);
            if (listFilterData.length != 0)
                fieldValueToValidate = listFilterData[0].fieldValue;
        }
        else {
            listFilterData = listFilterData[0].multipleSuspects.filter(item => item.documentExtractionDid == paraDocumentExtractionDid);
            fieldValueToValidate = listFilterData[0].fieldValue;
        }

        if (fieldValueToValidate.trim() != "") {
            this.validateEnteredFieldValue(paraDocTypeFieldMappingId, paraDocumentExtractionDid, fieldValueToValidate, 0);
        }
    }

    convertFieldValidationInputModel(paraDocTypeFieldMappingId, paraDocumentExtractionDid, fieldValueToValidate) {
        return {
            'documentHeaderId': this.currentdocumentHeaderID,
            'documentSubTypeId': this.documentSubTypeId,
            'documentExtractionId': this.DocumentExtractionId,
            'documentExtractionDid': paraDocumentExtractionDid,
            'docTypeFieldMappingId': paraDocTypeFieldMappingId,
            'fieldValue': fieldValueToValidate,
            'moduleName': this.roleWiseModuleName
        };
    }

    // Apply field wise validation
    validateEnteredFieldValue(paraDocTypeFieldMappingId, paraDocumentExtractionDid, fieldValueToValidate, isTabularField) {
        //debugger;
        let objFieldValidationInputModel = this.convertFieldValidationInputModel(paraDocTypeFieldMappingId, paraDocumentExtractionDid, fieldValueToValidate);
        this.invokeValidationForSpecificFields(objFieldValidationInputModel).subscribe(validationOutput => {

            if (isTabularField == 0) //if non tabular field then only show the icon
            {
                if (validationOutput.overAllValidationStatus == true) {
                    //do nothing
                    this.SetRuleExecutionValidationStatus(validationOutput);
                }
                else {
                    this.SetRuleExecutionValidationStatus(validationOutput);
                    //notify('Validation execution status failed. Please correct the values for highlighted fields');
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal="Validation execution status failed. Please correct the values for highlighted fields";
                    this.displayAlertmessage("F",contmsgVal);
                    //Added on 29-Feb-2020 - message style/toast -- end 
                    // added on 20-Feb-2020 - Field wise Validation execution status- If failed, open and display the field pop-over with the status of validation methods
                    this.fieldAnimationOptionsVisible = paraDocTypeFieldMappingId;
                    this.togglePopupWindowDropdown = paraDocTypeFieldMappingId;
                }
            }
        });
    }

    // Method to invoke Validation For SpecificFields   
    invokeValidationForSpecificFields(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/ExecuteValidationForSpecificFields', data)
            .pipe(map((data: any) => { return data }));
        return result$;
    }
    //#endregion ---------------------End Implement field wise validation 

    // added by ashwini -- start
    documentFieldListSuccessRejected(documentHeaderID, documentSubTypeId, radiochk) {
        //;
        const server$ = this.service.getSingle('ManualHandlingApi/GetManualHandlingPageDataSuccessRejected?documentHeaderID=' + documentHeaderID + '&moduleName=' + this.roleWiseModuleName
            + "&documentSubTypeId=" + documentSubTypeId + "&RadioSelectedVal=" + radiochk).
            pipe(map((data: any) => { return data }));
        return server$;
    }
    //added by ashwini -- end

    // added by ashwini on 27-Dec-2019 -- start
    onValueChangedForDropdown($event) {
        var radiochk = "";
        this.fieldAnimationOptionsVisible = 0;//Reset value of text visibility
        this.togglePopupWindowDropdown = 0;//Reset value of dropdown visibility
        this.currentSelectedDocumentExtractionDid = 0;
        if ($event.value == "Successful") {
            this.lstDocumentExtractionDetailModel = this.lstDocumentExtractionDetailModelTemp.filter(item => item.overAllValidationStatus == true);
        }
        else if ($event.value == "Rejected") {
            this.lstDocumentExtractionDetailModel = this.lstDocumentExtractionDetailModelTemp.filter(item => item.overAllValidationStatus == false);
        }
        else {
            this.lstDocumentExtractionDetailModel = this.lstDocumentExtractionDetailModelDropDown

        }

    }
    // added by ashwini on 27-Dec-2019 -- start
    //Added By Sandeep K on 27 Dec 2019
    //Method to load first page of document
    loadFirstPage() {
        this.documentViewerMH.gotoPage(1);
        this.currPageNumber = this.documentViewerMH.currentPageNumber; // added on 22-Feb-2020
        this.TotpageCount = this.documentViewerMH.pageCount;
    }

    // Method to load last page of document
    loadLastPage() {
        this.documentViewerMH.gotoPage(this.documentViewerMH.pageCount);
        this.currPageNumber = this.documentViewerMH.currentPageNumber; // added on 22-Feb-2020
        this.TotpageCount = this.documentViewerMH.pageCount;
    }

    // Method to navigate next page from the current page and displays message if last page of document is reached  
    loadNextPage() {
        if (this.documentViewerMH.currentPageNumber < this.documentViewerMH.pageCount) {
            this.documentViewerMH.gotoPage(this.documentViewerMH.currentPageNumber + 1);
            this.currPageNumber = this.documentViewerMH.currentPageNumber; // added on 22-Feb-2020
            this.TotpageCount = this.documentViewerMH.pageCount;
        }
        else {
            //notify("You have reached last page!"); // code commented on 29-Feb-2020
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="You have reached last page!";
                this.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
    }

    // Method to navigate previous page from the current page and displays message if first page of document is reached
    currentpagenumber: number;
    loadPreviousPage() {
        // Step 3 : Load the next page of the document
        if (this.documentViewerMH.currentPageNumber > 1) {

            this.documentViewerMH.gotoPage(this.documentViewerMH.currentPageNumber - 1);
            this.currPageNumber = this.documentViewerMH.currentPageNumber; // added on 22-Feb-2020
            this.TotpageCount = this.documentViewerMH.pageCount;


        } else {
            //notify("You have reached first page!"); 
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="You have reached first page!";
                this.displayAlertmessage("S",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
    }

    // Method to Zoom In Page by 1.5 factor
    zoomInPage() {
        this.documentViewerMH.view.imageViewer.zoom(lt.Controls.ControlSizeMode.none,
            this.documentViewerMH.view.imageViewer.scaleFactor * 1.5, this.documentViewerMH.view.imageViewer.defaultZoomOrigin);
    }

    // Method to Zoom Out Page by 0.5 factor
    zoomOutPage() {
        this.documentViewerMH.view.imageViewer.zoom(lt.Controls.ControlSizeMode.none,
            this.documentViewerMH.view.imageViewer.scaleFactor * 0.5, this.documentViewerMH.view.imageViewer.defaultZoomOrigin);
    }

    // Method to display the document fit to page size
    fitToPage() {
        this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitPage);
    }

    // Method to display the document fit to width size
    fitToWidth() {
        this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewFitWidth);
    }

    // Method to display the document actual size
    actualSize() {
        this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.viewActualSize);
    }
    //End Portion added by Sandeep K   on 27 Dec 2019  
    defaultVisible: string;
    toggleDefault(data) {
        this.defaultVisible = data;
    }

    //#endregion

    // Invoke the click and capture for the field on label click
    // Added parameter on currentSelectedHTMLInputBoxId - 28th Feb 2020
    labelClickEvent(documentExtractionDid, docTypeFieldMappingId, averageConfidance, fieldConfidanceMediumSetting, currentSelectedHTMLInputBoxId) {
        // Added on 28th Feb 2020 => clear if any magnified image already highlighted on the viewer
        try {
            if (this.documentViewerMH != null && this.documentViewerMH != undefined) {
                var magnifyMode = <lt.Controls.ImageViewerSpyGlassInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.spyGlassModeId);
                if (magnifyMode != null && magnifyMode != undefined) {
                    magnifyMode.manualStop();
                }
            }
            // End of code Added on 20th Feb 2020
            //clear previous selected text
            this.automationMH.container.children.clear();
            this.documentViewerMH.text.clearSelection(0);
            // Invalidate it - added on 12th Feb 2020 - clear the highlight annotation item on focus lost
            this.documentViewerMH.view.imageViewer.invalidate(lt.LeadRectD.empty);
        }
        catch { }
        // End of code added on 28th Feb 2020

        this.DocumentExtractionDid = documentExtractionDid;
        this.DocumentTypeFieldMappingId = docTypeFieldMappingId;
        // assign rubber band interactive mode and create the rubberBandDelta and rubberBandCompleted event handlers
        // removed the condition check for click and capture - as click and capture can be done for all fields - high/medium/low confidence
        //if (averageConfidance < fieldConfidanceMediumSetting) {
        // commented existing method invoke and added new method for setting rubber band interactive mode and run command
        //this.startRubberBandInteractiveMode();

        this.setRubberBandInteractiveMode();
        //this.setSelectTextInteractiveMode();

        this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveRubberBand, this.documentViewerMH.currentPageNumber);
        //this.documentViewerMH.commands.run(lt.Document.Viewer.DocumentViewerCommands.interactiveSelectText, this.documentViewerMH.currentPageNumber);
        //} else {
        //}
        // Added on 28th Feb 2020 - to set the clicked label ID
        this.clickedLabelId = currentSelectedHTMLInputBoxId;
    }

    // Method to set module heading as per the current logged in role for Manual Handling screen - Manual handling/QC/Veto
    setModuleNameHeading() {
        let moduleName: string = '';
        let manualhandlingStartIndex = window.location.toString().indexOf("manualhandling");
        let qualitycheckStartIndex = window.location.toString().indexOf("qualitycheck");
        let vetoStartIndex = window.location.toString().indexOf("veto");
        if (manualhandlingStartIndex >= 0) {
            moduleName = "Manual Handling";
        } else if (qualitycheckStartIndex >= 0) {
            moduleName = "Quality Check";
        } else if (vetoStartIndex >= 0) {
            moduleName = "Veto";
        }
        return moduleName;
    }

    // Method to check the current module and make the set specific flags to control the button visibility on screen
    controlRoleSpecificButtonVisibility() {
        if (this.roleWiseModuleName == "ManualHandling") {
            this.isManualHandlingScreen = true;
            this.isQualityCheckScreen = false;
            this.isVetoScreen = false;
        }
        else if (this.roleWiseModuleName == "QualityCheck") {
            this.isManualHandlingScreen = false;
            this.isQualityCheckScreen = true;
            this.isVetoScreen = false;
        }
        else if (this.roleWiseModuleName == "Veto") {
            this.isManualHandlingScreen = false;
            this.isQualityCheckScreen = false;
            this.isVetoScreen = true;
        }

        //------------------- For Document monitor
        // var referrer = document.referrer;  // previous url        // not working set in constructer
        var referrer = localStorage.getItem("PreviousUrl");
        this.previousUrl = referrer;


        var queryparameter = Number(this.route.snapshot.queryParamMap.get('documentHeaderID'));

        if (referrer != null && referrer != undefined) {
            if (referrer.toLocaleLowerCase().search("document-monitor") != -1 && queryparameter != 0) {

                this.isUserRedirected = true;
                this.redirectedDocumentHeaderID = Number(this.route.snapshot.queryParamMap.get('documentHeaderID'));
                localStorage.setItem("PreviousUrl", this.previousUrl);
            }
            if (referrer.toLocaleLowerCase().search("user-load-productivity") != -1) {

                this.isUserRedirected = true;
                this.redirectedDocumentHeaderID = Number(this.route.snapshot.queryParamMap.get('documentHeaderID'));
                localStorage.setItem("PreviousUrl", this.previousUrl);
            }
        }
        else {

        }
        if (queryparameter != 0) // if page refresh
        {
            this.isUserRedirected = true;
            this.redirectedDocumentHeaderID = Number(this.route.snapshot.queryParamMap.get('documentHeaderID'));
            this.previousUrl = localStorage.getItem("PreviousUrl");
            localStorage.setItem("PreviousUrl", this.previousUrl);

        }
        //-------------------End For Document monitor
    }

    // for click and capture, start rubber band interactive mode
    private setRubberBandInteractiveMode(): void {
        var rubberbandMode = <lt.Controls.ImageViewerRubberBandInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.rubberBandModeId);
        if (rubberbandMode == undefined || rubberbandMode == null) {
            rubberbandMode = new lt.Controls.ImageViewerRubberBandInteractiveMode();
            this.documentViewerMH.view.imageViewer.interactiveModes.add(rubberbandMode);
        }
        rubberbandMode.set_borderColor("blue");
        rubberbandMode.set_borderThickness(2);
        rubberbandMode.set_borderStyle("solid");
        rubberbandMode.rubberBandCompleted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) => this.rubberBandCompleted(sender, e));
        rubberbandMode.autoItemMode = lt.Controls.ImageViewerAutoItemMode.autoSet;
        this.documentViewerMH.view.imageViewer.defaultInteractiveMode = rubberbandMode;
    }

    CoOrdinateX0: any;
    CoOrdinateX1: any;
    CoOrdinateY0: any;
    CoOrdinateY1: any;
    rabberbandflag: boolean;
    rubberBandCompleted(sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) {
        var rubberBand = <lt.Controls.ImageViewerRubberBandInteractiveMode>sender;
        var item = rubberBand.item;
        debugger;
        if (e.isCanceled || !item)
            return;
        this.rabberbandflag = true;
        var points = e.points.map(function (point) { return point.clone(); });
        var min = lt.LeadPointD.empty;
        var max = lt.LeadPointD.empty;

        for (var i = 0; i < points.length; i++) {
            points[i] = this.documentViewerMH.view.imageViewer.convertPoint(item, lt.Controls.ImageViewerCoordinateType.control, lt.Controls.ImageViewerCoordinateType.image, points[i]);
            if (i === 0) {
                min = points[i].clone();
                max = points[i].clone();
            }
            else {
                min.x = Math.min(min.x, points[i].x);
                min.y = Math.min(min.y, points[i].y);
                max.x = Math.max(max.x, points[i].x);
                max.y = Math.max(max.y, points[i].y);
            }
        }
        this.CoOrdinateX0 = points[0].x;
        this.CoOrdinateX1 = points[1].x;
        this.CoOrdinateY0 = points[0].y;
        this.CoOrdinateY1 = points[1].y;

        // Added the margin of 10 pixels for the x0, y0, x1, y1 co-ordinates of the bounding box before searching in PRO file
        this.CoOrdinateX0 = this.CoOrdinateX0;// - 10;
        this.CoOrdinateX1 = this.CoOrdinateX1;// + 10;
        this.CoOrdinateY0 = this.CoOrdinateY0;// - 10;
        this.CoOrdinateY1 = this.CoOrdinateY1;// + 10;

        var dataparmeter = this.CreateInputParameter(this.DocumentExtractionId, this.DocumentExtractionDid,
            this.DocumentTypeFieldMappingId, this.CoOrdinateX0, this.CoOrdinateX1, this.CoOrdinateY0, this.CoOrdinateY1, this.documentViewerMH.currentPageNumber);
        this.SaveClickandCaptureData(dataparmeter);

        this.documentViewerMH.view.imageViewer.interactiveModes.beginUpdate();
        this.documentViewerMH.view.imageViewer.interactiveModes.clear();
        this.documentViewerMH.view.imageViewer.interactiveModes.endUpdate();
    }

    // for click and capture, start rubber band interactive mode
    private tableRubberBandInteractiveMode(tablesequence, tabledata): void {
        var rubberbandMode = <lt.Controls.ImageViewerRubberBandInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.rubberBandModeId);
        if (rubberbandMode == undefined || rubberbandMode == null) {
            rubberbandMode = new lt.Controls.ImageViewerRubberBandInteractiveMode();
            this.documentViewerMH.view.imageViewer.interactiveModes.add(rubberbandMode);
        }
        rubberbandMode.set_borderColor("blue");
        rubberbandMode.set_borderThickness(2);
        rubberbandMode.set_borderStyle("solid");
        rubberbandMode.rubberBandCompleted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) => this.tableRubberBandCompleted(sender, e, tablesequence, tabledata));
        rubberbandMode.autoItemMode = lt.Controls.ImageViewerAutoItemMode.autoSet;
        this.documentViewerMH.view.imageViewer.defaultInteractiveMode = rubberbandMode;
    }
    tableRubberBandCompleted(sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs, tablesequence, tabledata) {
        var rubberBand = <lt.Controls.ImageViewerRubberBandInteractiveMode>sender;
        var item = rubberBand.item;
        debugger;
        if (e.isCanceled || !item)
            return;
        this.rabberbandflag = true;
        var points = e.points.map(function (point) { return point.clone(); });
        var min = lt.LeadPointD.empty;
        var max = lt.LeadPointD.empty;

        for (var i = 0; i < points.length; i++) {
            points[i] = this.documentViewerMH.view.imageViewer.convertPoint(item, lt.Controls.ImageViewerCoordinateType.control, lt.Controls.ImageViewerCoordinateType.image, points[i]);
            if (i === 0) {
                min = points[i].clone();
                max = points[i].clone();
            }
            else {
                min.x = Math.min(min.x, points[i].x);
                min.y = Math.min(min.y, points[i].y);
                max.x = Math.max(max.x, points[i].x);
                max.y = Math.max(max.y, points[i].y);
            }
        }
        this.CoOrdinateX0 = points[0].x;
        this.CoOrdinateX1 = points[1].x;
        this.CoOrdinateY0 = points[0].y;
        this.CoOrdinateY1 = points[1].y;

        // Added the margin of 10 pixels for the x0, y0, x1, y1 co-ordinates of the bounding box before searching in PRO file
        this.CoOrdinateX0 = this.CoOrdinateX0 - 10;
        this.CoOrdinateX1 = this.CoOrdinateX1 + 10;
        this.CoOrdinateY0 = this.CoOrdinateY0 - 10;
        this.CoOrdinateY1 = this.CoOrdinateY1 + 10;
        debugger
        var docTypeTableFieldMappingId = tabledata[this.TableROIDetails.length].docTypeFieldMappingId;
        var DocumentTableSubTypeId = tabledata[this.TableROIDetails.length].documentSubTypeID;
        var dataparmeter = this.CreateTableInputParameter(docTypeTableFieldMappingId, DocumentTableSubTypeId, this.documentViewerMH.currentPageNumber, tablesequence, Math.round(this.CoOrdinateX0), Math.round(this.CoOrdinateX1), Math.round(this.CoOrdinateY0), Math.round(this.CoOrdinateY1));
        //this.SaveClickandCaptureData(dataparmeter);
        this.highlightClickOnViewer(dataparmeter);
        debugger
        this.TableROIDetails.push(dataparmeter);
        //this.documentViewerMH.view.imageViewer.interactiveModes.beginUpdate();
        // this.documentViewerMH.view.imageViewer.interactiveModes.clear();
        //this.documentViewerMH.view.imageViewer.interactiveModes.endUpdate();
    }
    // Method to highlight the field data on image using the ROI of the fetched field value
    highlightClickOnViewer(eventDataFieldValue) {
        debugger
        const inch = 720.0;
        var xDPI = 300;//eventDataFieldValue.xdpi;
        var yDPI = 300;//eventDataFieldValue.ydpi;

        var topX = eventDataFieldValue.boundingBox.CoordinateXO;
        var topY = eventDataFieldValue.boundingBox.CoordinateY0;
        var bottomX = eventDataFieldValue.boundingBox.CoordinateX1;
        var bottomY = eventDataFieldValue.boundingBox.CoordinateY1;
        (topX != "" && topX != null) ? topX = parseFloat(topX) : 0;
        (topY != "" && topY != null) ? topY = parseFloat(topY) : 0;
        (bottomX != "" && bottomX != null) ? bottomX = parseFloat(bottomX) : 0;
        (bottomY != "" && bottomY != null) ? bottomY = parseFloat(bottomY) : 0;

        const pageNumber = eventDataFieldValue.PageNumber;
        //this.documentViewerMH.gotoPage(pageNumber);

        // Get the current document 
        //  var doc = this.documentViewerMH.document;

        let startX: number = topX;
        let startY: number = topY;
        let width: number = (bottomX - startX);
        let height: number = (bottomY - startY);

        if (xDPI == 0 && yDPI == 0) {
            startX = (startX * inch) / 300;
            startY = (startY * inch) / 300;
            width = (width * inch) / 300;
            height = (height * inch) / 300;
        }
        var that = this;
        // Added Highlight Object - 08th Feb 2020 - Display the selected text with red color box using "Highlight Annotation" object
        // Reference link : https://www.leadtools.com/support/forum/posts/t12337-
        //var rect = doc.rectToPixels(lt.LeadRectD.create(startX, startY, width, height));
        var rect = lt.LeadRectD.create(startX, startY, width, height);
        var imageViewer = that.documentViewerMH.view.imageViewer;
        rect = imageViewer.convertRect(imageViewer.items.item(pageNumber - 1), lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, rect); // Might be optional, showed same result without        
        rect = this.automationMH.containers.get_item(pageNumber - 1).mapper.rectToContainerCoordinates(rect);
        var hiliteObj = new lt.Annotations.Engine.AnnHiliteObject();//AnnTextPointerObject();
        // hiliteObj.text="";
        hiliteObj.hiliteColor = "Red"; // This could be made configurable
        hiliteObj.opacity = 0.5; // This could be made configurable
        // Set the points for the hilite -> increased 100px diagonally of the highlighted area
        hiliteObj.get_points().add(lt.LeadPointD.create(rect.left, rect.top));
        hiliteObj.get_points().add(lt.LeadPointD.create(rect.right, rect.top));
        hiliteObj.get_points().add(lt.LeadPointD.create(rect.right, rect.bottom));
        hiliteObj.get_points().add(lt.LeadPointD.create(rect.left, rect.bottom));
        // Add the object to the automation container
        this.automationMH.containers.get_item(pageNumber - 1).get_children().add(hiliteObj);
        this.automationMH.selectObject(null);
        // End of code - 08th Feb 2020


    }

    SaveClickandCaptureData($data: any) {
        this.invokeCaptureClickAndCapture($data).subscribe((data: any) => {
            if (data.value == "DataPresentInImage") {
                //notify("Data not captured, please add the data manually");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Data not captured, please add the data manually";
                this.displayAlertmessage("F",contmsgVal); 
	            //Added on 29-Feb-2020 - message style/toast -- end 

            }
            else if (data.value == "DataPresentbutNotValidated") {
                //notify("Data present but not validated");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Data present but not validated";
                this.displayAlertmessage("F",contmsgVal); 
               //Added on 29-Feb-2020 - message style/toast -- end
            }
            else if (data.value == "") // added since empty value needs to be handled
            {
                //notify("Data not captured, please add the data manually");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Data not captured, please add the data manually";
                this.displayAlertmessage("F",contmsgVal);
               //Added on 29-Feb-2020 - message style/toast -- end
            }
            else {
                //---------------------set search value into textbox
                this.lstDocumentExtractionDetailModel.forEach(
                    element => {
                        //;
                        if (element.docTypeFieldMappingId == $data.docTypeFieldMappingId) {
                            // displayed the confidence level for the newly captured data
                            // split the data using pipe character
                            var splitArray = data.value.split('|');
                            if (splitArray != null) {
                                element.multipleSuspects[0].fieldValue = splitArray[0]; // Captured Value
                                element.averageConfidance = splitArray[1]; // Average Confidence
                                var wordConfidenceText = splitArray[2]; // Word Connfidence Text

                                // Invoke the Highlight Value on the viewer after click and capture => Get ROI and then mark the new value on the viewer - magnify - 28th Feb 2020
                                try {
                                    var XDPI = splitArray[3]; // XDPI
                                    var YDPI = splitArray[4]; // YDPI
                                    var x0Coordinate = splitArray[5]; // Top X
                                    var y0Coordinate = splitArray[6]; // Top Y
                                    var x1Coordinate = splitArray[7]; // Bottom X
                                    var y1Coordinate = splitArray[8]; // Bottom Y
                                    var capturedTextPageNumber = splitArray[9]; // Page Number
                                    var dataParameter = {
                                        "xdpi": XDPI,
                                        "ydpi": YDPI,
                                        "wordX0Cordinate": x0Coordinate,
                                        "wordY0Cordinate": y0Coordinate,
                                        "wordX1Cordinate": x1Coordinate,
                                        "wordY1Cordinate": y1Coordinate,
                                        "pageNumber": capturedTextPageNumber,
                                        "wordConfidenceText": wordConfidenceText
                                    };
                                    this.highlightSelectedFieldValueOnViewer(dataParameter, splitArray[1], splitArray[0], this.clickedLabelId);
                                }
                                catch{ console.log("Error in highlighting the field after label click event"); }
                                // End of code - 28th Feb 2020
                            }
                            //element.multipleSuspects[0].fieldValue = data.value;
                        }
                    }
                );
            }
            //---------------------------------------

        //}, err => { notify('Error SaveClickandCaptureData') }); // commented on 29-Feb-2020
        }, err => { 
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Error SaveClickandCaptureData";
                this.displayAlertmessage("F",contmsgVal);
	        //Added on 29-Feb-2020 - message style/toast -- end 
         });


    }
    invokeCaptureClickAndCapture(data: any) {

        const result$ = this.service.postAll('ManualHandlingApi/GetCaptureDataForSpecificField', data).pipe(map(x => x));
        return result$;
    }

    // Event to make the drop down value editable and allow user to edit selected text of drop down
    addCustomItem(eventData, docTypeFieldMappingId, currentSelectBoxId) {
        if (!eventData.text) return;
        var currentField = this.lstDocumentExtractionDetailModel.filter(item => item.docTypeFieldMappingId == docTypeFieldMappingId);
        if (currentField != undefined && currentField != null) {
            var currentValue = $("#link" + currentSelectBoxId + " input").val();
            if (currentValue != undefined && currentValue != null && currentValue != "") {
                currentField[0].multipleSuspects.forEach(element => {
                    if (element.documentExtractionDid == currentValue) {
                        element.fieldValue = eventData.text;
                        eventData.text = element;
                    }
                });
            }
        }

    }

    //#region - ROI Marking from SME Dashboard
    documentButtonActionsROI = [
        { 'btnName': 'Mark', 'icon': 'palette' },
        { 'btnName': 'Delete', 'icon': 'trash' }
    ]

    defaultVisibleROI: string;
    toggleDefaultROI(data) {
        this.defaultVisibleROI = data;
    }

    // Active Button group
    //selectedButtonROI: string = '';
    selectedButtonROI: string = this.operatorSymbol[0];
    activateButtonROI(data) {
        this.selectedButtonROI = data;

        // Invoke the button click event for the marked buttons for ROI
        if (data != undefined && data != null) {
            if (data.btnName == "Mark") {
                this.drawRectangleROI();
            } else if (data.btnName == "Delete") {
                this.deleteAnnotationsROI();
            }
            // else if (data.btnName == "Save") {
            //     this.saveRectangleROI();
            // }
        }
    }

    // Method to load the document on page load on page initialization after valid LEADTOOLS license check
    loadDocumentROI() {
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
            that.checkLicenseAndLoadDocumentROI();
        });
    }

    SetRoiEditVirtualpath(DocumentSubTypeID) {
        const result$ = this.service.getAll('RoiApi/GetAllRoiEditPathsForDocument?DocumentSubTypeID=' + DocumentSubTypeID).pipe(map((data: any) => { return data }));
        return result$;
    }

    // Method to set the licensing details of LEADTOOLS and check if valid license is present - allow to proceed if valid license available
    checkLicenseAndLoadDocumentROI() {
        // LEADTOOLS license file path and developer key to come from database configurations - Right now hardcoded
        const licenseUrl = this.leadToolsJSLicenseFilePathROI;
        const developerKey = this.leadToolsJSLicenseDeveloperKeyROI;
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
                    that.openDocumentROI();
                    that.displayAnchorValueROI();
                }, 10);
            } else {
                // False
                //notify("LEADTOOLS License is invalid or expired.");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="LEADTOOLS License is invalid or expired.";
                that.displayAlertmessage("F",contmsgVal);
	            //Added on 29-Feb-2020 - message style/toast -- end 
            }
        });
    }

    // Method to open the document in LEADTOOLS document viewer and set up default annotations settings to be used for ROI marking
    openDocumentROI() {
        const createOptions = new lt.Document.Viewer.DocumentViewerCreateOptions();
        createOptions.viewContainer = document.getElementById('documentDivParentROI');
        // createOptions.thumbnailsContainer = document.getElementById('thumbnailDivParentROI');
        createOptions.useAnnotations = true;
        this.documentViewer = lt.Document.Viewer.DocumentViewerFactory.createDocumentViewer(createOptions);
        if (this.roiParameters.documentImageVirtualPath == '') {

            this.roiParameters.documentImageVirtualPath = (this.documentImageVirtualRootPathROI);
        }
        const url = this.roiParameters.documentImageVirtualPath;
        const that = this;
        if (url != '' && url != undefined) {
            lt.Document.DocumentFactory.loadFromUri(url, null)
                .done(function (doc) {
                    // Set the document in the viewer
                    that.documentViewer.setDocument(doc);
                    that.documentViewer.gotoPage(that.CurrentPageNumber);
                    that.setUpDefaultAnnotationsROI();
                    // Load the annotations for the specific loaded document by checking the name of the document
                    // Name of document is same as the name of XML Annotation file
                    // The root folder of the input document will be searched for the XML file with same name and then the XML file will be loaded
                    that.loadAllPageAnnotationsROI(true);
                    //sandeep k
                    // initialise the document operation events which allows to handle 36 different events
                    // reference link:https://www.leadtools.com/help/leadtools/v20/dh/javascript/doxui/documentvieweroperation.html
                    that.documentOperationEventROI();
                    //end sandeep k
                })
                //.fail(function () { notify('Error loading document'); }); // commented on 29-Feb-2020
                .fail(function () { 
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal="Error loading document";
                    that.displayAlertmessage("F",contmsgVal); 
	                //Added on 29-Feb-2020 - message style/toast -- end 
                 });
        } else {
            //notify('Document path is empty.');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Document path is empty.";
                that.displayAlertmessage("F",contmsgVal); 
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
    }

    // Method to set up the default parameters for annotations feature to be used to draw rectangle
    setUpDefaultAnnotationsROI() {
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

    // Method to load all annotations for the current document invoked when loading document for first time and after saving the current document changes
    loadAllPageAnnotationsROI(isCalledOnLoad: boolean) {
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
                ;
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
    displayAnchorValueROI() {
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
        this.roiParameters.fieldName = '';
        this.roiParameters.isTabularField = false;
        this.roiParameters.isAnchor = false;
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

    // Method to assign the annotation object as rectangle for drawing rectangle
    drawRectangleROI() {
        // -3 is the object id of rectangle annotation
        // added a check for allowing user to mark only single ROI for the simple header field and allow multiple ROI markings for IsTabularField
        // if already one ROI has been marked for the field, notify the user 
        // if need to change ROI, select and delete exitsing ROI
        // removed table field condition - 23-Jan-2020
        //if (this.roiParameters.isTabularField != undefined && this.roiParameters.isTabularField == false && this.isAlreadyDrawROIClicked == true) {
        if (this.isAlreadyDrawROIClicked == true) {
            //notify('Only single ROI is allowed for the field. Please delete existing ROI and mark new one.');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Only single ROI is allowed for the field. Please delete existing ROI and mark new one.";
            this.displayAlertmessage("F",contmsgVal); 
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
        else {
            this.isAlreadyDrawROIClicked = true;
            this.manager.currentObjectId = -3;
            this.isROIModified = true; // added on 08th Feb 2020
        }
    }

    // Delete the selected objects from the current page
    deleteAnnotationsROI() {
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
    saveRectangleROI() {
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
        catch{
            //console.log("Error in SaveRectangle method");
        }
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
            //notify("ROI details saved successfully.");
            // }
            // added to clear the parameter values before closing the screen
            this.clearAllDataOnScreenBeforeClose();
        });
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
        ;
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

    // add the document operation handler to handle events from document viewer
    documentOperationEventROI() {
        this._operationHandlerROI = this.documentViewer.operation.add((sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs) => this.documentViewer_OperationROI(sender, e));
    }

    // method fired when any event is fired from document viewer - handle the page change event to clear the annotation objects
    private documentViewer_OperationROI(sender: any, e: lt.Document.Viewer.DocumentViewerOperationEventArgs): void {
        switch (e.operation) {
            case lt.Document.Viewer.DocumentViewerOperation.currentPageNumberChanged:
                this.automation.container.children.clear();
                this.documentViewer.text.clearSelection(0);
                const that = this;
                //that.documentViewer.currentPageNumber=2;
                //that.documentViewer.gotoPage(that.documentViewer.currentPageNumber); 
                that.loadAllPageAnnotationsROI(true);
                break;
            default:
                break;
        }
    }
    //#endregion

    // Set magnify on the entire viewer
    setMagnify(viewer) {
        // The width and height of our redirect canvas 
        const canvasWidth = 100;
        const canvasHeight = 100;

        // Create the SpyGlass mode 
        const mode = new lt.Controls.ImageViewerSpyGlassInteractiveMode();
        mode.workCompleted.add((sender, e) => {
            if (mode.redirectCanvas) {
                // Clear after drawing on redirected canvas 
                const ctx = mode.redirectCanvas.getContext("2d");
                ctx.clearRect(0, 0, mode.redirectCanvas.width, mode.redirectCanvas.height)
            }
        });
        mode.size = lt.LeadSizeD.create(canvasWidth, canvasHeight);
        mode.redirectCanvas = null;
        mode.backgroundColor = "transparent";
        mode.crosshairColor = "transparent";

        mode.drawImage.add((sender, e) => {
            const rect = e.destinationRectangle;
            const ctx = e.context;

            // added the zoom factor - scale factor
            ctx.scale(2, 2);
            ctx.save();
            // Undo offset of the spyglass 
            ctx.translate(-rect.x, -rect.y);
            // Draw the view 
            viewer.renderRedirect(ctx, new lt.Controls.ImageViewerRenderRedirectOptions(), lt.LeadRectD.empty);
            ctx.restore();
        });

        // Add the mode to the viewer 
        viewer.interactiveModes.clear();
        viewer.interactiveModes.add(mode);
        mode.shape = lt.Controls.ImageViewerSpyGlassShape.rectangle;
    }
    //end of set magnify

    // Field wise magnified object
    magnifySelectedTextData(eventDataFieldValue) {

        const inch = 720.0;
        var xDPI = eventDataFieldValue.xdpi;
        var yDPI = eventDataFieldValue.ydpi;
        var topX = eventDataFieldValue.wordX0Cordinate;
        var topY = eventDataFieldValue.wordY0Cordinate;
        var bottomX = eventDataFieldValue.wordX1Cordinate;
        var bottomY = eventDataFieldValue.wordY1Cordinate;
        const pageNumber = eventDataFieldValue.pageNumber;
        (topX != "" && topX != null) ? topX = parseFloat(topX) : 0;
        (topY != "" && topY != null) ? topY = parseFloat(topY) : 0;
        (bottomX != "" && bottomX != null) ? bottomX = parseFloat(bottomX) : 0;
        (bottomY != "" && bottomY != null) ? bottomY = parseFloat(bottomY) : 0;
        let startX: number = topX;
        let startY: number = topY;
        let width: number = (bottomX - startX);
        let height: number = (bottomY - startY);
        if (xDPI == 0 && yDPI == 0) {
            startX = (startX * inch) / 300;
            startY = (startY * inch) / 300;
            width = (width * inch) / 300;
            height = (height * inch) / 300;
        }

        var doc = this.documentViewerMH.document;
        var bounds = doc.rectToPixels(lt.LeadRectD.create(startX, startY, width, height));

        var imageViewer = this.documentViewerMH.view.imageViewer;
        bounds = imageViewer.convertRect(imageViewer.items.item(pageNumber - 1), lt.Controls.ImageViewerCoordinateType.image, lt.Controls.ImageViewerCoordinateType.control, bounds);

        // The width and height of our redirect canvas 
        const canvasWidth = ((bounds.width) * 4.5);
        const canvasHeight = ((bounds.height) * 5);

        // Create the SpyGlass mode 
        const mode = new lt.Controls.ImageViewerSpyGlassInteractiveMode();
        // mode.workCompleted.add((sender, e) => {
        //     if (mode.redirectCanvas) {
        //         // Clear after drawing on redirected canvas 
        //         const ctx = mode.redirectCanvas.getContext("2d");
        //         ctx.clearRect(0, 0, mode.redirectCanvas.width, mode.redirectCanvas.height)
        //     }
        // });
        mode.size = lt.LeadSizeD.create(canvasWidth, canvasHeight);
        mode.redirectCanvas = null;
        mode.backgroundColor = "transparent";
        mode.crosshairColor = "transparent";

        mode.drawImage.add((sender, e) => {
            var currentRectangle = lt.LeadRectD.create(bounds.x, bounds.y, bounds.width, bounds.height);

            const rect = currentRectangle;//e.destinationRectangle;
            const ctx = e.context;

            // added the zoom factor - scale factor
            ctx.scale(4, 4);
            ctx.save();
            // Undo offset of the spyglass 
            ctx.translate(-(rect.x - 4), -(rect.y - 2.5));
            // Draw the view 
            this.documentViewerMH.view.imageViewer.renderRedirect(ctx, new lt.Controls.ImageViewerRenderRedirectOptions(), lt.LeadRectD.empty);
            ctx.restore();
        });

        // Add the mode to the viewer 
        this.documentViewerMH.view.imageViewer.interactiveModes.clear();
        this.documentViewerMH.view.imageViewer.interactiveModes.add(mode);
        mode.shape = lt.Controls.ImageViewerSpyGlassShape.rectangle;

        mode.manualStart(lt.LeadPointD.create(0, 0));
        var startPositionY = (bounds.y + bounds.height + 50);
        mode.manualMove(lt.LeadPointD.create(bounds.x, startPositionY));
        //mode.manualStop(); 
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



    ngOnDestroy() {
        // alert("ngOnDestroy");
        this.redirectedDocumentHeaderID = 0;
        this.previousUrl = "";
        localStorage.setItem("PreviousUrl", "");
        if (this.IntervalId) {

            clearInterval(this.IntervalId);
        }
    }
    //-----------------------------------Send user to back URL if redirect from another module
    getUrlParameter(name, URLLink) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(URLLink);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, '    '));
    };










    startEdit(e) {
        if (e.rowType === "data") {
            e.component.editRow(e.rowIndex);
            alert("cxvxcv");
        }
    }










    // added on 29-Jan-2020 -- start
    getpopupTitle(documentSubTypeId) {

        const server$ = this.service.getSingle('ManualHandlingApi/GetDocumentTitle?documentSubTypeId=' + documentSubTypeId).
            pipe(map((data: any) => { return data }));
        return server$;
    }



    // ************************************************** Region SME POP Up MI**********************************************//
    // Modified by ashwini on 17-Jan-2020 -- start
    //****Function SME-POPUP */

    // Table list hide and show
    isShown: boolean = false; // hidden by default
    isTableShown: boolean = true;
    title: string;
    showTabContentcustom: string = this.customValidationTab[0]; //added on 28-Jan-2020

    //showFieldContent: any;
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
    // Modified by ashwini on 17-Jan-2020 -- end


    //****Function SME-POPUP */
    clearAllObjectMode() {


        this.selectedValidations = [];
        this.customRuleValidations = []; // added by ashwini on 17-Jan-2020
        this.defaultValidations = [];
        this.documentfieldregexlist = [];
        this.defaultExpressions = [];
        this.selectedExpressions = [];
        this.fieldsynonymslstmodel = [];
        this.selectedExtractValidations = []; // added by ashwini on 17-Jan-2020
        this.defaultExtractValidations = []; // added by ashwini on 17-Jan-2020
        this.tempcustomRuleValidations = [];//dilip added 19022020
        this.synonymstaberror = false;
        this.customstaberror = false;
        this.validationstaberror = false;
        this.regularExpressiontaberror = false;
        this.extractionSequencetaberror = false;
        this.roitaberror = false;

        this.synonymmodel = this.initDocumentSynonymsModel();
        this.docfieldValidation = this.initDocumentFieldRuleModel(); // added on 20-Jan-2020
        this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
        this.popupVisible = false;//dilip added 19022020
        this.valOntology.instance.reset();//dilip added 19022020

        if (this.vwlist != undefined) {//dilip added 19022020
            this.vwlist.instance.resetOption('searchValue');//dilip added 19022020
        }//dilip added 19022020

    }
    //****Function SME-POPUP */
    onDragStart(e) {
        e.itemData = e.fromData[e.fromIndex];
    }
    //****Function SME-POPUP */
    onAddSynonymsArray(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }

    //****Function SME-POPUP */
    onRemoveSynonymsArray(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }
    //****Function SME-POPUP */
    onAdddefaultExpressions(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }
    // Modified by ashwini on 17-Jan-2020 -- start
    //****Function SME-POPUP */
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
    // Modified by ashwini on 17-Jan-2020 -- end
    //****Function SME-POPUP */
    onAddselectedExpressions(e) {
        // let name = e.itemData.fieldRegularExpression.name;
        let name = e.itemElement.children[0].children[0].children[0].innerHTML;
        let data = e.fromData.filter(x => x.fieldRegularExpression.name === name);
        e.toData.splice(e.toIndex, 0, data[0]);
    }

    //****Function SME-POPUP */
    onRemoveselectedExpressions(e) {
        e.itemData.isDeleted = true;
        e.itemData.isMapped = false;
        e.fromData.splice(e.fromIndex, 1);
        this.selectedExpressions = e.fromData;
        this.defaultExpressions = e.toData;

    }

    // Modified by ashwini on 17-Jan-2020 -- start
    //****Function SME-POPUP */
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
    // Modified by ashwini on 17-Jan-2020 -- end
    //****Function SME-POPUP */
    onRemoveselectedValidations(e) {
        e.itemData.isDeleted = true;
        e.itemData.isMapped = false;
        e.itemData.isActive = false;
        e.fromData.splice(e.fromIndex, 1);
        this.selectedValidations = e.fromData;
        this.defaultValidations = e.toData;
    }
    //****Function SME-POPUP */
    onAdddefaultValidations(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }
    // Modified by ashwini on 17-Jan-2020 -- start
    //****Function SME-POPUP */
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
    // Modified by ashwini on 17-Jan-2020 -- end
    //#endregion  sandip


    //****Function SME-POPUP */
    activateContent(data) {
        //this.valOntology.instance.validate();
        this.showFieldContent = data;
        this.getCategory = '';
        // Check if ROI field selected, then invoke loaddocument() method - 04th Jan 2020
        if (this.showFieldContent.toLowerCase().indexOf('roi') > -1) {
            this.GetPageNumberForfield();
            this.loadDocumentROI();
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
    //****Function SME-POPUP */
    getValidationlist(id: any, functionlist, expressionlist) {

        const sendPrm = '?id=' + id;// here id is field - subtype mapping id DocTypeFieldMappingID // pls change 51 to id
        var thisitem = this;
        this.fieldvalidationlist$(sendPrm, id).subscribe(data => {
            this.fieldvalidationmappinglist = data;

            this.selectedValidations
                = data.filter(m => m.id > 0 && m.isMapped == true && m.isActive == true
                    && m.fieldRuleValidation.isCustomRule == 0 && m.fieldRuleValidation.isExtractionRule === false);


            this.selectedValidations = this.selectedValidations.sort((a, b) => {
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
                    && m.fieldRuleValidation.isExtractionRule === false);

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
            console.log('expExpressionList', thisitem.expExpressionList);

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
    // code commented by ashwini on 16-Jan-2020 -- end

    fieldvalidationlist$(sendPrm, docTypeFieldMappingId) {
        return this.service.getAll('OntologyApi/GetAllfieldvalidationbyfield', sendPrm).pipe(map((data: any[]) => data.map((item: any) => {
            return new FieldValidationMapping(item.id, docTypeFieldMappingId, item.fieldRuleValidationId, item.isMapped,
                item.fieldRuleValidation, item.parameterValue, false, item.methodSequenceId, item.dependentMethodSequenceId, item.isActive);
        })));
    }

    ////****Function SME-POPUP */
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

    // Modified by ashwini on 17-Jan-2020 -- start
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
    // Modified by ashwini on 17-Jan-2020 -- end
    // ADD/Remove Synonums
    //added document field id from document model 
    //assing id in synonym model

    // Modified by ashwini on 17-Jan-2020 -- start

    //****Function SME-POPUP */
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
                    //notify('Duplicate Synonym');
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal="Duplicate Synonym";
                    this.displayAlertmessage("F",contmsgVal);
                   //Added on 29-Feb-2020 - message style/toast -- end 
                }
            }
        }
    }
    // modified by ashwini on 17-Jan-2020 -- end

    // added by ashwini on 20-Jan-2020 -- end
    //****Function SME-POPUP */
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



    formDto($data, synonymslst, validationlst, regexlist) {
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
            documentTypeTableId: row.documentTypeTableId,
            documentTypeTableName: row.documentTypeTableName,
            documentTypeTableDesc: row.documentTypeTableDesc,
            documentSynonoymsList: synonymslst,
            documentValidationList: validationlst,
            documentRegExList: regexlist
        };
    }


    // #region <added by ashwini -- ontology pop up>
    // added by ashwini on 17-Jan-2020 -- START
    // GET ONLY FIELD LIST FOR ADD VALIDATION EXPRESSION EDITOR PAGE ...... Field list
    //****Function SME-POPUP */
    getAllFieldsExpressionEditor() {

        this.getexpfieldlist$().subscribe(data => {
            this.expFieldList = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        });
    }


    getexpfieldlist$() {

        const sendPrm = '?id=' + this.documentfieldmodel.documentSubTypeID;
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

    //****Function SME-POPUP */
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
            ,
        {
            "ID": 2,
            "tabName": "Functions",
            "content": this.expFunctionList
        }
            ,
        {
            "ID": 3,
            "tabName": "Expressions",
            "content": this.expExpressionList
        }

        ];
    }
    //****Function SME-POPUP */
    AddCustomRule() {
        this.docfieldValidation = new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '','','');
        this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
        this.customValidationEdits = true;
        if (this.showTabContentcustom == "" || this.showTabContentcustom == null) { this.showTabContentcustom = 'Field'; this.getIndex(0, null); } // added on 25-Feb-2020
    }
    //****Function SME-POPUP */
    onCancelCustomRuleValidationEdits() {
        this.docfieldValidation = new FieldRuleValidation(0, '', '', '', 0, 1, true, false, 0, '','','');
        this.customvalidationmapping = new FieldValidationMapping(0, 0, 0, true, this.docfieldValidation, '', false, 0, 0, true);
        this.showTabContentcustom = 'Field';
        this.getIndex(0, null);
        this.customValidationEdits = false;
    }
    //****Function SME-POPUP */
    editCustomRuleValidation(data, index) {

        this.customValidationEdits = true;

        this.customvalidationmapping = new FieldValidationMapping(
            data.id, data.docTypeFieldMappingID, data.fieldRuleValidationID, 1,
            new FieldRuleValidation(data.fieldRuleValidationID, data.fieldRuleValidation.name, data.fieldRuleValidation.expression,
                data.fieldRuleValidation.description,data.fieldRuleValidation.parameterName,data.fieldRuleValidation.functionName, data.fieldRuleValidation.noOfParameters, data.fieldRuleValidation.isCustomRule,
                data.fieldRuleValidation.isActive, data.fieldRuleValidation.isExtractionRule, data.fieldRuleValidation.validationSequence, data.fieldRuleValidation.parameterName),
            data.parameterValue, data.isDeleted, data.methodSequenceId, data.dependentMethodSequenceId, data.isActive);
        const toIndex = this.tempcustomRuleValidations.indexOf(data); // added on 25-feb-2020
        this.customvalidationmapping.rowIndex = toIndex;

    }


    //****Function SME-POPUP */
    onAdddefaultExtractValidations(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }
    //****Function SME-POPUP */
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


    //****Function SME-POPUP */
    onAddtempcustomRuleValidations(e) {
        e.toData.splice(e.toIndex, 0, e.itemData);
    }
    //****Function SME-POPUP */
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

    //****Function SME-POPUP */
    onAddcustomRuleValidations(e) {
        let name = e.itemElement.children[0].children[0].children[0].innerHTML;
        let data = e.fromData.filter(x => x.fieldRuleValidation.name === name.toString().trim());
        e.toData.splice(e.toIndex, 0, data[0]);
    }


    //****Function SME-POPUP */
    onRemovecustomRuleValidations(e) {
        e.itemData.isDeleted = true;
        e.itemData.isMapped = false;
        e.itemData.isActive = false;
        e.fromData.splice(e.fromIndex, 1);
        this.customRuleValidations = e.fromData;
        this.tempcustomRuleValidations = e.toData;
    }



    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
    getValidationExtractionparamtername(index, data) {
        if (data != null && data != undefined && data != '') {
            let prmNameArray = data.split(',');

            return prmNameArray[index];
        }
        else {
            return null;
        }
    }
    //****Function SME-POPUP */
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
                console.log('onadd', this.selectedExtractValidations);
            }
        }
        // above block would delete parameter values and availbale to user fresh insert
        e.toData.splice(e.toIndex, 0, data[0]);
    }
    //****Function SME-POPUP */
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

    //****Function SME-POPUP */
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

        // if (e.element.id == 'tablelist') {
        //   const toIndex2 = e.toIndex;
        //   const fromIndex2 = e.fromIndex;

        //   this.tabulatedFieldList.splice(fromIndex2, 1);
        //   this.tabulatedFieldList.splice(toIndex2, 0, e.itemData);

        //   this.tabulatedFieldList.forEach(e => {
        //     var index2 = this.tabulatedFieldList.indexOf(e);
        //     e.sequence = index2 + 1;
        //   });
        //   this.updateTableSequence();
        // }

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
        // customRuleValidations


    }





    //****Function SME-POPUP */
    changevalidationParamterValue(index, data, e) {
        if (this.selectedValidations.length > 0) {
            let paramvalindex = this.selectedValidations.findIndex(x => x.id == data.id && x.fieldRuleValidationID == data.fieldRuleValidationID);
            let paramvalnoOfParameters = this.selectedValidations[paramvalindex].fieldRuleValidation.noOfParameters - 1;
            let existingParamVal = this.selectedValidations[paramvalindex].parameterValue;

            if (this.selectedValidations[paramvalindex].parameterValue != undefined &&
                this.selectedValidations[paramvalindex].parameterValue != null &&
                this.selectedValidations[paramvalindex].parameterValue != '') {
                let result = JSON.parse(existingParamVal);
                result.forEach((item, i) => {
                    if (i + 1 == index) {
                        item.value = e.value;
                    }
                });
                const JSON_string = JSON.stringify(result);
                this.selectedValidations[paramvalindex].parameterValue = JSON_string;
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
                    } else {
                        savingparamjson = savingparamjson
                            + ' {"name":' + '\"' + data.fieldRuleValidation.parameterName + '\" ,"value": \"' + e.value + '\"},';
                    }
                }

                savingparamjson = savingparamjson.slice(0, -1);
                savingparamjson = savingparamjson + ']';
                this.selectedValidations[paramvalindex].parameterValue = savingparamjson.toString();
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

    //****Function SME-POPUP */
    getvalidationparametervalue(data, index) {
        let result = [];
        if (data != null && data != undefined && data != '') {
            result = JSON.parse(data);
            return result[index].value;
        }
        else {
            return null;
        }
    }
    //****Function SME-POPUP */

    getValidationparamtername(index, data) {
        if (data != null && data != undefined && data != '') {
            let prmNameArray = data.split(',');
            return prmNameArray[index];
        }
        else {
            return null;
        }
    }
    // added by ashwini on 17-Jan-2020 -- END
    // added on 28-Jan-2020 -- start
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
                        //let changeParamArray = existingParamVal.split(',');

                        // for (let i = 0; i < changeParamArray.length; i++) {
                        //   let validatesplarray = changeParamArray[i].split(':');

                        //   if (i + 1 == changeParamArray.length) {
                        //     if(validatesplarray[1] =='null }]'){
                        //       this.validationstaberror = true;
                        //     }
                        //   }
                        //   else{
                        //     if(validatesplarray[1] =='null'){
                        //       this.validationstaberror = true;
                        //     }
                        //   }
                        // }
                        let result = JSON.parse(existingParamVal);
                        result.forEach((item, i) => {
                            // if(i +1  == index){
                            //   item.value =  e.value;
                            // }
                            if (item.value == '' || item.value == null) {
                                this.validationstaberror = true;
                            }
                        });

                    }


                });


            }
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


    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
    getCaretPos(oField) {
        this.customvalidationmapping.fieldRuleValidation.validationExpression = oField.value;
        if (oField.selectionStart || oField.selectionStart === '0') {
            this.caretPos = oField.selectionStart;
            // alert(this.caretPos);
        }
    }
    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
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
                        //notify('Duplicate Synonym');
                        // Added on 29-Feb-2020 - message style/toast -- start
                        var contmsgVal="Duplicate Synonym";
                        this.displayAlertmessage("F",contmsgVal);
                        //Added on 29-Feb-2020 - message style/toast -- end 
                    }
                });
            }
        }
    }
    //****Function SME-POPUP */
    validateValidationMandatoryFieldValue(eventData) {
        if (eventData.value == '' || eventData.value == null) {
            // this.valOntology.instance.validate().isValid = false;
            this.validationstaberror = true;
            return false;
        }
        else {
            // this.valOntology.instance.validate().isValid = true;
            return true;
        }
    }



    //****Function SME-POPUP */
    validateextractionMandatoryFieldValue(eventData) {
        if (eventData.value == '' || eventData.value == null) {
            this.extractionSequencetaberror = true;
            // this.valOntology.instance.validate().isValid = false;
            return false;
        }
        else {
            // this.valOntology.instance.validate().isValid = true;
            return true;
        }
    }





    //****Function SME-POPUP */
    validateNameCustomRuleEditorPopup(eventData) {
        if (this.customValidationEdits == true) {
            if (eventData.value == '' || eventData.value == null) {
                // var res =  this.valOntology.instance.validate() ;
                // res.isValid = false;
                // res.status = false;
                // this.valOntology.instance.validate().isValid = false;
                return false;
            }
            else {
                // this.valOntology.instance.validate().isValid = true;
                return true;
            }
        }
    }
    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
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
    //****Function SME-POPUP */
    validateFieldMandatoryFieldValue(eventData) {
        if (eventData.value == '' || eventData.value == null) {
            // this.valOntology.instance.validate().isValid = false;
            // this.validationstaberror = true;
            return false;
        }
        else {
            // this.valOntology.instance.validate().isValid = true;
            return true;
        }
    }
    //****Function SME-POPUP */
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


    //****Function SME-POPUP */
    onEnterKeySynonymAdd(e) {
        if (e.event.keyCode == 13) {
            e.event.preventDefault();
            return false;
        }
    }


    onEnterKeyCustomSearch(e) {
        if (e.event.keyCode == 13) {
            e.event.preventDefault();
            return false;
        }
    }


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
    // added on 25-Feb-2020 -- start
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
  checkvalidationOnalidation(x){
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
    return boolValid ;
  }

    // #endregion 

    //**************************************** REGION SME POP UP END **************************************************************************************************** */
    onFormSubmitNew($e) {
        this.lookValidationParameterAlerts();
        this.lookExtractionParameterAlerts();
        let result = this.valOntology.instance.validate();

        if (result.isValid && this.validationstaberror != true && this.synonymstaberror != true && this.customstaberror != true
            && this.regularExpressiontaberror != true && this.extractionSequencetaberror != true
            && this.roitaberror != true
        ) {
            this.fieldsynonymslstmodel = [];
            this.saveRegExArray = [];
            this.saveValidationArray = [];
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

            if (this.defaultExtractValidations.length > 0) {
                var savevExtractvalidation = this.defaultExtractValidations.filter(d => d.id > 0);
                if (savevExtractvalidation != null && savevExtractvalidation.length > 0) {
                    savevExtractvalidation.forEach(x => {
                        this.saveValidationArray.push(x);
                    });
                }
            }

            if (this.selectedExtractValidations.length > 0) {
                if (this.selectedExtractValidations != null && this.selectedExtractValidations.length > 0) {
                    let i = 0;
                    this.selectedExtractValidations.forEach(x => {
                        //i = i + 1;  // commented on 25-Feb-2020
                        //x.methodSequenceId = i; // commented on 25-Feb-2020
                        this.saveValidationArray.push(x);
                    });
                }

            }

            // Add deleted mapped 
            this.saveRegExArray = this.selectedExpressions;
            if (this.defaultExpressions.length > 0) {
                var saveexpression = this.defaultExpressions.filter(d => d.id > 0);
                if (saveexpression != null && saveexpression.length > 0) {
                    saveexpression.forEach(m => {
                        this.saveRegExArray.push(m);
                    });
                }
            }

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
                }

                //const docfield = this.formDto(this.documentfieldmodel, this.getSynonymsArray, this.saveValidationArray, this.saveRegExArray);
                const docfield = this.formDto(this.documentfieldmodel, this.fieldsynonymslstmodel, this.saveValidationArray, this.saveRegExArray);
                const post$ = this.service.postAll('OntologyApi/SaveOntologyDetail', docfield);
                const attribute$ = this.getdocumentfieldlistTesting$(this.formsearchfilterDto()).pipe(map(x => { this.docFieldlist = x; }));
                const final$ = post$.pipe(concat(attribute$));
                final$.subscribe(
                    (data: any) => {
                        if (data['result'].value != "Field name already exists") {

                            if (data != undefined) {
                                // Invoke the save for ROI Marking section depending on the doctypefieldmappingid returned value
                                if (data.docFieldMappingId) {
                                    this.roiParameters.docTypeFieldMappingID = data.docFieldMappingId;
                                    this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
                                    this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
                                    this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
                                    this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
                                    if (this.isROIModified == true) { // Added the if check on 08th Feb 2020 to avoid unnecessary save of ROI
                                        this.saveRectangleROI();
                                    }
                                }
                                // end of save ROI Marking
                                this.popupVisible = false;

                            }
                            this.clearAllObjectMode();
                        }
                        //notify(data['result'].value); // code commented on 29-feb-2020
                        // Added on 29-Feb-2020 - message style/toast -- start
                        var contmsgVal=" ";
                        this.displayAlertmessage("S",data['result'].value);  
	                    //Added on 29-Feb-2020 - message style/toast -- end 
                    //}, err => { notify('Error SME Popup'); } // commented on 29-feb-2020
                }, err => { 
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal="Error SME Popup";
                    this.displayAlertmessage("F",contmsgVal);                   
                    //Added on 29-Feb-2020 - message style/toast -- end 
                 }
                );
            } else {
                if (this.docTypeTable.id > 0) {
                    this.documentfieldmodel.documentTypeTableId = this.docTypeTable.id;
                    this.documentfieldmodel.documentTypeTableDesc = this.docTypeTable.description;
                    this.documentfieldmodel.documentTypeTableName = this.docTypeTable.name;
                }


                //const docfield = this.formDto(this.documentfieldmodel, this.getSynonymsArray, this.saveValidationArray, this.saveRegExArray);
                const docfield = this.formDto(this.documentfieldmodel, this.fieldsynonymslstmodel, this.saveValidationArray, this.saveRegExArray); // Modified on 20-Jan-2020
                // const docfield = this.formDto(this.documentfieldmodel);
                const put$ = this.service.put('OntologyApi/updateOntologyDetail', docfield);
                //const attribute$ = this.getdocumentfieldlistTesting$(this.formsearchfilterDto()).pipe(map(x => { this.docFieldlist = x; }));
                //const final$ = put$.pipe(concat(attribute$));
                put$.subscribe(
                    (data: any) => {
                        if (data['result'].value != "Field name already exists" && data['result'].value != 'Validations are used in processed documents') {
                            if (data != undefined) {
                                // Invoke the save for ROI Marking section depending on the doctypefieldmappingid returned value
                                if (data.docFieldMappingId) {
                                    this.roiParameters.docTypeFieldMappingID = data.docFieldMappingId;
                                    this.roiParameters.fieldName = this.documentfieldmodel.fieldName;
                                    this.roiParameters.documentSubTypeID = this.documentfieldmodel.documentSubTypeID;
                                    this.roiParameters.isAnchor = this.documentfieldmodel.isAnchor;
                                    this.roiParameters.isTabularField = this.documentfieldmodel.isTabularField;
                                    if (this.isROIModified == true) { // Added the if check on 08th Feb 2020 to avoid unnecessary save of ROI
                                        this.saveRectangleROI();
                                    }
                                }
                                this.popupVisible = false;
                            }
                            this.clearAllObjectMode();
                        }
                        // end of save ROI Marking
                        //notify(data['result'].value); // commented on 29-Feb-2020
                            // Added on 29-Feb-2020 - message style/toast -- start
                            var contmsgVal=data['result'].value;;
                            this.displayAlertmessage("S",contmsgVal);
                            //Added on 29-Feb-2020 - message style/toast -- end 

                    //}, err => { notify('Error updateOntologyDetail'); } // commented on 26-feb-2020
                }, err => { 
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal="Error updateOntologyDetail";
                    this.displayAlertmessage("F",contmsgVal);
                    //Added on 29-Feb-2020 - message style/toast -- end 
                 }
                );
            }

        }

        else {
            //notify("Please fill valid values in error tab");
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Please fill valid values in error tab";
            this.displayAlertmessage("F",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }


    }




    getURLDetails(URLLink) {

        var URLDetails = URLLink.split("?");

        var UrlName = URLDetails[0];
        UrlName = "/" + UrlName;

        var QueryDetails = [];
        QueryDetails = URLDetails[1].split("&");

        //Store query string para
        var queryParameters = [];
        $.each(QueryDetails, function (key, value) {
            queryParameters.push([key, value]);
        });


        var parameter = "";
        $.each(queryParameters, function (key, value) {
            var eachParaDetails = value[1].split("=");
            var keyValuePair = "'" + eachParaDetails[0] + "'" + ":" + eachParaDetails[1];
            if (parameter == "")
                parameter = keyValuePair;
            else
                parameter = parameter + "," + keyValuePair
        });

        // alert("parameter:"+parameter);

        //this.router.navigate(['/Document-Monitor'], { queryParams: { parameter } });
    };


    backToPreviousURL() {
        try {

            var checkpreviousURL = this.previousUrl.toLowerCase().replace("-", "").replace("/", "");
            if (checkpreviousURL == "operationalmanager") {
                var URLDetails = this.previousUrl.split("?");
                var UrlName = URLDetails[0];
                UrlName = "/" + UrlName;
                this.router.navigate([UrlName]);
            }
            else {
                var Para_Documenttype = this.getUrlParameter('documenttype', this.previousUrl);
                var Para_Documentsubtype = this.getUrlParameter('documentsubtype', this.previousUrl);
                var Para_Fromdate = this.getUrlParameter('fromdate', this.previousUrl);
                var Para_Todate = this.getUrlParameter('todate', this.previousUrl);
                var urlarray = this.previousUrl.split('/');
                var menuName = urlarray[urlarray.length - 1];
                this.getURLDetails(menuName);

                var URLDetails = menuName.split("?");
                var UrlName = URLDetails[0];
                UrlName = "/" + UrlName;
                // alert("UrlName="+UrlName);
                this.previousUrl = "";

                this.router.navigate([UrlName], {
                    queryParams: {
                        'documenttype': Para_Documenttype, 'documentsubtype': Para_Documentsubtype,
                        'fromdate': Para_Fromdate, 'todate': Para_Todate
                    }
                });
            }
            //this.router.navigate(['/Document-Monitor'], { queryParams: { 'documenttype': '1', 'documentsubtype': '1','fromdate': '2019-12-01' ,'todate': '2019-12-31'  } });
        }
        catch{
            //console.log("Error while redirecting to Back URL");
        }
    }
    //-----------------------------------End Send user to back URL if redirect from another module

    // Method added to reset the values of the variables used to display pop-over on click
    onHidden(eventData) {
        this.fieldAnimationOptionsVisible = 0;
        this.togglePopupWindowDropdown = 0;
        this.currentSelectedDocumentExtractionDid = 0;
    }

    //---------------------------------Added by Sheetal---------------------------------
    //create dyanamic class which is used for validation for column value
    onCellPrepared(e) {
        // added on 11-Jan-2020 to hide the trash icon -- start
        if (e.rowType === "data" && e.column.command === "edit") {
            var isEditing = e.row.isEditing
            if (isEditing) {
                e.cellElement.querySelector(".dx-icon-trash").remove();
            }
        }
        // added on 11-Jan-2020 to hide the trash icon -- end

        if (e.rowType === "data") {
            // e.cellElement.className += " validationclass" + e.rowIndex + e.columnIndex;          

            if (e.data["RowValidation"] != undefined) {
                var columnValidationStatus = e.data["RowValidation"][e.columnIndex];
                if (columnValidationStatus == "F") {
                    // e.cellElement.className += " invalidcell";
                    e.cellElement.className += " price-active";
                }
                else if (columnValidationStatus == "T") {
                    e.cellElement.className += " priority-status Low";
                }
                else {
                    e.cellElement.className += "";
                }
            }

        }
    }

    //need to check set foucus functionality
    onFocusedCellChanged(e) {
        //alert("onFocusedCellChanged");

        // var columnValidationStatus = e.row.data.RowValidation[e.columnIndex];
        // if (columnValidationStatus == "F") {
        //     // e.cellElement.className += " invalidcell";
        //     e.cellElement.addClass("priority-status Low");
        // }
        // else {
        //     // e.cellElement.addClass("priority-status Low");     
        // }
    }

    replaceChar(origString, replaceChar, index) {
        // replaceChar="T" ;//for validation
        let firstPart = origString.substr(0, index);

        let lastPart = origString.substr(index + 1);

        let newString =
            firstPart + replaceChar + lastPart;

        return newString;
    }

    // //used for cell changing event to validate the enter column data
    // onEditorPreparing(event): void {

    //     //https://supportcenter.devexpress.com/Ticket/Details/T641866/dxdatagrid-how-to-handle-the-valuechanged-event-handler-of-a-default-editor
    //     var selectedTableColumn = this.columnName;
    //     var columnName: any;

    //     var columnValue: any;
    //     var checkValidationForField = this.TableFileds;
    //     var that = this;

    //     if (event.parentType == 'dataRow') {
    //         var onValueChanged = event.editorOptions.onValueChanged;

    //         //row index start from 0 and we are insertinmg rowNumber from 1 into DB
    //         // var clcikRowIndex=event.row.dataIndex+1;
    //         //this.GetSelectedRowCellData(selectedTableColumn,that.TempArray,event.row.dataIndex);

    //         event.editorOptions.onValueChanged = function (args) {
    //             // event.editorOptions.onFocusOut = function(args) {  
    //             onValueChanged.apply(this, arguments);

    //             // your custom code here                 
    //             columnName = event.caption;
    //             columnValue = args.value;
    //             //alert("columnName==" + columnName + "$$$ columnValue=" + columnValue);            

    //             var fieldObject = checkValidationForField.filter(x => x.fieldName == event.caption);
    //             console.log("fieldObject" + fieldObject);

    //             let objFieldValidationInputModel = that.convertFieldValidationInputModel(fieldObject[0].docTypeFieldMappingId, 0, columnValue);
    //             that.invokeValidationForSpecificFields(objFieldValidationInputModel).subscribe(validationOutput => {

    //                 var prevRowValidationStatus = that.TempArray[event.row.rowIndex]["RowValidation"];


    //                 if (validationOutput.overAllValidationStatus == false) {

    //                     //cell color change https://codepen.io/anon/pen/xdZzxb?editors=1010
    //                     //  args.component.cellValue(args.rowIndex, "Red", args.value);

    //                     // commented to check yuge css
    //                     // var newClassName = "validationclass" + event.row.rowIndex + event.index;
    //                     // $("." + newClassName).css({ color: "white", backgroundColor: "Red" });                     

    //                     // args.event.currentTarget.className += newClassName;    

    //                     var currentRowValidation = that.replaceChar(prevRowValidationStatus, "F", event.index);
    //                     that.TempArray[event.row.rowIndex]["RowValidation"] = currentRowValidation;


    //                     //store validation in temp array                       
    //                     var actualRownumber = event.row.rowIndex + 1;
    //                     var cellNumber = event.index;
    //                     // that.CreateTableCellValidationModel(actualRownumber, cellNumber, 0, fieldObject[0].docTypeFieldMappingId, columnValue, "F");

    //                     notify("Please enter valid column value");

    //                 }
    //                 else {

    //                     //Column value is validated   //do nothing  

    //                     var currentRowValidation = that.replaceChar(prevRowValidationStatus, "T", event.index);
    //                     that.TempArray[event.row.rowIndex]["RowValidation"] = currentRowValidation;

    //                     var actualRownumber = event.row.rowIndex + 1;
    //                     var cellNumber = event.index;
    //                     //  that.CreateTableCellValidationModel(actualRownumber, cellNumber, 0, fieldObject[0].docTypeFieldMappingId, columnValue, "T");


    //                 }
    //             });
    //         } //end of event.editorOptions.onValueChanged 

    //         // event.editorOptions.onFocusOut = function(args) {  
    //         //     //Execute your code here  
    //         //     var RowValidationStatus = that.TempArray[event.row.rowIndex]["RowValidation"];
    //         //     that.TempArray[event.row.rowIndex]["RowValidation"] = RowValidationStatus;
    //         // }  

    //         //  that.dataGridTable.instance.refresh();
    //     }

    // }


    // convert selected Row data into Textbox for validtaion
    GetSelectedRowCellData(columnName, tableDataSource, rowNumber, tableFileds) {

        this.focusedRowKey = rowNumber; //to fouce/higlhlight the selected row
        this.lstSelectedRowCellData = [];

        //rowNumber is from DB which is giving issue for delete row then next prev
        const rowDataResult = tableDataSource.filter(x => x.RowNumber == rowNumber)[0];

        // pass rowindex as rownumber to check  delete row then next prev
        // const rowDataResult = tableDataSource[rowNumber];

        this.currentTableMaxRow = tableDataSource.length;
        //this.currentTableMaxRow = tableDataSource.length-1; //since check index of temparray for next prev

        this.columnName.forEach(element => {
            //----------------Gte cell value
            var rowCellValue = '';
            var cellValidationStatus = '';
            if (rowDataResult === undefined) {
                rowCellValue = '';
                cellValidationStatus = 'T';
            }
            else {
                rowCellValue = rowDataResult[element];
                cellValidationStatus = rowDataResult.RowValidation.charAt(this.columnName.indexOf(element));
            }

            //Get cell validtaion model
            var tableColumnDetailObj = tableFileds.filter(x => x.fieldName == element)[0];
            var tableColumnValidationDetail = null;
            var cellDocumentTypeFieldId = 0
            if (tableColumnDetailObj === undefined) {
                tableColumnValidationDetail = null;
                cellDocumentTypeFieldId = 0;
            }
            else {
                tableColumnValidationDetail = tableColumnDetailObj.objFieldDetailsViewModel;
                //cellDocumentTypeFieldId = tableColumnDetailObj.documentTypeFieldId; //commented for extraced table validation //26 Feb 2020
                cellDocumentTypeFieldId = tableColumnDetailObj.docTypeFieldMappingId;  //added on 26 Feb 2020
            }


            this.currentTableRow = rowNumber;
            // push item in model
            this.lstSelectedRowCellData.push(
                {
                    rowNumber: rowNumber,
                    cellNumber: this.columnName.indexOf(element),
                    cellName: element,
                    documentExtractionDid: 0,
                    docTypeFieldMappingId: cellDocumentTypeFieldId,
                    fieldValue: rowCellValue,
                    overAllValidationStatus: cellValidationStatus == "T" ? 1 : 0,
                    objFieldDetailsViewModel: tableColumnValidationDetail,
                    tableSequence: this.sequenceNum,
                }
            );
        }
        );

        //Added on  27 Feb 2020
        this.InsertDefaultCellValidationStatusToModel(tableDataSource, rowNumber, tableFileds);
    }

    // Method added to reset the values of the variables used to display pop-over on click

    fieldTableAnimationOptionsVisible: any;
    onTableColumnHidden() {
        this.fieldTableAnimationOptionsVisible = 0;
        // this.fieldAnimationOptionsVisible = 0;
        //this.togglePopupWindowDropdown = 0;
        // this.currentTableSelectedDocumentExtractionDid = 0;
    }
    toggleTableWithAnimationOptions(data) {

        let dataSelectedRow = this.lstSelectedRowCellData.filter(x => x.docTypeFieldMappingId == data)[0]
        if (dataSelectedRow.objFieldDetailsViewModel === undefined) {
            //do nothing
            //notify("Validation model empty");
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Validation model empty";
            this.displayAlertmessage("F",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
        }
        else {
            this.fieldTableAnimationOptionsVisible = data;
        }
        //this.togglePopupWindowDropdown = data;//Reset value of dropdown visibility
        // this.currentSelectedDocumentExtractionDid = data;
    }

    calculatedMaxRow: number = 0;
    getMaximumRowNumberFromDataDource() {
        this.TempArray.forEach(element => {
            if (element.RowNumber > this.calculatedMaxRow) {
                this.calculatedMaxRow = element.RowNumber;
            }
        });
    }

    calculatedMinimumRow: number = 100; //set maximum row number which may present
    getMinimumRowNumberFromDataDource() {
        this.TempArray.forEach(element => {
            if (element.RowNumber < this.calculatedMinimumRow) {
                this.calculatedMinimumRow = element.RowNumber;
            }
        });
    }

    currentTableRow: number;
    currentTableMaxRow: number;
    previousRowData() {

        this.currentTableRow = this.currentTableRow - 1;
        let rowDataExists: any[];

        this.getMinimumRowNumberFromDataDource();

        if (this.calculatedMinimumRow <= this.currentTableRow) {
            //------------------- added to handle delete row

            let checkRowNumberExists = 0;
            while (checkRowNumberExists == 0) {
                rowDataExists = this.TempArray.filter(x => x.RowNumber == this.currentTableRow);
                if (rowDataExists === undefined || rowDataExists.length == 0)
                    this.currentTableRow = this.currentTableRow - 1;
                else
                    checkRowNumberExists = 1;
            }
            //------------------- added to handle delete row

            //this.focusedRowKey=this.currentTableRow; //to fouce/higlhlight the selected row
            this.GetSelectedRowCellData(this.columnName, this.TempArray, this.currentTableRow, this.TableFileds);
        }
        else {
            //notify('previous row data not available for display');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="previous row data not available for display";
            this.displayAlertmessage("F",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
            this.currentTableRow = this.currentTableRow + 1;
        }


        //      if (this.currentTableRow >= 1){ //start from 1st index
        //    // if (this.currentTableRow >= 0) {//start from 0th index
        //         //   //------------------- added to handle delete row
        //         //   let rowDataExists: any[];
        //         //   let checkRowNumberExists = 0;
        //         //   while (checkRowNumberExists == 0) {
        //         //       rowDataExists = this.TempArray.filter(x => x.RowNumber == this.currentTableRow);
        //         //       if (rowDataExists === undefined ||rowDataExists.length==0)
        //         //           this.currentTableRow = this.currentTableRow - 1;
        //         //       else
        //         //           checkRowNumberExists = 1;
        //         //   }
        //         //   //------------------- added to handle delete row


        //         this.GetSelectedRowCellData(this.columnName, this.TempArray, this.currentTableRow, this.TableFileds);
        //     }
        //     else {
        //         notify('Previous row data not available for display');
        //         this.currentTableRow = this.currentTableRow + 1;
        //     }
    }

    //Add New row to table
    addNewRowData() {

        //var lastIndexOfDataSource = this.TempArray.length - 1;
        // var rowNumberInserted = this.TempArray[lastIndexOfDataSource].RowNumber + 1;

        this.currentTableMaxRow = this.currentTableMaxRow + 1;
        this.currentTableRow = this.currentTableMaxRow;

        this.getMaximumRowNumberFromDataDource();

        this.focusedRowKey = this.calculatedMaxRow + 1; //to fouce/higlhlight the selected row

        this.lstSelectedRowCellData.forEach(element => {
            element.rowNumber = this.calculatedMaxRow + 1;
            // element.rowNumber = this.currentTableMaxRow;
            // element.rowNumber = rowNumberInserted; //when need to use index
            element.fieldValue = '';
            element.overAllValidationStatus = 1;
        });

        //this.CreateTableCellValidationModel(rownum, 0, 0, 0, '', '');//create rownumber for validation
        this.TempArray.push(
            {
                RowNumber: this.calculatedMaxRow + 1,
                //RowNumber: this.currentTableMaxRow,
                // RowNumber: rowNumberInserted,//when need to use index
                RowValidation: 'T'
            }
        );

    }



    nextRowData() {

        this.currentTableRow = this.currentTableRow + 1;
        let rowDataExists: any[];

        this.getMaximumRowNumberFromDataDource();

        if (this.currentTableRow <= this.calculatedMaxRow) {
            let checkRowNumberExists = 0;
            while (checkRowNumberExists == 0) {
                rowDataExists = this.TempArray.filter(x => x.RowNumber == this.currentTableRow);
                if (rowDataExists === undefined || rowDataExists.length == 0)
                    this.currentTableRow = this.currentTableRow + 1;
                else
                    checkRowNumberExists = 1;
            }
            //------------------- added to handle delete row

            //this.focusedRowKey=this.currentTableRow; //to fouce/higlhlight the selected row
            this.GetSelectedRowCellData(this.columnName, this.TempArray, this.currentTableRow, this.TableFileds);
        }
        else {
            //notify('Next row data not available for display');
            // Added on 29-Feb-2020 - message style/toast -- start
            var contmsgVal="Next row data not available for display";
            this.displayAlertmessage("F",contmsgVal);
            //Added on 29-Feb-2020 - message style/toast -- end 
            this.currentTableRow = this.currentTableRow - 1;
        }

        //this.TempArray.

        // if (this.currentTableRow <= this.currentTableMaxRow) { //strat for 1st index
        // //if (this.currentTableRow < this.currentTableMaxRow) { //strat for 0th index

        //     // //------------------- added to handle delete row

        //     // let checkRowNumberExists = 0;
        //     // while (checkRowNumberExists == 0) {
        //     //     rowDataExists = this.TempArray.filter(x => x.RowNumber == this.currentTableRow);
        //     //     if (rowDataExists === undefined ||rowDataExists.length==0)
        //     //         this.currentTableRow = this.currentTableRow + 1;
        //     //     else
        //     //         checkRowNumberExists = 1;
        //     // }
        //     // //------------------- added to handle delete row

        //     this.GetSelectedRowCellData(this.columnName, this.TempArray, this.currentTableRow, this.TableFileds);
        // }
        // else {
        //     notify('Next row data not available for display');
        //     this.currentTableRow = this.currentTableRow - 1;
        // }
    }

    //validate column value in textbox
    validateTableCellValue(docTypeFieldMappingId, documentExtractionDid, fieldValue, fieldName, columnNumber, tableSequence, rowNumber) {

        if (fieldValue.trim() != "") {
            let objFieldValidationInputModel = this.convertFieldValidationInputModel(docTypeFieldMappingId, documentExtractionDid, fieldValue);
            this.invokeValidationForSpecificFields(objFieldValidationInputModel).subscribe(validationOutput => {
                if (validationOutput.overAllValidationStatus == false) {
                    this.toggleTableWithAnimationOptions(docTypeFieldMappingId);
                    //notify('Validation execution status failed for ' + fieldName + '. Please correct the field values.');
                    // Added on 29-Feb-2020 - message style/toast -- start
                    var contmsgVal='Validation execution status failed for ' + fieldName + '. Please correct the field values.';
                    this.displayAlertmessage("F",contmsgVal);
                    //Added on 29-Feb-2020 - message style/toast -- end 
                    this.SetRuleExecutionValidationStatusForTableColumn(validationOutput);
                    this.ReflectTextBoxValueToTable(fieldName, fieldValue, columnNumber, 'F', tableSequence, rowNumber);


                    this.CreateTableCellValidationModel(rowNumber, columnNumber, documentExtractionDid, docTypeFieldMappingId, fieldValue, "F", tableSequence);
                }
                else {
                    this.onTableColumnHidden();
                    this.SetRuleExecutionValidationStatusForTableColumn(validationOutput);
                    this.ReflectTextBoxValueToTable(fieldName, fieldValue, columnNumber, 'T', tableSequence, rowNumber);
                    this.CreateTableCellValidationModel(rowNumber, columnNumber, documentExtractionDid, docTypeFieldMappingId, fieldValue, "T", tableSequence);
                }
            });
        }
    }

    // on text change validation execution reflect value in table cell
    ReflectTextBoxValueToTable(fieldName, fieldValue, columnNumber, ValidationStaus, tableSequence, rowNumber) {

        // //---------------need when to use index
        // this.TempArray[this.currentTableRow].fieldName=fieldValue;
        // var prevRowValidationStatus = this.TempArray[this.currentTableRow].RowValidation;
        // var currentRowValidation = this.replaceChar(prevRowValidationStatus, ValidationStaus, columnNumber);
        // this.TempArray[this.currentTableRow].RowValidation=currentRowValidation;

        ////update text change value in table cell value
        this.TempArray.forEach(element => {
            //if (element.RowNumber == this.currentTableRow) {
            if (element.RowNumber == rowNumber) {
                element[fieldName] = fieldValue;
                var prevRowValidationStatus = element["RowValidation"];

                var currentRowValidation = this.replaceChar(prevRowValidationStatus, ValidationStaus, columnNumber);
                element["RowValidation"] = currentRowValidation;
            }
        });


        if (this.tblSource == 'Ontology') {
            // to mainatain table wise validation status
            this.tblOntology.forEach(element => {
                if (element.tableSequence == tableSequence) {
                    element.tableData = JSON.stringify(this.TempArray);
                }
            });
        }
        else {
            // to mainatain table wise validation status
            this.tblExtraction.forEach(element => {
                if (element.tableSequence == tableSequence) {
                    element.tableData = JSON.stringify(this.TempArray);
                }
            });
        }
    }

    // Reflect validtaion icon status to textbox value
    SetRuleExecutionValidationStatusForTableColumn(validationOutput: ManualHandlingValidationModel) {
        if (validationOutput.fieldValidation != null && validationOutput.fieldValidation != undefined) {
            this.lstSelectedRowCellData.forEach(
                element => {
                    validationOutput.fieldValidation.forEach(
                        elementValidation => {
                            if (elementValidation.docTypeFieldMappingId == element.docTypeFieldMappingId) {

                                if (elementValidation.validationStatus == false) {
                                    // element.ruleExecutionStatus = false;
                                    element.overAllValidationStatus = 0;

                                    //set validation status in poup-----------------
                                    element.objFieldDetailsViewModel.lstFieldRejectionModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter
                                                (item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                    //&& elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID
                                                ); // added documentExtractionDid to uniquely identify the validation method for multiple suspects

                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue; //as per new rule execution method
                                            if (elementPopupValidation.docValidationRuleId == 0) { // added if condition to resolve the issue of runtime validation status set when docValidationRuleId is present
                                                elementPopupValidation.docValidationRuleId = -99; //TEMPORRAY ASSIGNED id                                  
                                            }
                                        }
                                    );
                                    element.objFieldDetailsViewModel.lstCustomRuleValidationModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                // && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID
                                            ); // added documentExtractionDid to uniquely identify the validation method for multiple suspects

                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                            if (elementPopupValidation.docValidationRuleId == 0) {  // added if condition to resolve the issue of runtime validation status set when docValidationRuleId is present
                                                elementPopupValidation.docValidationRuleId = -99; //TEMPORRAY ASSIGNED id      
                                            }
                                        }
                                    );
                                    //-----------------------set validation status in poup End-----
                                }
                                else {
                                    //element.ruleExecutionStatus = true;
                                    element.overAllValidationStatus = 1;

                                    //set validation status in poup-----------------------
                                    element.objFieldDetailsViewModel.lstFieldRejectionModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                // && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID
                                            ); // added documentExtractionDid to uniquely identify the validation method for multiple suspects

                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                        }
                                    );
                                    element.objFieldDetailsViewModel.lstCustomRuleValidationModel.forEach(
                                        elementPopupValidation => {
                                            var currentFieldValidationDetail = elementValidation.listMethodModel.filter(item => item.documentFieldValidationID == elementPopupValidation.documentFieldValidationId
                                                // && elementValidation.documentExtractionDid == elementPopupValidation.documentExtractionDID
                                            ); // added documentExtractionDid to uniquely identify the validation method for multiple suspects

                                            if (currentFieldValidationDetail != null && currentFieldValidationDetail.length > 0)
                                                elementPopupValidation.isValid = currentFieldValidationDetail[0].isValidValue;
                                        }
                                    );
                                    //--------------------------set validation status in poup End-------
                                }
                            }
                        }

                    );
                }
            );
        }
    }



    // check table cell validtaion done or not on save button
    CheckValidationForTableCell() {

        var tablevaldiationStatus = true;
        this.lstTableCellValidationModel.forEach(cellValidation => {

            if (cellValidation.cellValidationResult == "F") {
                tablevaldiationStatus = false;
                //this.tableFieldSummary.filter(x=>x.)
                //notify("Table Cell valdiation failed ");
                // Added on 29-Feb-2020 - message style/toast -- start
                var contmsgVal="Table Cell valdiation failed";
                this.displayAlertmessage("F",contmsgVal);
	            //Added on 29-Feb-2020 - message style/toast -- end 
                return tablevaldiationStatus;
            }
        }
        );
        return tablevaldiationStatus;
    }

    //Save cell wise validtaion for row and table
    CreateTableCellValidationModel(rownum, cellNumber, documentExtractionDid, docTypeFieldMappingId, fieldValue, cellValidationResult, tableSequence) {
        var objTableDetail = this.tabulatedFieldList.filter(x => x.tableSequence == tableSequence);
        var tableName = objTableDetail[0].table;

        let data = this.lstTableCellValidationModel.filter(x => x.rowNumber === rownum && x.cellNumber == cellNumber && x.tableSequence == tableSequence);
        if (data == null || data.length == 0) {
            this.lstTableCellValidationModel.push(
                {
                    rowNumber: rownum,
                    cellNumber: cellNumber,
                    documentExtractionDid: documentExtractionDid,
                    docTypeFieldMappingId: docTypeFieldMappingId,
                    fieldValue: fieldValue,
                    cellValidationResult: cellValidationResult,
                    tableSequence: tableSequence,
                    tableName: tableName
                }
            );
        }
        else {
            this.lstTableCellValidationModel.forEach(cellValidation => {

                if (cellValidation.rowNumber == rownum && cellValidation.cellNumber == cellNumber) {
                    cellValidation.documentExtractionDid = documentExtractionDid;
                    cellValidation.docTypeFieldMappingId = docTypeFieldMappingId;
                    cellValidation.fieldValue = fieldValue;
                    cellValidation.cellValidationResult = cellValidationResult;
                    cellValidation.tableSequence = tableSequence;
                    cellValidation.tableName = tableName;

                }
            });
        }
    }

    // Insert Default validation cell status to ValidtaionModel while displaying table
    InsertDefaultCellValidationStatusToModel(tableDataSource, rowNumber, tableFileds) {


        tableDataSource.forEach(rowelement => {

            var rowNumber = rowelement.RowNumber;

            this.columnName.forEach(element => {
                //----------------Get cell value
                var rowCellValue = '';
                var cellValidationStatus = '';
                if (rowelement === undefined) {
                    rowCellValue = '';
                    cellValidationStatus = 'T';
                }
                else {
                    rowCellValue = rowelement[element];
                    cellValidationStatus = rowelement.RowValidation.charAt(this.columnName.indexOf(element));
                }

                //Get cell validtaion model
                var tableColumnDetailObj = tableFileds.filter(x => x.fieldName == element)[0];

                var celldocTypeFieldMappingId = 0
                if (tableColumnDetailObj === undefined) {
                    celldocTypeFieldMappingId = 0;
                }
                else {
                    celldocTypeFieldMappingId = tableColumnDetailObj.docTypeFieldMappingId;
                }

                this.CreateTableCellValidationModel(rowNumber, this.columnName.indexOf(element), 0, celldocTypeFieldMappingId, rowCellValue, cellValidationStatus, this.sequenceNum)
            }
            );

        });
       
    }

     //save table and HeaderFields data  in same API
     SaveHeaderAndTableFields(headerFieldSaveData,isForwarded) {     
        const values = this.fomrSaveModel(headerFieldSaveData, this.docFieldlist,isForwarded)
        this.invokePostSaveTableHeaderData(values).subscribe(data => {        
            notify("Document modifications done successfully. Loading next document for processing.");
            this.clearAllGlobalObjects();
            this.tableQualityChecks = [];
            this.readDataForDisplayModule();
        }, err => { notify('Error occurred while saving field data modifications.') });

    }
    ForwardHeaderAndTableFields(headerFieldSaveData,isForwarded) {     
        const values = this.fomrSaveModel(headerFieldSaveData, this.docFieldlist,isForwarded)
        this.invokePostSaveTableHeaderData(values).subscribe(data => {  
            notify("Document modifications done successfully and forwarded to Veto. Loading next document for processing.");
            this.clearAllGlobalObjects();
            this.tableQualityChecks = [];
            this.readDataForDisplayModule();
        }, err => { notify('Error occurred while forwarding field data modifications.') });

    }

    // Method to make the post save API call for table fields and header fields
    invokePostSaveTableHeaderData(data: any) {
        const result$ = this.service.postAll('ManualHandlingApi/SaveHeaderAndTableFields', data).pipe(map(x => x));
        return result$;
    }

    //---------------------------------End Added by Sheetal---------------------------------

    // added on 13-Feb-2020 -- start
    // Get Configurable "Forward to Veto" option 
    ForwardtoVetoOption() {
        var that = this;
        this.getForwardtoVetoOption().subscribe(data => {
            that.IsForwardtoVetoOption = data.checkStatus;
            if (this.IsForwardtoVetoOption === "Checked") {
                this.IscheckForwardtoVetoOption = true;
            }
            else {
                this.IscheckForwardtoVetoOption = false;
            }
        });
    }
    getForwardtoVetoOption() {
        const server$ = this.service.getSingle('ManualHandlingApi/GetForwardtoVeto').
            pipe(map((data: any) => { return data; }));
        return server$;
    }
    // added on 13-Feb-2020 -- end

    // Added on 24th Feb 2020 - Image Viewer Select Text Interactive Mode => Trial and Error method
    // for click and capture, start rubber band interactive mode
    private setSelectTextInteractiveMode(): void {
        var selectItemsMode = <lt.Controls.ImageViewerSelectItemsInteractiveMode>this.documentViewerMH.view.imageViewer.interactiveModes.findById(lt.Controls.ImageViewerInteractiveMode.selectItemsModeId);

        if (selectItemsMode == undefined || selectItemsMode == null) {
            selectItemsMode = new lt.Controls.ImageViewerSelectItemsInteractiveMode();
        }
        this.documentViewerMH.view.imageViewer.interactiveModes.add(selectItemsMode);
        this.documentViewerMH.view.imageViewer.defaultInteractiveMode = selectItemsMode;
        selectItemsMode.set_borderColor("blue");
        selectItemsMode.set_borderThickness(2);
        selectItemsMode.set_borderStyle("solid");
        selectItemsMode.selectionMode = 1;
        //selectItemsMode.rubberBandStarted.add((e: lt.Controls.ImageViewerRubberBandEventArgs) => { alert("test"); });
        //selectItemsMode.rubberBandStarted.add(new alert("test"));

        //var service =  new lt.Controls.InteractiveService();

        var service = lt.Controls.InteractiveService.create(null, this.documentViewerMH.view.imageViewer.interactiveService.eventsSource,
            this.documentViewerMH.view.imageViewer.interactiveService.eventsSource);

        service.add_move((e: lt.Controls.InteractiveEventArgs) => this.selectItemsModeCompleted(e));
        // var interactive = new lt.Controls.InteractiveEventArgs;
        // selectItemsMode.rubberBandCompleted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) =>
        //     this.documentViewerMH.view.imageViewer.interactiveService.onMove(interactive));
        // selectItemsMode.rubberBandStarted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) => this.selectItemsModeCompleted(sender, e));
        // selectItemsMode.rubberBandStarted.add((sender: any, e: lt.Controls.ImageViewerRubberBandEventArgs) => selectItemsMode.onRubberBandStarted(e));;
        selectItemsMode.autoItemMode = lt.Controls.ImageViewerAutoItemMode.autoSet;
        // var selectMode = <lt.Document.Viewer.DocumentViewerSelectTextInteractiveMode>this.documentViewerMH.interactiveModes.findById(lt.Document.Viewer.DocumentViewerSelectTextInteractiveMode);
    }

    selectItemsModeCompleted(e: lt.Controls.InteractiveEventArgs) {
        alert("This is test");
    }
    // added on 26-Feb-2020 -- hotkeys start
    HotkeysPopupVisible = false;
    HotkeysPopup() {
        this.HotkeysPopupVisible = true;

    }
    // Added on 29-Feb-2020 - message style/toast -- start
    displayAlertmessage(chkmsgVal,contmsgVal){
        debugger;
        var that=this;
        that.alertmessage=true;
        that.chkmsg=chkmsgVal;
        that.contmsg=contmsgVal;
        setTimeout(() => { that.alertmessage = false; }, 5000);
    }
    //Added on 29-Feb-2020 - message style/toast -- end 
    // added on 26-Feb-2020 --end 

}

export class TableJsonForAPIModel {
    TableDataText: string;
    constructor(TableDataText) {
        this.TableDataText = TableDataText;
    }
}