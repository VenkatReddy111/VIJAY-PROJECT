import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { Audit } from './Audit.module';


    export class AuditMaster {
        

        documentTypeId : number;
        documentType : string;
        documentSubTypeId : number;
        documentSubType : string;
        documentHeaderId  : number;
        documentProcessLogId  : number;
        documentProcessDate :Date;
        inputSourceHeaderID : number;
        currentStatusId : number
        currentStatus : string;
        lastUpdateby :number;
        lastUpdateDate  : Date
        auditDetails: Array<Audit>;

         constructor(documentTypeId,documentType,documentSubTypeId,documentSubType,documentHeaderId,
         documentProcessLogId,documentProcessDate,inputSourceHeaderID,currentStatusId,currentStatus,lastUpdateby,lastUpdateDate , auditDetails )
          {
                    this.documentTypeId= documentTypeId;
                    this.documentType= documentType;
                    this.documentSubTypeId = documentSubTypeId;
                    this.documentSubType = documentSubType;
                    this.documentHeaderId = documentHeaderId;
                    this.documentProcessLogId = documentProcessLogId;
                    this.documentProcessDate = documentProcessDate;
                    this.inputSourceHeaderID = documentProcessDate;
                    this.currentStatusId = currentStatusId ;
                    this.currentStatus = currentStatus ;
                    this.lastUpdateby = lastUpdateby;
                    this.lastUpdateDate = lastUpdateDate
                    this.auditDetails = auditDetails;
                 }

    }




