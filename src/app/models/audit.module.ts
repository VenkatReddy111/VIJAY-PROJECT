import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';


export class Audit {
  actionid: number;
  actionName: string;
  auditType: string;
  actionControlName: string;
  documentNo: number;
  moduleName: string;
  threadId: number;
  description: string;
  instanceName: string;
  ipAddress: string;
  lastUpdateDate: Date;
  lastUpdateby: number;
  statusId : number;
  lastUpdatedByName: string;
  

  constructor(id, actionname, audittype, actioncontrolname,documentno,  modulename, threadid,statusId,
   description, instancename, ipaddress, lastUpdateDate , lastUpdateby, lastUpdatedByName
  ) {
    this.actionid = id;
    this.actionName = actionname;
    this.auditType = audittype;
    this.actionControlName = actioncontrolname;
    this.documentNo = documentno;
    this.moduleName = modulename;
    this.threadId = threadid;
    this.description =  description;
    this.instanceName = instancename;
    this.ipAddress = ipaddress;
    this.lastUpdateDate = lastUpdateDate;
    this.lastUpdateby = lastUpdateby;
    this.statusId = statusId;
    this.lastUpdatedByName  = lastUpdatedByName;
  }




}

