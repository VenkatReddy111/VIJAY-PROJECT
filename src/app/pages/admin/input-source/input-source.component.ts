
import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxTabPanelModule, DxTextBoxModule, DxCheckBoxModule, DxTemplateModule, DxDataGridModule, DxSelectBoxModule, DxTooltipModule, DxFileUploaderModule, DxDataGridComponent, DxFormModule, DxPopupModule, DxPopupComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import PerfectScrollbar from 'perfect-scrollbar';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { map } from 'rxjs/operators';
import { OutputTransformation, OutputDestinationModel } from '../../../models/outputdestination.module';
import { of } from 'rxjs';
import { InputSourceModel, Parameter, InputSourceTypeModel } from 'src/app/models/inputsource.module';
import { Customer } from 'src/app/models/customer.module';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/message.service';
import { debug } from 'util';

@Component({
    selector: 'app-input-source',
    templateUrl: './input-source.component.html',
    styleUrls: ['./input-source.component.scss']
})

export class InputSourcComponent extends ComponentbaseComponent implements OnInit {

    customer: any;
    documettype: any;
    documentsubtype: any;
    outputfileFormat: any;
    CSVDelimiter: any;
    XMLEncodingType: any;
    openAddEditPopup = false;
    //documenttransformation: any;
    documenttransformationtabular: any;
    documenttransformationNormal: any;
    unsavedoutputTransformationRow: OutputTransformation;
    documentoutputModel: OutputDestinationModel;
    inputsourceType: any;
    inputsourceName: any;
    isoutputformatTypeCSV = true;
    isoutputformatTypeXML = true;
    documentoutputList: any;
    OutputSourceField: OutputDestinationModel;
    loadIndicatorVisible: boolean;
    labelCaption: string = "Next";
    paramarrayList: any[];
    selectedFields: any;
    selectedTabularFields: any;
    fileFilterArry: any[];

    passwordMode: string;
    passwordButton: any;
    StrfileFormat:string;
    IsEmail:Boolean;
    showMultiDocSupported: boolean = false;

    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @ViewChild('grid', { static: false }) dxgrid: DxDataGridComponent;

    @ViewChild(DxPopupComponent, { static: false }) popup: DxPopupComponent;
    @ViewChild('valGroupInputSource', { static: false }) valGroupInputSource: DxValidationGroupComponent;
    @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
    value: any[] = [];

    //Variable to maintain delete state of rows
    selectedItemKeys: any[] = [];
    tempDeleteArray: ArrayStore;

    //Variable to show/hide custom buttons
    deleteBtn: boolean = false;
    editBtn: boolean = false;
    addBtn:boolean=true;
    
  

    DocumentOutputFieldSettingListArray: any = [];
    // cancelButtonOptions = {
    //   text: "Cancel",

    // }

    // createButtonOptions = {
    //   text: "Create",
    //   onClick: function () {

    //   }
    // }

    //Input Source Parameter declare 

    inputSourceField: InputSourceModel;
    inputSourceParameterField: Parameter;
    documenttypelist: any;
    inputSourcedocumentsubtype: any;
    customerList: any;
    filefilterdata = [{ name: ".pdf" }, { name: ".img" }, { name: ".jpg" }, { name: ".png" }, { name: ".tiff" }, {name:".bmp"},{ name: ".zip" }];
    inputSourceType: any;
    inputsourceList: any;
    addInputSourcePopop: boolean = false;
    Deletepopup: boolean=false;
    parameterType: any;
    parameterListArray: any[];
    inputSourceselectedItemKeys: any[] = [];
    inputSourcetempDeleteArray: ArrayStore;
    //input Source Parameter End
    
    isInputDetailsError : boolean = false;
    isStatusVisible : boolean = false;
    isExportButtonColVisible : boolean = false;
    DeleteOutPutpopup: boolean;
    InputSourceListArray: any[];
    routerUrl : any = "";
    isCalledFromExport : boolean = false;
    titleString : string = "I/O Locations";
    constructor(private router: Router, private service: DataService, private message: MessageService) {
        super('I/O Location', 'IOsources', message, service, environment.apiBaseUrl);
        this.passwordMode = 'password';
     this.passwordButton = {
         icon: "assets/images/view.png",
         type: "default",
         onClick: () => {
             this.passwordMode = this.passwordMode === "text" ? "password" : "text";
         }
     };
     
        //To delete rows
        this.tempDeleteArray = new ArrayStore({
            data: this.sourceDashboard
        });
        this.BindinputSource$();
        this.routerUrl =  this.router.url;
        if ( router.url != '/input-source')
        {
            this.isCalledFromExport = true;
            this.titleString = "Export";
            this.smeTabs = ["Output"];
            this.activateTabContent(this.smeTabs[0]);
            this.isStatusVisible = true;
            this.isExportButtonColVisible = true;

        }
        else{
            this.isStatusVisible = false;
            this.isExportButtonColVisible = false;
        }
    }
    
    ngOnInit() {

        this.documentoutput().subscribe(data => {
            this.documentoutputList = data;
            this.selectedFields = [];
            this.selectedTabularFields = [];
        });
        this.selectedItems = new Map<string, Array<any>>();
        // this.users
        this.dropdownList = [
            { "id": 1, "itemName": "jpg" },
            { "id": 2, "itemName": "png" },
            { "id": 3, "itemName": "pdf" },
            { "id": 4, "itemName": "other" }
        ];

        this.selectedItems[0] = [
        ];

        this.dropdownSettings = {
            singleSelection: false,
            text: "Select file type",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: "custom-multiselect"
        };

      


        this.documentoutputModel = this.initDocumentoutputModel();
        this.unsavedoutputTransformationRow = this.initDocumentTransformationModel();
        this.documentoutput().subscribe(data => {

            this.documentoutputList = data;
        });

        this.customerlist().subscribe(data => {
            this.customer = data;

        });

        this.documentlist().subscribe(data => {
            this.documettype = data;
        });

        this.inputSourceTypeList().subscribe(data => {
            this.inputsourceType = data;
        });

        this.documentsubtype = [];
        this.inputsourceName = [];

        this.outputfileformat$(12).subscribe(data => {
            this.outputfileFormat = data;
        });
    }

    initDocumentoutputModel() {
        return new OutputDestinationModel("", null, "", null, null, 0, null, 0, null, "", "", "", null, "", "", "", 0, "", 0);
    }

    initDocumentTransformationModel() {
        return new OutputTransformation(0, 0, "", "", 0, 0, [], 0, 0, 0, 0);
    }



    //Input SourceCode Started 
    initinputSourceFieldModel() {
        return new InputSourceModel(0, null, null, "", "", false, true, "", "", null, "", null, "");
    }
    initinputSourceParameterFieldModel() {
        return new Parameter(0, 0, 0, "", "", "", 0, false, true, false, "", []);
    }

    BindinputSource$() {
        this.inputSourceField = this.initinputSourceFieldModel();
        this.inputSourceParameterField = this.initinputSourceParameterFieldModel();
        this.Getdocumenttypelist().subscribe(data => { this.documenttypelist = data; });
        this.customerList$().subscribe(data => { this.customerList = data; });

        this.inputSourceList$().subscribe(data => {

            this.inputsourceList = data;
        });
        this.inputSourceType$().subscribe(data => { this.inputSourceType = data; });


        this.inputSourcedocumentsubtype = null;
    }

    Getdocumenttypelist() {
        const documentlist = this.service.getAll('inputsourceapi/GetDocumentType').pipe(map((data: any[]) => data.map((item: any) => {
            return {
                'id': item.id,
                'name': item.name
            }
        })));
        return documentlist;
    }
    InputSourcedocumentTypeValueChanged(e) {
        
        if(e!=null)
        {
        const sendPrm = '?doctypeid=' + e;
        if (e != null) {
            this.InputSourcegetdrpdocumentsubtypelist$(sendPrm).subscribe(data => {
              

                 this.inputSourcedocumentsubtype = data; 
                });
        } else {
            this.inputSourcedocumentsubtype = null;
        }
    }else
    { this.inputSourcedocumentsubtype = null;
    }
    }
    InputSourcegetdrpdocumentsubtypelist$(sendprm) {
        return this.service.getAll('InputSourceApi/Getdocumentsubtype', sendprm)
            .pipe(map((data: any[]) => data.map((item: any) => {
                return {
                    'documentsubtypeid': item.id,
                    'documentsubtypename': item.name,
                };
            })));
    }
    customerList$() {
        const customer$ = this.service.getAll('inputsourceapi/GetAllCustomers').pipe(map((data: any[]) => data.map((item: any) => {
            return new Customer(
                item.id,
                item.name,
                item.address,
                item.email,
                item.mobileNo,
                item.custCode
            )
        })));
        return customer$;
    }

    inputSourceType$() {
        const inputsourcetype$ = this.service.getAll('inputsourceapi/GetAllInputSourceTypes').pipe(map((data: any[]) => data.map((item: any) => {
            return new InputSourceTypeModel(
                item.id,
                item.name,
                item.isListingAvailable,
                item.isBatchAllowed,
                item.isActive

            )
        })));
        return inputsourcetype$;
    }
    inputSourceList$() {
        const inputsource$ = this.service.getAll('inputsourceapi/GetInputSourcesList').pipe(map((data: any[]) => data.map((item: any) => {
            return new InputSourceModel(
                item.id,
                item.inputSourceTypeId,
                item.customerId,
                item.name,
                item.fileFilter,
                item.isMultiDocInPdf,
                item.isActive,
                item.customerName,
                item.documentType,
                item.documentTypeID,
                item.inputSourceTypeName,
                item.documentSubTypeId,
                item.documentSubTypeName,

            )
        })));
        return inputsource$;
    }
    isMultiDocument(isMulti: boolean) {

        if (isMulti == true) {
            return true;
        } else {
            return false;
        }
    }
    isInputSourceActive(isActive: boolean) {

        if (isActive == true) {
            return true;
        } else {
            return false;
        }
    }
    inputSourceDetailsTabs = [
        'Input details', 'Input type and parameters'
    ]
    openParameterList() {
        this.inputSourceDetailsTabs = [
            'Input details', 'Input type and parameters'
        ]
        this.activateSourecDetailsTab("Input type and parameters");
    }
    InputSourcecustomAddpopup() {
        this.valGroup.instance.reset();
        this.parameterType = [];
        this.openParameterList() 
        // this.inputSourceDetailsTabs = ['Input details'];
         this.activateSourecDetailsTab("Input details")
        this.inputSourceField = this.initinputSourceFieldModel();
        this.inputSourceParameterField = this.initinputSourceParameterFieldModel();
        this.addInputSourcePopop = true;

    }
    SourceTypeChanged(value, id) {
        this.parameterType = [];
        const sourcetypevalue = value == "" ? 0 : value;
        const inputsourceid = id == "" ? 0 : id;
        if (value != null) {
            const parameter$ = this.service.getAll('InputSourceApi/GetParameterInputSource?InputSourceTypeId=' + sourcetypevalue + '&inputSourceid=' + inputsourceid)
                .pipe(map((data: any[]) => data.map((item: any) => {
                    return new Parameter(
                        item.inputSourceParamValueID,
                        item.inputSourceID,
                        item.inputSourceParamID,
                        item.parameterName,
                        item.displayName,
                        item.parameterValue,
                        item.masterID,
                        item.isEncrypted,
                        item.isEditable,
                        item.isSystemDefault,
                        item.parameterValueType,
                        item.masterModel

                    )
                })));

            parameter$.subscribe(data => {
                this.parameterType = data;
            })
        }
    }
    numericOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 46 || charCode > 57)) {
            return false;
        }
        return true;
    }
    formInputSourceDto(data: InputSourceModel) {
        return {
            'Id': data.id,
            'InputSourceTypeId': data.inputSourceTypeId,
            'CustomerId': data.customerId == null ? null : data.customerId,
            'Name': data.name,
            'FileFilter': data.fileFilter !== 'string' ? data.fileFilter.toString() : data.fileFilter,
            'IsMultiDocInPdf': data.isMultiDocInPdf,
            'IsActive': data.isActive,
            'DocumentTypeId': data.documentTypeID,
            'DocumentSubTypeId': data.documentSubTypeId
        }
    }
    
    formInputParameterDto(data: Parametercollection) {

        this.parameterListArray = [];
        for (let i = 0; i < data["length"]; i++) {
            const oB = data[i];
            var custparameter = {
                'InputSourceParamValueID': oB.inputSourceParamValueID,
                'InputSourceID': oB.inputSourceID,
                'InputSourceParamID': oB.inputSourceParamID,
                'ParameterName': oB.parameterName,
                'DisplayName': oB.displayName,
                'ParameterValue': oB.parameterValue,
                'MasterID': oB.masterID,
                'IsEncrypted': oB.isEncrypted

            };
            this.parameterListArray.push(custparameter);

        }
        return this.parameterListArray;

    }

saveInputSource() {
    debugger;
    if(this.validateInputDetailsTab())
    {
        this.isInputDetailsError = false;
        var inputsourcevalue = this.formInputSourceDto(this.inputSourceField);
        var parameterlistvalue = this.formInputParameterDto(this.parameterType);
        var data = { 'InputSourceDocumentTypeVModel': inputsourcevalue, 'inputparametervaluevmodel': parameterlistvalue };
        if (this.inputSourceField.id == 0) {
            const post$ = this.service.postAll('InputSourceApi/SaveInputSource', data);
            post$.subscribe(data => {
                this.BindinputSource$();
                this.addInputSourcePopop = false;
                notify(data['result'].value);
                
                this.addInputSourcePopop = false;
                setTimeout(() => {
                    // this.loadIndicatorVisible = false;
                }, 2000);
            }, err => {
                setTimeout(() => {
                    // this.loadIndicatorVisible = false;
                }, 2000);
                notify(err.toString());
            }
            );
        }
        else {
            const put$ = this.service.put('InputSourceApi/UpdateInputSource', data);
            put$.subscribe(data => {
                this.BindinputSource$();
                this.addInputSourcePopop = false;
                notify(data['result'].value);
                setTimeout(() => {
                    //this.loadIndicatorVisible = false;
                }, 2000);
            }, err => {
                setTimeout(() => {
                    // this.loadIndicatorVisible = false;
                }, 2000);
                notify(err.toString());
            }
            
            );
        }
    }
    else 
    {
        alert("Please make sure you have filled all mandatory fields Input details tab with valid data");
        this.activateSourecDetailsTab("Input details");
        this.valGroupInputSource.instance.validate().isValid;
        this.isInputDetailsError = true;
    }
}



    validateInputDetailsTab()
    {
       
        var retval = true;
       var SourceFolderValue: string;
        var DestinationValue:string;
        var ExceptionValue:string;
        this.parameterListArray = [];
        
        for (let i = 0; i < this.parameterType["length"]; i++)
        {
        
                if(this.parameterType[i].parameterName=="SourceFolder")
                {
                    SourceFolderValue=this.parameterType[i].parameterValue.trim();
                }
                if(this.parameterType[i].parameterName=="ProcessedFolder")
                {
                    DestinationValue=this.parameterType[i].parameterValue.trim();
                }
                if(this.parameterType[i].parameterName=="ExceptionFolder")
                {
                    ExceptionValue=this.parameterType[i].parameterValue.trim();
                }
       }

        if(SourceFolderValue.toLowerCase()==DestinationValue.toLowerCase())
        {
            // notify("validation occured");
            retval =  false; 
        }
        if(SourceFolderValue.toLowerCase()==ExceptionValue.toLowerCase())
        {
            //notify("validation occured");
            retval =  false; 
        }
        if(DestinationValue.toLowerCase()==ExceptionValue.toLowerCase())
        {
            //notify("validation occured");
            retval =  false; 
        }

        //this.parameterType;
      //  var retval = true;

        if (this.inputSourceField.name == null || this.inputSourceField.name.trim().length <= 0)
            retval =  false; 
        if (this.inputSourceField.documentTypeID == null)
            retval =  false;             
        if (this.inputSourceField.documentSubTypeId == null)
            retval =  false;                    
        if (this.inputSourceField.isMultiDocInPdf == null)
            retval =  false;                              
        if (this.inputSourceField.fileFilter == null || this.inputSourceField.fileFilter.length <=0 )
            retval =  false;   
        
        return retval;
    }


    onInputSourceSelectionChanged(event) {
     
        this.inputSourceselectedItemKeys = event.selectedRowKeys;
        this.fileFilterArry = this.inputSourceselectedItemKeys;
        if (event.selectedRowsData.length > 0) {
            this.deleteBtn = true;
            this.editBtn = true;
            this.addBtn=false;
        }
        else {
            this.deleteBtn = false;
            this.editBtn = false;
            this.addBtn=true;
        }
        if (event.selectedRowsData.length > 1) {
            this.editBtn = false;
            this.deleteBtn=true;
            this.addBtn=false;
        }
    }


  
  
    inputSourceEditPopup() {
    
        this.inputSourceField = this.inputSourceselectedItemKeys[0];
        this.inputSourceDetailsTabs = [
            'Input details', 'Input type and parameters'
        ]
        this.activateSourecDetailsTab("Input details")
        this.SourceTypeChanged(this.inputSourceField.inputSourceTypeId, this.inputSourceField.id);

        this.InputSourcedocumentTypeValueChanged(this.inputSourceField.documentTypeID);


        if (typeof this.inputSourceselectedItemKeys[0].fileFilter === 'string') {
            let obj = Object.assign({}, this.inputSourceselectedItemKeys[0]);
            obj.fileFilter = obj.fileFilter.split(',');
            this.inputSourceField = obj;
        }
        this.addInputSourcePopop = true;
    }


    OnValueChangedUpdate(data: any, inputSourceField) {

        const put$ = this.service.put('InputSourceApi/updateStatus', data);
        put$.subscribe(
            data => {
                notify(data['result'].value);
                this.inputSourceList$().subscribe(a => {
                    this.inputsourceList = a;

                });

            }, err => { notify('Error'); }
        );


    }

    OnVlaueChangesActive(status, inputSourceField) {

        var inputsourcevalue = this.formInputSourceDto(inputSourceField);
        inputsourcevalue.IsActive = status ? false : true;
        this.OnValueChangedUpdate(inputsourcevalue, inputSourceField)

    }

    OnVlaueChangesIsMulti(status, inputSourceField) {

        var inputsourcevalue = this.formInputSourceDto(inputSourceField);
        inputsourcevalue.IsMultiDocInPdf = status ? false : true;
        this.OnValueChangedUpdate(inputsourcevalue, inputSourceField)


    }

    formInputSourceDeleteDto(data) {
        this.InputSourceListArray = [];
        for (let i = 0; i < data["length"]; i++) {
            const oB = data[i];
            var inputSourceDataList = {
           'Id': oB.id,
            'InputSourceTypeId': oB.inputSourceTypeId,
            'CustomerId': oB.customerId == null ? null : data.customerId,
            'Name': oB.name,
            'FileFilter': oB.fileFilter !== 'string' ? oB.fileFilter.toString() : oB.fileFilter,
            'IsMultiDocInPdf': oB.isMultiDocInPdf,
            'IsActive': oB.isActive,
            'DocumentTypeId': oB.documentTypeID,
            'DocumentSubTypeId': oB.documentSubTypeId
           
            };
            this.InputSourceListArray.push(inputSourceDataList);

        }
        return this.InputSourceListArray;
       
    }



    //Function to delete rows
    inputSourceDeletePopup() {
        var inputsourceDto = this.formInputSourceDeleteDto(this.inputSourceselectedItemKeys);
       const delete$ = this.service.postAll('InputSourceApi/deleteInputSource', inputsourceDto);
        delete$.subscribe(
      data => {
      notify(data['result'].value);
      this.inputSourceList$().subscribe(data => { this.inputsourceList = data;})}
  );
  this.Deletepopup = false;


  
 
    }
    //inputCode Ended



    smeTabs = [
        'Input', 'Output'
    ]
    transformationsTabs = [
        'Fields', 'Tables'
    ]
    outputSourceDetailsTabs = [
        'Output details', 'Transformations'
    ]

    showTabContent: string = this.smeTabs[0];
    showTransformationsTabContent: string;
    activateTabContent(data) {
        if ( this.routerUrl != '/input-source')
        {
            this.showTabContent = this.smeTabs[0];
        }
        else 
        {
        this.showTabContent = data;
        // this.showTransformationsTabContent = data;  
        }
    }

    activateFieldTabContent(data) {
        this.showTransformationsTabContent = data;
    }


    showSourecDetailsTab: string = this.inputSourceDetailsTabs[0];
    activateSourecDetailsTab(data) {
        this.showSourecDetailsTab = data;
    }

    showOutputSourecDetailsTab: string = this.outputSourceDetailsTabs[0];

    activateOutputSourecDetailsTab(data) {
        if (data == "Transformations") {
            this.labelCaption = "Save"
        }
        else if (data == "Output details") {
            this.labelCaption = "Next"
        }

        this.showOutputSourecDetailsTab = data;
        this.showTransformationsTabContent = this.transformationsTabs[0];


    }


    customAddpopup() {
        this.addInputSourcePopop = true;
    }

    showOutputSourcePopop: boolean = false;
    addOutputSourcePopop() {
        this.documentoutputModel = this.initDocumentoutputModel();
        this.documenttransformationNormal = this.initDocumentTransformationModel();
        this.documenttransformationtabular = this.initDocumentTransformationModel();
        this.showOutputSourcePopop = true;
        this.activateOutputSourecDetailsTab("Output details");

    }


    inputSourceTypeList() {
        return this.service.getAll('OutputDestinationSettingsApi/GetAllInputSourceTypes').pipe(map((data: any[]) => data.map((item: any) => {
            return {
                'id': item.id,
                'name': item.name
            }
        })));
    }


    outputfileformat$(sendprm) {
        const sendPrm = '?masterid=' + sendprm;
        return this.service.getAll('OutputDestinationSettingsApi/GetMasterValue', sendPrm)
            .pipe(map((data: any[]) => data.map((item: any) => {
                return {
                    'id': item.id,
                    'name': item.value,
                };
            })));
    }

    //Mock JSON
    sourceDashboard = [
        {
            "Name": "All invoices gmail",
            "docType": "Invoice",
            "inputSourceType": "Gmail",
            "isDefault": "Active",
            "statusName": "Active"
        },
        {
            "Name": "Dropbox POs",
            "docType": "Purchase order",
            "inputSourceType": "Dropbox",
            "isDefault": "InActive",
            "statusName": "InActive"
        }
    ];

    outputSourceDashboard = [
        {
            "Name": "Relax invoice",
            "docType": "Invoice",
            "documentSubType": "Invoice bill",
            "lastRunSelect": "16 documents sent…",
            "format": "PDF",
            "status": "Ready",
        },
        {
            "Name": "Relax invoice",
            "docType": "Invoice",
            "documentSubType": "Invoice bill",
            "lastRunSelect": "16 documents sent…",
            "format": "PDF",
            "status": "In progress",
        }
    ];

    transformationFields = [
        {
            "connectedBetween": "Effor hour",
            "queueName": "Time",
            "exportFileType": "CSV"
        },
        {
            "connectedBetween": "Effor hour",
            "queueName": "Time",
            "exportFileType": "CSV"
        },
        {
            "connectedBetween": "Effor hour",
            "queueName": "Time",
            "exportFileType": "CSV"
        },
        {
            "connectedBetween": "Effor hour",
            "queueName": "Time",
            "exportFileType": "CSV"
        },
        {
            "connectedBetween": "Effor hour",
            "queueName": "Time",
            "exportFileType": "CSV"
        }
    ];

      // tablesTab = [{
    //   "ID": 1,
    //   "FieldName": "Ajax PO"
    // }, {
    //   "ID": 2,
    //   "FieldName": "Megadata invoice"
    // }];


    tablesTab = [];

    //Function to show/hide custom buttons
    onSelectionChanged(event) {
       

        
            //logic
            
        //To show/hide Delete and Duplicate buttons: If more than 0 checked appears
  
        this.selectedItemKeys = event.selectedRowKeys;
        if (event.selectedRowsData.length > 0) {
            this.deleteBtn = true;
            this.editBtn = true;
            this.addBtn=false;
        }
        else {
            this.deleteBtn = false;
        this.editBtn = false;
        this.addBtn=true;
        }
        //To hide Duplicate button: If more than 1 checked appears
        if (event.selectedRowsData.length > 1) {
            this.editBtn = false;
            this.deleteBtn=true;
            this.addBtn=false;
        }
    }



    // Convert Active/Inactive into True/False for toggle button
    isUserActive(isActive: string) {
        if (isActive == 'Active') {
            return true;
        } else {
            return false;
        }
    }

    //Function to edit rows
    editPopupVisible = false;
    getRowIndex: number = 0;
    customEditPopup(b) {

        this.getRowIndex = b;
        this.editPopupVisible = true;
    }

    //Function to delete rows
    deleteRecords() {
        // this.selectedItemKeys.forEach((key) => {
        //     this.tempDeleteArray.remove(key);
        // });
        // this.dataGrid.instance.refresh();
        this.Deletepopup = true;
   
    }

    // Custom duplicate popup
    duplicatePopupVisible = false;
    duplicatePopup() {
        this.duplicatePopupVisible = true;
    }

    onFormSubmit = function (e) {
        
        notify({
            message: "You have submitted the form",
            position: {
                my: "center top",
                at: "center top"
            }
        }, "success", 3000);

        e.preventDefault();
        
    }

    redirect() {
        this.router.navigate(['./sme']);
    }


    editOutputPopupVisible = false;
    getOutputRowIndex: number = 0;
    customOutputEditPopup() {
        // this.editOutputPopupVisible = b;
        // this.editPopupVisible = true;
        this.OutputSourceField = this.selectedItemKeys[0];
        this.documentoutputModel = this.OutputSourceField;


        this.outputSourceDetailsTabs = [
            'Output details', 'Transformations'
        ]
        this.activateSourecDetailsTab("Output details")


        this.showOutputSourcePopop = true;

        this.documentSubTypeValueChanged(this.documentoutputModel.documentSubTypeID, this.documentoutputModel.id)

        //this.PopulateSelectedFields()

    }

    PopulateSelectedFields() {
       
        this.selectedFields = [];
        this.selectedTabularFields = [];
      
    }

    documentoutput() {
        const documentoutput$ = this.service.getAll('OutputDestinationSettingsApi/Getdocumentoutputlist').pipe(map((data: any[]) => data.map((item: any) => {
            return new OutputDestinationModel(
                item.name,
                item.documentSubTypeID,
                item.documentSubType,
                item.documentTypeID,
                item.documentType,
                item.documentOutputSourceID,
                item.inputSourceID,
                item.inputSourcename,
                item.fileFormat,
                item.rowDelimiter,
                item.columnDelimiter,
                item.unicode,
                item.inputSourceTypeID,
                item.inputSourceType,
                item.destinationFolder,
                item.emailID,
                item.id,
                item.status,
                item.lastRunResult
            )
        })));
        return documentoutput$;
    }

    //Custom multiselect start
    dropdownList = [];
    selectedItems: Map<string, Array<any>>;

    dropdownSettings = {};
    //  users=[{id:1},{id:2},{id:3},{id:4}];


    onItemSelect(item: any) {
       
    }
    OnItemDeSelect(item: any) {
        
    }
    onSelectAll(items: any) {
     
    }
    onDeSelectAll(items: any) {
    
    }
    Execute(row) {
        
        const sendPrm = '?DocOutputID=' + row.id;
        const post$ = this.service.postAll('OutputDestinationSettingsApi/SaveOutputRequest', row.id);

        post$.subscribe(data => {
           // this.documentoutputList = data;
            notify(data['result'].value);
           this.documentoutput().subscribe(data => {this.documentoutputList = data;});
            setTimeout(() => {
                this.loadIndicatorVisible = false;
            }, 2000);
        }, err => {
            setTimeout(() => {
                this.loadIndicatorVisible = false;
            }, 2000);
            notify(err.toString());
           
        }
        );
      
    }


   
       
    customerlist() {
        return this.service.getAll('OutputDestinationSettingsApi/Getcustomer').pipe(map((data: any[]) => data.map((item: any) => {
            return {
                'id': item.id,
                'name': item.name
            }
        })));
    }

    documentlist() {
        return this.service.getAll('OutputDestinationSettingsApi/Getdocument').pipe(map((data: any[]) => data.map((item: any) => {
            return {
                'id': item.id,
                'name': item.name
            }
        })));
    }


    documentTypeValueChanged(e) {
        const sendPrm = '?doctypeid=' + e.value;
        if (e.value != null) {
            this.getdrpdocumentsubtypelist$(sendPrm).subscribe(data => {
                this.documentsubtype = data;
            });
        } else {
            this.documentsubtype = [];
        }
    }


    getdrpdocumentsubtypelist$(sendprm) {
        return this.service.getAll('OutputDestinationSettingsApi/Getdocumentsubtype', sendprm)
            .pipe(map((data: any[]) => data.map((item: any) => {
                return {
                    'documentsubtypeid': item.id,
                    'documentsubtypename': item.name,
                };
            })));
    }


    inputsourcetypeChanged(e) {

        const sendPrm = '?inputsourcetypeid=' + e.value;
        if (e != null) {
            this.inputsourceList$(sendPrm).subscribe(data => {
                this.inputsourceName = data;
                
            });
            if( e.value=="EMAIL")
            {
                this.IsEmail=true;
                
            }
            else{
                this.IsEmail=false;
                
            }
        } else {

            this.inputsourceName = null;
        }


    }

    inputsourceList$(sendprm) {
        return this.service.getAll('OutputDestinationSettingsApi/GetInputSource', sendprm)
            .pipe(map((data: any[]) => data.map((item: any) => {
                return {
                    'id': item.id,
                    'name': item.name,
                };
            })));
    }

    outputfileFormatChanged(e) {
        this.CSVDelimiter = null;
        this.XMLEncodingType = null;
        this.isoutputformatTypeCSV = true;
        this.isoutputformatTypeXML = true;
        let value = 0;
        if (e.value != "" && e.value != null) {
            if (e.value.toLowerCase() == 'csv') {
                value = 13;
                this.StrfileFormat='csv';
                this.isoutputformatTypeCSV = false;
            } 
            else if (e.value.toLowerCase() == 'xml') {
                value = 14;
                this.StrfileFormat='xml';
                this.isoutputformatTypeXML = false;
            }
            else if (e.value.toLowerCase() == 'json') {
                this.StrfileFormat='json';
                this.isoutputformatTypeXML = false;
                this.isoutputformatTypeCSV = false;
            }            
        }
        if (value != null) {
            this.outputfileformat$(value).subscribe(data => {
                if (value == 13) {
                    this.CSVDelimiter = data;

                } else if (value == 14)
                    this.XMLEncodingType = data;

            });
        }
    }

    deleteRecords1() {
        // this.selectedItemKeys.forEach((key) => {
        //     this.tempDeleteArray.remove(key);
        // });
        // this.dataGrid.instance.refresh();
        this.DeleteOutPutpopup = true;
   
    }

    documentSubTypeValueChanged(value, id) {
        const subtypeid = value == "" ? 0 : value;
        const outputdestinationid = id == "" ? 0 : id;
        //var ouputdestinationdatadata = {'subtypeid': subtypeid,'outputdestinationid':outputdestinationid};

        const parameter$ = this.service.getAll('OutputDestinationSettingsApi/GetOutputTransformation?DocumentoutputsettingId=' + id
            + '&DocumentSubTypeId=' + value).pipe(map((data: any[]) => data.map((item: any) => {
                return new OutputTransformation(
                    item.docTypeFieldMappingID,
                    item.documentTypeFieldID,
                    item.fieldName,
                    item.dataType,
                    item.documentSubTypeID,
                    item.docOutputFieldFormatID,
                    item.documentOutputFieldFormatModels,
                    item.id,
                    item.isTabularField,
                    item.documentTypeTableID,
                    item.tableName
                )
            })));

        parameter$.subscribe(data => {
            this.GetTableName(data);
            //this.documenttransformation=data;
            this.documenttransformationNormal = data.filter(x => x.isTabularField == false);
            this.documenttransformationtabular = data.filter(x => x.isTabularField == true);

            this.selectedFields = data.filter(x => x.id > 0 && x.isTabularField == false);
            this.selectedTabularFields = data.filter(x => x.id > 0 && x.isTabularField == true);

        });

    }

    // onDocTransRowInserting($event){
   
    // }

    GetTableName(data) {
        this.paramarrayList = [];

        for (let i = 0; i < data["length"]; i++) {
            const otable = data[i];
            if (otable["documentTypeTableID"] != null && otable["documentTypeTableID"] != 0) {
                var tables = {
                    'ID': otable["documentTypeTableID"],
                    'FieldName': otable["tableName"]
                };
            }
        }
        this.paramarrayList.push(tables);
        this.tablesTab = this.paramarrayList;
       

    }

    ActivateOutputTab() {
        
        if (this.labelCaption == "Next") {
            this.activateOutputSourecDetailsTab("Transformations");
        }
         else if (this.labelCaption == "Save") {
            this.validateAndSaveOutput();
            
        }
    }


    OnFieldTabSelectionChange(event) {
        this.selectedFields = event.selectedRowKeys;
     
    }

    OnTableFieldTabSelectionChange(event) {
        this.selectedTabularFields = event.selectedRowKeys;
      
    }


    onOutputTabCancelClick()
    {
        this.valGroup.instance.reset();
        this.showOutputSourcePopop = false;
    }

    validateAndSaveOutput()
    {

        if ( this.validateOutputDetailsTab())
        {
        this.saveOutput();
        this.showOutputSourcePopop = false;
        }
        else 
        {
            alert("Please make sure you have filled all mandatory fields in both tabs with valid data. Please "
            + " note that at least one of the field or table in the Transformations tab must be selected");
            this.activateSourecDetailsTab("Output details");
            //this.valGroup.instance.validate().isValid;
            //this.isInputDetailsError = true;
        }
    }



    validateOutputDetailsTab()
    {
        var retval = true;
        if (this.documentoutputModel.name == null || this.documentoutputModel.name.trim().length <= 0)
            retval =  false; 
        if (this.documentoutputModel.documentTypeID == null)
            retval =  false;             
        if (this.documentoutputModel.documentSubTypeID == null)
            retval =  false;                    
        if (this.documentoutputModel.inputSourceTypeID == null)
            retval =  false;  
        if (this.documentoutputModel.inputSourceID == null)
            retval =  false;              
        if (this.documentoutputModel.destinationFolder == null|| this.documentoutputModel.destinationFolder.trim().length <= 0 )
            retval =  false;                      
        if(this.documentoutputModel.fileFormat == null|| this.documentoutputModel.fileFormat.trim().length <= 0)
            retval = false;
        var documentoutputfieldsetting = this.formDocumentOutputFieldSettingDto(this.documenttransformationNormal, this.documentoutputModel.id, this.documenttransformationtabular);
        if(documentoutputfieldsetting == null ||documentoutputfieldsetting.length == 0)
         {
             retval = false; 
         }
        return retval;        

    }





    saveOutput() {
        
        if (this.documentoutputModel.fileFormat.toLowerCase() == 'csv') {
            this.documentoutputModel.unicode = null;
        } else if (this.documentoutputModel.fileFormat.toLowerCase() == 'xml') {
            this.documentoutputModel.rowDelimiter = null;
            this.documentoutputModel.columnDelimiter = null;
        } else {
            this.documentoutputModel.rowDelimiter = null;
            this.documentoutputModel.columnDelimiter = null;
            this.documentoutputModel.unicode = null;
        }


        var documentoutputsetting = this.formDocumentOutputSettingDto(this.documentoutputModel);


        var documentoutputfieldsetting = this.formDocumentOutputFieldSettingDto(this.documenttransformationNormal, this.documentoutputModel.id, this.documenttransformationtabular);

        var documentdutputSource = this.formDocumentOutputSourceDto(this.documentoutputModel, this.documentoutputModel.id);

        var DocumentOutputSettingConfigurationVModel = {
            'documentOutputSettingModel': documentoutputsetting, 'documentOutputFieldSettingModels': documentoutputfieldsetting,
            'documentOutputSourceModel': documentdutputSource
        };

        if (DocumentOutputSettingConfigurationVModel["documentOutputSettingModel"].Id == 0) {
            const post$ = this.service.postAll('OutputDestinationSettingsApi/SaveoutputSetting', DocumentOutputSettingConfigurationVModel);

            post$.subscribe(data => {
                this.documentoutput().subscribe(data => {
                    this.documentoutputList = data;
                });
                this.openAddEditPopup = false;
                notify(data['result'].value);
                setTimeout(() => {
                    this.loadIndicatorVisible = false;
                }, 2000);
            }, err => {
                setTimeout(() => {
                    this.loadIndicatorVisible = false;
                }, 2000);
                notify(err.toString());
            }
            );
        }
        else {

            const put$ = this.service.put('OutputDestinationSettingsApi/UpdateoutputSetting', DocumentOutputSettingConfigurationVModel);
         
            put$.subscribe(data => {
                this.documentoutput().subscribe(data => {
                    this.documentoutputList = data;
                });
                this.openAddEditPopup = false;
                notify(data['result'].value);
                setTimeout(() => {
                    this.loadIndicatorVisible = false;
                }, 2000);
            }, err => {
                setTimeout(() => {
                    this.loadIndicatorVisible = false;
                }, 2000);
                notify(err.toString());
            }

            );
        }

    }

    formDocumentOutputSettingDto(data: any) {
        return {
            'Id': data.id,
            'Name': data.name,
            'DocumentSubTypeID': data.documentSubTypeID
        }
    }

    formDocumentOutputFieldSettingDto(data: any, DocumentOutputID, dataTable: any) {
        this.DocumentOutputFieldSettingListArray = [];
        for (let i = 0; i < data["length"]; i++) {
            const oB = data[i];
            var custparameter = {
                'Id': oB.id,
                'DocumentOutputID': DocumentOutputID,
                'DocTypeFieldMappingID': oB.docTypeFieldMappingID,
                'DocOutputFieldFormatID': oB.docOutputFieldFormatID
            };

            var dataval = this.selectedFields.find(ob => ob['docTypeFieldMappingID'] === custparameter.DocTypeFieldMappingID);
            if (dataval != 'undefined' && dataval != null) {
                this.DocumentOutputFieldSettingListArray.push(custparameter);
            }
        }

        for (let j = 0; j < dataTable["length"]; j++) {
            const oB = dataTable[j];
            var custparameter2 = {
                'Id': oB.id,
                'DocumentOutputID': DocumentOutputID,
                'DocTypeFieldMappingID': oB.docTypeFieldMappingID,
                'DocOutputFieldFormatID': oB.docOutputFieldFormatID
            };

            let datatableval = this.selectedTabularFields.find(ob => ob['docTypeFieldMappingID'] === custparameter2.DocTypeFieldMappingID);
            if (datatableval != 'undefined' && datatableval != null) {
                this.DocumentOutputFieldSettingListArray.push(custparameter2);
            }
        }

        return this.DocumentOutputFieldSettingListArray;

    }

    formDocumentOutputSourceDto(data: any, DocumentOutputID) {
        return {
            'Id': data.Id,
            'documentOutputSourceID': data.documentOutputSourceID,
            'DocumentOutputID': DocumentOutputID,
            'InputSourceID': data.inputSourceID,
            'FileFormat': data.fileFormat,
            'RowDelimiter': data.rowDelimiter == null ? "" : data.rowDelimiter,
            'ColumnDelimiter': data.columnDelimiter == null ? "" : data.columnDelimiter,
            'Unicode': data.unicode == null ? "" : data.unicode,
            'DestinationFolder': data.destinationFolder,
            'EmailID': data.emailID
        }
    }


}
class Parametercollection {
    Id: number;
    InputSourceId: number;
    InputSourceParamID: number;
    parameterName: string;
    displayName: string;
    parameterValue: string;
    masterID: number;

}