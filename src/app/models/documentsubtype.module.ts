import { NgModule } from '@angular/core';


export class DocumentSubType {
    documentSubTypeId: number;
    documentTypeId: number;
    name: string;
    description: string;
    isStandard: boolean;
    documentTypeName: string;
    docFilterField: string ;
    docFilterValue: string ;
    inputSourceID: number;
    languageID: number;
    fileUploaderProfileImage: string;
    fileName : string;
    fileType : string;
    filePath : string;
    docCategoryName : string;
    docCategoryId: number;
    isActive : boolean;

  constructor(documentSubTypeId, documentTypeId, name, description, isStandard,  documentTypeName,
     DocFilterField,	DocFilterValue	, InputSourceID	,
     LanguageID,fileUploaderProfileImage, fileName, fileType, filepath, docCategoryname, docCategoryId , isactive) {
    this.documentSubTypeId = documentSubTypeId;
    this.documentTypeId =  documentTypeId;
    this.name = name;
    this.description = description;
    this.isStandard = isStandard;
    this.docFilterField = DocFilterField;
    this.docFilterValue  = DocFilterValue;
    this.inputSourceID = InputSourceID;
    this.languageID = LanguageID;
    this.documentTypeName  = documentTypeName;
    this.fileUploaderProfileImage = fileUploaderProfileImage;
      this.fileName = fileName;
      this.fileType = fileType;
      this.filePath = filepath;
      this.docCategoryName = docCategoryname;
      this.docCategoryId  = docCategoryId;
      this.isActive =  isactive;
  }

}
