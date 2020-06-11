import { NgModule } from '@angular/core';
import { FieldRuleValidation } from './FieldRuleValidation.module';


export class FieldValidationMapping {
    id: number ;
    docTypeFieldMappingID: number;
    fieldRuleValidationID: number;
    fieldRuleValidation: FieldRuleValidation;
    isMapped: boolean;
    parameterValue : string;
    isDeleted: boolean;
    methodSequenceId : number;
    dependentMethodSequenceId : number;
    isActive : boolean;
    
   constructor(DocumentFieldValidationID, DocTypeFieldMappingID, FieldRuleValidationID , IsMapped , Fieldrulevalidation , ParameterValue,
        isDeleted, methodSequenceId, dependentMethodSequenceId, isActive ) {
    this.id = DocumentFieldValidationID ;
    this.docTypeFieldMappingID = DocTypeFieldMappingID;
    this.fieldRuleValidationID = FieldRuleValidationID;
    this.fieldRuleValidation = Fieldrulevalidation;
    this.isMapped  = IsMapped;
    this.parameterValue = ParameterValue;
    this.isDeleted = isDeleted;
    this.methodSequenceId = methodSequenceId;
    this.dependentMethodSequenceId = dependentMethodSequenceId;
    this.isActive = isActive;
  }


}
