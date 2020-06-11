import { NgModule } from '@angular/core';
// with this model insert in FieldRuleMapping and get all fields rules mapped and unmapped

export class DocumentFieldRuleValidation {
  id: number;
  docTypeFieldMappingID: number;
  fieldRuleValidationID: number;
  name: string ;
  expression: any ;
  description: string;
  noOfParameters: number ;
  isCustomRule: boolean ;
  isActive: boolean ;
  parameter: string;
  methodSequenceId: number;
  dependentMethodSequenceId: number;

  constructor(id , docTypeFieldMappingID , FieldRuleValidationID, Name , Expression, Description, NoOfParameters,
              IsCustomRule, IsActive,parameterValue,sequenceID, dependentSequenceID  ) {
    this.id  = id ;
    this.docTypeFieldMappingID = docTypeFieldMappingID ;
    this.fieldRuleValidationID = FieldRuleValidationID ;
    this.name  = Name;
    this.expression = Expression;
    this.description = Description ;
    this.noOfParameters  = NoOfParameters;
    this.isCustomRule = IsCustomRule;
    this.isActive  = IsActive ;
    this.parameter = parameterValue;
    this.methodSequenceId = sequenceID;
    this.dependentMethodSequenceId = dependentSequenceID;
  }

}
