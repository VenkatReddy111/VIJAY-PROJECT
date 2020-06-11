import { NgModule } from '@angular/core';
import { FieldRegularExpression } from './FieldRegularExpression.module';
import { SynonymsDetails } from './Synonyms.module';
import { FieldValidationMapping } from './FieldValidationMapping.module';
import { FieldRegExpressionMapping } from './fieldRegExpressionMapping.module';
import { isatty } from 'tty';

export class DocumentField {
  id: number;
  documentTypeID: number;
  documentFieldID: number;
  fieldName: string;
  fielddescription: string;
  fieldDataTypeID: number;
  fieldDataType: string;
  documentSubTypeID: number;
  isMandatory: boolean;
  isTabularField: boolean;
  fieldSequence: number;
  tableSequence: number;
  isAnchor: boolean;
  documentTypeTableId: number;
  documentTypeTableName: string;
  documentTypeTableDesc: string;
  isActive: boolean;
  confidenceLevel: number;
  displayName: string;
  fieldStructure: number;
  zoneType: number;
  filedLocation: number;
  criticallevel: number;
  minConfForBlankOut: number;
  minConfForColor: number;
  editable: boolean;
  confirmBaseOnConfLevel: boolean;
  fieldLevelConf: number;
  charLevelConf: number;
  fieldDisplayMode: number;
  masterTableFieldId: number;
  minLength: number;
  maxLength: number;

  documentSynonoymsList: Array<SynonymsDetails>;
  documentValidationList: Array<FieldValidationMapping>;
  documentRegExList: Array<FieldRegExpressionMapping>;
  constructor(mappingID, documentTypeFieldID, documentTypeID, documentSubTypeID, fieldName, fieldDescription, fieldDataTypeID, isMandatory, fieldDataType,
    isTabularField, fieldSequence, tableSequence, isAnchor, validationlist, synonymslist, regexpressionlist, documentTypeTableId, documentTypeTableName,
    documentTypeTableDesc, isActive, confidenceLevel, displayName, fieldStructure, zoneType, filedLocation,
    criticallevel, minConfForBlankOut, minConfForColor, editable, confirmBaseOnConfLevel, fieldLevelConf, charLevelConf, fieldDisplayMode, masterTableFieldId,
    minLength, maxLength
  ) {
    this.id = mappingID;
    this.documentTypeID = documentTypeID;
    this.documentFieldID = documentTypeFieldID;
    this.documentSubTypeID = documentSubTypeID;
    this.fieldName = fieldName;
    this.fielddescription = fieldDescription;
    this.fieldDataTypeID = fieldDataTypeID;
    this.isMandatory = isMandatory;
    this.fieldDataType = fieldDataType;
    this.isTabularField = isTabularField;
    this.fieldSequence = fieldSequence;
    this.tableSequence = tableSequence;
    this.isAnchor = isAnchor;
    this.documentSynonoymsList = synonymslist;
    this.documentValidationList = validationlist;
    this.documentRegExList = regexpressionlist;
    this.documentTypeTableId = documentTypeTableId;
    this.documentTypeTableName = documentTypeTableName;
    this.documentTypeTableDesc = documentTypeTableDesc;
    this.isActive = isActive;
    this.confidenceLevel = confidenceLevel;
    this.displayName = displayName;
    this.fieldStructure = fieldStructure;
    this.zoneType = zoneType;
    this.filedLocation = filedLocation;
    this.criticallevel = criticallevel;
    this.minConfForBlankOut = minConfForBlankOut;
    this.minConfForColor = minConfForColor;
    this.editable = editable;
    this.confirmBaseOnConfLevel = confirmBaseOnConfLevel;
    this.fieldLevelConf = fieldLevelConf;
    this.charLevelConf = charLevelConf;
    this.fieldDisplayMode = fieldDisplayMode;
    this.masterTableFieldId = masterTableFieldId;
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

}
