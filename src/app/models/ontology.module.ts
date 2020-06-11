import { NgModule } from '@angular/core';
import { CommonModule, Time } from '@angular/common';

export class Field {
  id: number;
  fieldName: string;
  documentTypeID: number;
  constructor(id, fieldName, documentTypeID) {

    this.id = id;
    this.fieldName = fieldName;
    this.documentTypeID = documentTypeID;
  }
}
export class Synonym {
  id: number;
  synonym: string;
  documentTypeFieldID: number;

  constructor(id, synonym, documentTypeFieldID) {

    this.id = id;
    this.synonym = synonym;
    this.documentTypeFieldID = documentTypeFieldID;

  }
}
export class DocumentTypeDLLMapping {
  docTypeDllMappingId: number;
  documentCatId: number;
  documentTypeID: number;
  categoryName: string;
  documentTypeName: string;
  fileType: string;
  filePath: string;
  fileName: string;
  versionNo: string;
  isMapped: boolean;
  uploadDate: string;
  mappedDate: string;
  DLLfileUploader: any;
  constructor(docTypeDllMappingId, documentCatId, documentTypeID, categoryName, documentTypeName,
    fileType, filePath, fileName,
    versionNo, isMapped, uploadDate, mappedDate, DLLfileUploader) {
    this.docTypeDllMappingId = docTypeDllMappingId;
    this.documentCatId = documentCatId;
    this.documentTypeID = documentTypeID;
    this.categoryName = categoryName;
    this.documentTypeName = documentTypeName;
    this.fileType = fileType;
    this.filePath = filePath;
    this.fileName = fileName;
    this.versionNo = versionNo;
    this.isMapped = isMapped;
    this.uploadDate = uploadDate;
    this.mappedDate = mappedDate;
    this.DLLfileUploader = DLLfileUploader;


  }
}
export class controlvalues {
  ValueId: number;
  ValueDisplay: string;

  constructor(ValueId, ValueDisplay) {

    this.ValueId = ValueId;
    this.ValueDisplay = ValueDisplay
  }

}
export class FieldParameterinfo {
  index:number;
  fieldRuleValidationID: number;
  name: string;
  ControlType: string;
  ControlValues: number;

  constructor(index,fieldRuleValidationID, name, ControlType, ControlValues) {
    this.index=index;
    this.fieldRuleValidationID = fieldRuleValidationID;
    this.name = name;
    this.ControlType = ControlType;
    this.ControlValues = ControlValues;
  }

}
