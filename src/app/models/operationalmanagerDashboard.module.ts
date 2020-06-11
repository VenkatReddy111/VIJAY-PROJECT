import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class OperationalmanagerDashboardModel { }
export class DocumentDashboardModel {
  documentopeningBalance: number;
  documentReceived: number;
  document:string;
  documentCount:number;

  constructor(documentopeningBalance, documentReceived,document,documentCount) {
    this.documentopeningBalance = documentopeningBalance;
    this.documentReceived = documentReceived;
    this.document=document;
    this.documentCount=documentCount;
  }
}

export class DocumentTypeDashboardModel { 
  documentType:string;
  documentCount:number;
  documentId:number

  constructor(documentType,documentCount,documentId) {    
    this.documentType=documentType;
    this.documentCount=documentCount;
    this.documentId=documentId;
  }  
}

export class AllocatedUserModel { 
  userId:number;
  userName:number;
  roleName:string;

  constructor(userId,userName,roleName) { 
    this.userId=userId; 
    this.userName=userName;     
    this.roleName=roleName;     
  }  
}

export class DocumentNextActionModel {
  isNextActionAllow: boolean;
  isUpdateRequire: boolean;  
  isPopupVisible: boolean;
  isOkButtonVisible: boolean;
  message: string;

  constructor(isNextActionAllow, isUpdateRequire,  isPopupVisible, isOkButtonVisible,message) {
    this.isNextActionAllow = isNextActionAllow;
    this.isUpdateRequire = isUpdateRequire;    
    this.isPopupVisible = isPopupVisible;
    this.isOkButtonVisible = isOkButtonVisible;
    this.message = message;
  }
}


