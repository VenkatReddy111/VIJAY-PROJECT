import { NgModule } from '@angular/core';


export class FieldRuleValidation {
    id: number;
    validationName: string;
    validationExpression:  any ;
    description: string ;
    noOfParameters:  number;  
    isCustomRule: number;
    isActive:  boolean;
    isExtractionRule : boolean;
    validationSequence : number;
    parameterName: string;
    parameterInfo:string;
    functionName:string;

  constructor(ID, validationName, validationExpression, description, noofparameter, 
    IsCustomRule, IsActive, isExtractionRule, validationSequence, parameterName,parameterInfo,functionName) {
    this.id = ID;
    this.validationName =  validationName;
    this.validationExpression = validationExpression;
    this.description = description;
    this.noOfParameters = noofparameter;
    this.isCustomRule = IsCustomRule;
    this.isActive = IsActive;
    this.isExtractionRule = isExtractionRule;
    this.validationSequence = validationSequence;
    this.parameterName = parameterName;
    this.parameterInfo=parameterInfo;
    this.functionName=functionName;
  }


}
