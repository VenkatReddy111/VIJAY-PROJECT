import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class InputytypeModule { 

  id: number;
  customerName: string;
  isMultiDocInPdf: boolean;
  fileFilter: string;
  parameterName: string;
  parameterValue: string;
  isActive: boolean;
  
  constructor(id, customerName, isMultiDocInPdf, fileFilter, parameterName, parameterValue, isActive) {
  
    this.id =id;
    this.customerName = customerName;
    this.isMultiDocInPdf = isMultiDocInPdf;
    this.fileFilter = fileFilter; 
    this.parameterName = parameterName;
    this. parameterValue = parameterValue;
    this.isActive = isActive;
  }

}
