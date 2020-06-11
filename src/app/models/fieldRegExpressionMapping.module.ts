import { NgModule } from '@angular/core';
import { FieldRegularExpression } from './FieldRegularExpression.module';


export class FieldRegExpressionMapping {
    id: number ;
    documentTypeFieldID: number;
    fieldRegularExpressionID: number;
    fieldRegularExpression: FieldRegularExpression;
    isMapped: boolean;
    isDeleted: boolean;

      constructor(DocumentTypeFieldRegExID, DocumentTypeFieldID, FieldRegularExpressionID , docFieldRegularExpression , IsMapped, isDeleted ) {
    this.id = DocumentTypeFieldRegExID ;
    this.documentTypeFieldID = DocumentTypeFieldID;
    this.fieldRegularExpressionID = FieldRegularExpressionID;
    this.fieldRegularExpression = docFieldRegularExpression;
    this.isMapped  = IsMapped;
    this.isDeleted = isDeleted;
  }


}
