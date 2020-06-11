import { NgModule } from '@angular/core';


export class DocumentType {
  doctypeTypeID: number;
  documentCategoryID: number;
  name: string;
  description: string;
  documentCategory: string;
  
  

  constructor(doctypeTypeID, documentCategoryID, name, description,  docCategory) {
    this.doctypeTypeID = doctypeTypeID;
    this.documentCategoryID =  documentCategoryID;
    this.name = name;
    this.description = description;
    this.documentCategory = docCategory;
  }

}


export class DocumentTypeMaster {
  doctypeTypeID: number;
  documentCatID: number;
  name: string;
  description: string;
  documentCategory: string;
  isActive:boolean;
  

  constructor(doctypeTypeID, documentCatID, name, description,  docCategory,isActive) {
    this.doctypeTypeID = doctypeTypeID;
    this.documentCatID =  documentCatID;
    this.name = name;
    this.description = description;
    this.documentCategory = docCategory; 
    this.isActive = isActive;
  }

}
