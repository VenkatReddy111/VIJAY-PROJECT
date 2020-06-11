import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserProductivityModule { }

// Class to read data which is in queue
export class UserProductivityModel {
  documentAllocationId: number;
  documentHeaderId: number;
  statusId: number;
  userId: number;
  docType: number;
  docSubType: number;
  stages: string;
  startDate: any;
  endDate: any;
  userName:any;
  listStageDetail:StageDetail;
  DocumentProcessTimeinMin:any
 
  constructor(documentAllocationId, documentHeaderId,  userId, docType, docSubType, stages, startDate, endDate,userName,listStageDetail,DocumentProcessTimeinMin) {
    this.documentAllocationId = documentAllocationId;
    this.documentHeaderId = documentHeaderId;
    this.userId = userId;
    this.docType = docType;
    this.docSubType = docSubType;
    this.stages = stages;
    this.startDate = startDate;
    this.endDate = endDate ; 
    this.listStageDetail=listStageDetail;
    this.DocumentProcessTimeinMin=DocumentProcessTimeinMin
  }
}

export class StageDetail {

  // userId: number;
  userName:string;
  docType: number;
  docSubType: number;
  stages: string;
  numberOfDocument:string
  documentPerHour:string

  constructor(userId,userName, docType, docSubType, stages, numberOfDocument,documentPerHour) {
    // this.userId = userId;
    this.userName = userName;
    this.docType = docType;
    this.docSubType = docSubType;
    this.stages = stages;
    this.numberOfDocument = numberOfDocument,
    this.documentPerHour=documentPerHour
  }
}