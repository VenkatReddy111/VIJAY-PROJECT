import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ManualhandlingModule { }


// Class to read data which is in queue
export class ManualHandlingInputModel {
  documentHeaderID: number;
  statusId: number;
  documentStatus: string;
  reason: string;
  moduleId: number;
  moduleName: string;
  documentSubTypeId: number;
  documentPath: string;
  documentImageVirtualPath: string;
  leadToolLicenseFile: string;
  leadTooldeveloperKey: string;
  projectVirtualRootPath: string;
  leadToolsJSLicenseFilePath: string;
  leadToolsJSDeveloperKey: string;
  leadToolsDocumentServiceHostPath: string;
  documentAllocationId:number;
  // documentImageVirtualRootPath: string;
  // documentImageFileNameToBeLoaded: string;
  // documentPhysicalRootFolderPath: string;
  constructor(documentHeaderID, statusId, documentStatus, reason, moduleId, moduleName, documentSubTypeId, documentPath,
    documentImageVirtualPath, leadToolLicenseFile, leadTooldeveloperKey, projectVirtualRootPath, leadToolsJSLicenseFilePath,
    leadToolsJSDeveloperKey, leadToolsDocumentServiceHostPath,documentAllocationId) {
    this.documentHeaderID = documentHeaderID;
    this.statusId = statusId;
    this.documentStatus = documentStatus;
    this.reason = reason;
    this.moduleId = moduleId;
    this.moduleName = moduleName;
    this.documentSubTypeId = documentSubTypeId;
    this.documentPath = documentPath;
    this.documentImageVirtualPath = documentImageVirtualPath;

    this.leadToolLicenseFile = leadToolLicenseFile;
    this.leadTooldeveloperKey = leadTooldeveloperKey;
    this.projectVirtualRootPath = projectVirtualRootPath;
    this.leadToolsJSLicenseFilePath = leadToolsJSLicenseFilePath;
    this.leadToolsJSDeveloperKey = leadToolsJSDeveloperKey;
    this.leadToolsDocumentServiceHostPath = leadToolsDocumentServiceHostPath;
    this.documentAllocationId=documentAllocationId;
    //// added on 10th dec for demo
    // this.documentImageVirtualRootPath = documentImageVirtualRootPath;
    // this.documentImageFileNameToBeLoaded = documentImageFileNameToBeLoaded;
    // this.documentPhysicalRootFolderPath = documentPhysicalRootFolderPath;
  }
}

//get the output of manaual handling module
export class ManualHandlingOutputModel {
  documentExtractionID: number;
  documentHeaderID: number;
  documentPath: string;
  statusId: number;
  reason: string;
  moduleId: number;
  moduleName: string;
  documentSubTypeId: number;
  constructor(documentExtractionID, documentHeaderID, documentPath, statusId, reason, moduleId, moduleName, documentSubTypeId) {
    this.documentExtractionID = documentExtractionID;
    this.documentHeaderID = documentHeaderID;
    this.documentPath = documentPath;
    this.statusId = statusId;
    this.reason = reason;
    this.moduleId = moduleId;
    this.moduleName = moduleName;
    this.documentSubTypeId = documentSubTypeId;
  }
}


//get the data extraction class 
export class DocumentExtractionModel {
  documentExtractionId: number;
  documentHeaderId: number;
  documentSubTypeId: number;
  lastUpdateby: number;
  lastUpdateDate: Date;

  constructor(documentExtractionId, documentHeaderId, documentSubTypeId, lastUpdateby, lastUpdateDate) {
    this.documentExtractionId = documentExtractionId;
    this.documentHeaderId = documentHeaderId;
    this.documentSubTypeId = documentSubTypeId;
    this.lastUpdateby = lastUpdateby;
    this.lastUpdateDate = lastUpdateDate;
  }
}


//get the data extraction details class 
export class DocumentExtractionDetailModel {
  documentExtractionDid: number;
  documentExtractionId: number;
  docTypeFieldMappingId: number;
  fieldValue: string;
  searchedWords: string;
  documentTypeFieldId: number;
  fieldName: string;
  isMandatory: boolean;
  isTabularField: boolean;
  fieldSequence: number;
  tableSequence:number;
  objFieldDetailsViewModel:FieldDetailsViewModel; //added for validation save

  constructor(documentExtractionDid, documentExtractionId, docTypeFieldMappingId, fieldValue,
    searchedWords, documentTypeFieldId, fieldName, isMandatory, isTabularField, fieldSequence,tableSequence,fieldValidation) {
    this.documentExtractionDid = documentExtractionDid;
    this.documentExtractionId = documentExtractionId;
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.fieldValue = fieldValue;
    this.searchedWords = searchedWords;
    this.documentTypeFieldId = documentTypeFieldId;
    this.fieldName = fieldName;
    this.isMandatory = isMandatory;
    this.isTabularField = isTabularField;
    this.fieldSequence = fieldSequence;
    this.tableSequence=tableSequence;
    this.objFieldDetailsViewModel=fieldValidation; //added for validation save
  }
}


//get the manual handling on load data
export class ManualHandlingVModel {
  objDocumentExtractionModel: DocumentExtractionModel;
  lstDocumentExtractionDetailModel: any;
  objDocumentProcessLogModel: any;
  objManualHandlingInputModel: ManualHandlingInputModel;
  moduleName: string;
  documentStatus: number;
  qcRemarks: string;
  vetoReason: string;
  discardReason: string;


  constructor(objDocumentExtractionModel, lstDocumentExtractionDetailModel, objDocumentProcessLogModel, objManualHandlingInputModel,
    moduleName, documentStatus, qcRemarks, vetoReason, discardReason,objManualHandlingValidationModel) {
    this.objDocumentExtractionModel = objDocumentExtractionModel;
    this.lstDocumentExtractionDetailModel = lstDocumentExtractionDetailModel;
    this.objDocumentProcessLogModel = objDocumentProcessLogModel;
    this.objManualHandlingInputModel = objManualHandlingInputModel;
    this.moduleName = moduleName;
    this.documentStatus = documentStatus;
    this.qcRemarks = qcRemarks;
    this.vetoReason = vetoReason;
    this.discardReason = discardReason;    
  }
}


//get fieldwise rejection details
export class FieldRejectionModel {
  documentHeaderId: number;
  docTypeFieldMappingId: number;
  documentFieldValidationId: number;
  docValidationRuleId: number;
  validationRuleName: string;
  isValid: boolean;
  isActive: boolean;
  rejectionReason: string;
  constructor(documentHeaderId, docTypeFieldMappingId, documentFieldValidationId, docValidationRuleId,
    validationRuleName, isValid, isActive, rejectionReason) {
    this.documentHeaderId = documentHeaderId;
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.documentFieldValidationId = documentFieldValidationId;
    this.docValidationRuleId = docValidationRuleId;
    this.validationRuleName = validationRuleName;
    this.isValid = isValid;
    this.isActive = isActive;
    this.rejectionReason = rejectionReason;
  }
}

//model is used for ROI making which is get from extracted data
export class SearchValueJsonModel {
  docTypeFieldMappingId: number;
  searchedValue: string;
  wordConfidenceText: string;
  wordX0Cordinate: string;
  wordY0Cordinate: string;
  wordX1Cordinate: string;
  wordY1Cordinate: string;
  lineWordsCordinateGeometry: string;
  lineNumber: number;
  pageNumber: number;
  xDPI: number;
  yDPI: number;
  constructor(docTypeFieldMappingId, searchedValue, wordConfidenceText, wordX0Cordinate,
    wordY0Cordinate, wordX1Cordinate, wordY1Cordinate, lineWordsCordinateGeometry, lineNumber, pageNumber, xDPI, yDPI) {
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.searchedValue = searchedValue;
    this.wordConfidenceText = wordConfidenceText;
    this.wordX0Cordinate = wordX0Cordinate;
    this.wordY0Cordinate = wordY0Cordinate;
    this.wordX1Cordinate = wordX1Cordinate;
    this.wordY1Cordinate = wordY1Cordinate;
    this.lineWordsCordinateGeometry = lineWordsCordinateGeometry;
    this.lineNumber = lineNumber;
    this.pageNumber = pageNumber;
    this.xDPI = xDPI;
    this.yDPI = yDPI;
  }
}

//model is used for validation
export class ManualHandlingFieldValidation {
  documentExtractionDid: number;
  docTypeFieldMappingId: number;
  validationStatus: boolean;
  //listMethodModel:MethodModel[]; //added for display rule execution status  on popup 
  listMethodModel:any[]; //added for display rule execution status  on popup 
  constructor(documentExtractionDid, docTypeFieldMappingId, validationStatus,listMethodModel) {
    this.documentExtractionDid = documentExtractionDid;
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.validationStatus = validationStatus;
    this.listMethodModel=listMethodModel;
  }
}

// //added for display rule execution status  on popup 
// export class MethodModel {
//   methodName: string;
//   parameters: string;
//   status: boolean;
//   errorMessage: string[];
//   parametersCount:number;
//   description:string;
//   fieldRuleValidationID:number;
//   documentFieldValidationID:number;
//   isExtractionRule:boolean;
//   constructor(methodName, parameters, status, errorMessage,parametersCount,description,fieldRuleValidationID,documentFieldValidationID,isExtractionRule) {
//     this.methodName = methodName;
//     this.parameters = parameters;
//     this.status = status;
//     this.errorMessage = errorMessage;
//     this.parametersCount=parametersCount;
//     this.description=description;
//     this.fieldRuleValidationID=fieldRuleValidationID;
//     this.documentFieldValidationID=documentFieldValidationID;
//     this.isExtractionRule=isExtractionRule;
//   }
// }

//model is used for field validation
export class ManualHandlingValidationModel {
  documentHeaderID: number;
  documentExtractionID: number;
  overAllValidationStatus: boolean;
  fieldValidation: ManualHandlingFieldValidation[];
  constructor(documentHeaderID, documentExtractionID, overAllValidationStatus, fieldValidation) {
    this.documentHeaderID = documentHeaderID;
    this.documentExtractionID = documentExtractionID;
    this.overAllValidationStatus = overAllValidationStatus;
    this.fieldValidation = fieldValidation;
  }
}


export class JsonViewOutputModel { }



export class TableColumns {
  roiFieldID: number;
  columnSequence: number;
  wordText: string;
  wordConfidenceText: string;
  wordX0Cordinate: string;
  wordY0Cordinate: string;
  wordX1Cordinate: string;
  wordY1Cordinate: string;

  constructor(roiFieldID, columnSequence, wordText, wordConfidenceText, wordX0Cordinate, wordY0Cordinate, wordX1Cordinate, wordY1Cordinate) {
    this.roiFieldID = roiFieldID;
    this.columnSequence = columnSequence;
    this.wordText = wordText;
    this.wordConfidenceText = wordConfidenceText;
    this.wordX0Cordinate = wordX0Cordinate;
    this.wordY0Cordinate = wordY0Cordinate;
    this.wordX1Cordinate = wordX1Cordinate;
    this.wordY1Cordinate = wordY1Cordinate;
  }
}
export class TableRow {
  rownumber: number;
  columns: any[];
  TableColumns: any[];
  constructor(rownumber, columns) {
    this.rownumber = rownumber;
    this.TableColumns = columns;

  }
}
export class TableRowjsonModel {
  row: TableRow;
  constructor(row) {
    this.row = row;
  }
}
export class JsonViewModel {
  pageNumber: number;
  tableSequence: number;
  roiid: number;
  docTypeFieldMappingID: number;
  tableRowjsonModel: TableRowjsonModel[];
  constructor(pageNumber, tableSequence, roiid, docTypeFieldMappingID, tableRowjsonModel) {
    this.pageNumber = pageNumber;
    this.tableSequence = tableSequence;
    this.roiid = roiid;
    this.docTypeFieldMappingID = docTypeFieldMappingID;
    this.tableRowjsonModel = tableRowjsonModel;

  }
}

export class TableFiledVModel{
  lstDocumentExtractionDetailModel:DocumentExtractionDetailModel;
  lstJsonViewModel:JsonViewModel;
}

export class ManualHandlingBaseModel {
  documentHeaderID: number;
  documentSubTypeId: number;
  documentExtractionId: number;
  documentExtractionDid: number;
  docTypeFieldMappingId: number;
  moduleName: string;
  coOrdinateX0: number;
  coOrdinateX1: number;
  coOrdinateY0: number;
  coOrdinateY1: number;
  pageNumber: number;
  imagePhysicalPath:string;

  constructor(documentHeaderID, documentSubTypeId, documentExtractionId, documentExtractionDid,
    docTypeFieldMappingId, moduleName, coOrdinateX0, coOrdinateX1, coOrdinateY0, coOrdinateY1, pageNumber,imagePhysicalPath) {
    this.documentHeaderID = documentHeaderID;
    this.documentSubTypeId = documentSubTypeId;
    this.documentExtractionId = documentExtractionId;
    this.documentExtractionDid = documentExtractionDid;
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.moduleName = moduleName;
    this.coOrdinateX0 = coOrdinateX0;
    this.coOrdinateX1 = coOrdinateX1;
    this.coOrdinateY0 = coOrdinateY0;
    this.coOrdinateY1 = coOrdinateY1;
    this.pageNumber = pageNumber;
    this.imagePhysicalPath=imagePhysicalPath;
  }
}

export class DocumentExtractionDetailMultiSuspectModel {
  documentExtractionId: number;
  docTypeFieldMappingId: number;
  multipleSuspects: ExtractedMultiSuspectModel[];
  documentTypeFieldId: number;
  fieldName: string;
  isMandatory: boolean;
  isTabularField: boolean;
  fieldSequence: number;
  objFieldDetailsViewModel: FieldDetailsViewModel;
  overAllValidationStatus: number;
  averageConfidance:number;
  fieldConfidanceHighSetting:number;
  fieldConfidanceLowSetting:number;
  fieldConfidanceMediumSetting:number;
  ruleExecutionStatus:number;
  constructor(documentExtractionId, docTypeFieldMappingId, multipleSuspects, documentTypeFieldId,
    fieldName, isMandatory, isTabularField, fieldSequence, objFieldDetailsViewModel,overAllValidationStatus,averageConfidance,
    fieldConfidanceHighSetting,fieldConfidanceLowSetting,fieldConfidanceMediumSetting,ruleExecutionStatus) {
    this.documentExtractionId = documentExtractionId;
    this.docTypeFieldMappingId = docTypeFieldMappingId;
    this.multipleSuspects = multipleSuspects;
    this.documentTypeFieldId = documentTypeFieldId;
    this.documentTypeFieldId = documentTypeFieldId;
    this.fieldName = fieldName;
    this.isMandatory = isMandatory;
    this.fieldSequence = fieldSequence;
    this.objFieldDetailsViewModel = objFieldDetailsViewModel;
    this.overAllValidationStatus=overAllValidationStatus;
    this.averageConfidance=averageConfidance;
    this.fieldConfidanceHighSetting=fieldConfidanceHighSetting;
    this.fieldConfidanceMediumSetting=fieldConfidanceMediumSetting;
    this.ruleExecutionStatus=ruleExecutionStatus;
  }
}


export class ExtractedMultiSuspectModel {
  documentExtractionDid: number;
  fieldValue: string;
  isSelected: boolean;
  isDefaultSelected:number;
  averageConfidance:any
  constructor(documentExtractionDid, fieldValue, isSelected,isDefaultSelected,averageConfidance) {
    this.documentExtractionDid = documentExtractionDid;
    this.fieldValue = fieldValue;
    this.isSelected = isSelected;
    this.isDefaultSelected=isDefaultSelected;
    this.averageConfidance=averageConfidance;
  }
}

export class FieldDetailsViewModel {
  lstFieldROIModel: any;
  lstFieldRejectionModel: any;
  lstFieldSynonymModel: any;
  lstCustomRuleValidationModel: any;
  lstExtractionSequenceModel: any;
  lstRegExpressionModel: any;
  lstAllRejectionModel: any;
  constructor(lstFieldROIModel, lstFieldRejectionModel, lstFieldSynonymModel,lstCustomRuleValidationModel,lstExtractionSequenceModel,lstRegExpressionModel,
    lstAllRejectionModel) {
    this.lstFieldROIModel = lstFieldROIModel;
    this.lstFieldRejectionModel = lstFieldRejectionModel;
    this.lstFieldSynonymModel = lstFieldSynonymModel;
    this.lstCustomRuleValidationModel=lstCustomRuleValidationModel;
    this.lstExtractionSequenceModel=lstExtractionSequenceModel;
    this.lstRegExpressionModel=lstRegExpressionModel;
    this.lstAllRejectionModel=lstAllRejectionModel;
  }
}


export class MultipleSuspectVModel {
  objDocumentExtractionModel: DocumentExtractionModel;
  lstDocumentExtractionDetailModel: any;
  lstPermissionTypeForuser: any;  // added on 23-Jan-2020

  constructor(objDocumentExtractionModel, lstDocumentExtractionDetailModel,lstPermissionTypeForuser) {
    this.objDocumentExtractionModel = objDocumentExtractionModel;
    this.lstDocumentExtractionDetailModel = lstDocumentExtractionDetailModel;
    this.lstPermissionTypeForuser = lstPermissionTypeForuser;
  }
}


export class FieldValidationInputModel {
  documentHeaderID: number;
  documentSubTypeId: number;
  documentExtractionId: number;
  documentExtractionDid: number;
  docTypeFieldMappingId: number;
  fieldValue: string;
  moduleName: string;

  constructor(documentHeaderID, documentSubTypeId,documentExtractionId,documentExtractionDid,docTypeFieldMappingId,fieldValue,moduleName) {
    this.documentHeaderID = documentHeaderID;
    this.documentSubTypeId = documentSubTypeId;
    this.documentExtractionId=documentExtractionId;
    this.documentExtractionDid=documentExtractionDid;
    this.docTypeFieldMappingId=docTypeFieldMappingId;
    this.fieldValue=fieldValue;
    this.moduleName=moduleName;
  }
}

// added on 29-Jan-2020 -- start
export class DocumentName {
  docCategoryName: string;
  documentTypeName: string;
  documentname: string;
  constructor(docCategoryName, documentTypeName,documentname) {
    this.docCategoryName = docCategoryName;
    this.documentTypeName = documentTypeName;
    this.documentname=documentname;
  }
}
// added on 29-Jan-2020 -- end


export class TableCellValidationModel {
  rowNumber: number;
  cellNumber: number;
  documentExtractionDid: number;
  docTypeFieldMappingId: number;
  fieldValue: string;
  cellValidationResult: string;
  tableSequence:number;
  tableName:string;
  constructor(rowNumber, cellNumber,documentExtractionDid,docTypeFieldMappingId,fieldValue,cellValidationResult,tableSequence,tableName) {
    this.rowNumber = rowNumber;
    this.cellNumber = cellNumber;  
    this.documentExtractionDid=documentExtractionDid;
    this.docTypeFieldMappingId=docTypeFieldMappingId;
    this.fieldValue=fieldValue;
    this.cellValidationResult=cellValidationResult;
    this.tableSequence=tableSequence;
    this.tableName=tableName;
  }
}


export class SelectedRowCellData {
  rowNumber: number;
  cellNumber: number;
  cellName: number;
  documentExtractionDid: number;
  docTypeFieldMappingId: number;
  fieldValue: string;
  overAllValidationStatus: number;
  objFieldDetailsViewModel:FieldDetailsViewModel;
  tableSequence:number;

  constructor(rowNumber, cellName,documentExtractionDid,docTypeFieldMappingId,fieldValue,overAllValidationStatus,objFieldDetailsViewModel,tableSequence) {
    this.rowNumber = rowNumber;
    this.cellName = cellName;  
    this.documentExtractionDid=documentExtractionDid;
    this.docTypeFieldMappingId=docTypeFieldMappingId;
    this.fieldValue=fieldValue;
    this.overAllValidationStatus=overAllValidationStatus;
    this.objFieldDetailsViewModel=objFieldDetailsViewModel;
    this.tableSequence=tableSequence;
  }
}

export class TableExtractionMIReturnData
{
  tableExtractSortedJson :any;
  tableExtractJson  :any;
  tableSequence:number;
  constructor(tableExtractSortedJson, tableExtractJson,tableSequence){
this.tableExtractSortedJson=tableExtractSortedJson;
this.tableExtractJson=tableExtractJson;
this.tableSequence=tableSequence;
  }
}