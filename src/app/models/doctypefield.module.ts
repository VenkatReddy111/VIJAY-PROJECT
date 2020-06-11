import { NgModule } from '@angular/core';
//import { FieldRule, FieldValidation } from '../ontology/ontology-fieldvalpop/ontology-fieldvalpop.component';


export class DocumentTypeField {
    id: number;
    documentTypeID: number;
    fieldName: string;
    fieldDataTypeID: number;
    isMandatory: number;
    fieldDataType: string;
    //documentFieldRule: Array<FieldRule>;
    //documentFieldValidation: Array<FieldValidation>;

  constructor(documentTypeFieldID, documentTypeID, fieldName, fieldDataTypeID, isMandatory , fieldDataType, rules, validations) {
    this.id = documentTypeFieldID;
    this.documentTypeID =  documentTypeID;
    this.fieldName = fieldName;
    this.fieldDataTypeID = fieldDataTypeID;
    this.isMandatory = isMandatory;
    this.fieldDataType = fieldDataType;
   // this.documentFieldRule = rules;
   // this.documentFieldValidation = validations;
  }

}
