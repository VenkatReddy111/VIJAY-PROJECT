import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';


export class CreateMasterTable{
    masterTableId: number;
    masterTableName: string;
    isActive: string;
    lastUpdateBy: string;
    lastUpdateDate: string;
   
    

  constructor(masterTableId,
    masterTableName, isActive, lastUpdateBy, lastUpdateDate) { 
    this.masterTableId = masterTableId;
    this.masterTableName = masterTableName;
    this.isActive = isActive; 
    this.lastUpdateBy = lastUpdateBy;
    this.lastUpdateDate = lastUpdateDate; 
  }
}
export class KMTableCreate{
  id:number;
  tablename:string;
  columnname:string;
  datatype:string;

  constructor(id,
    tablename, columnname, datatype) { 
    this.id = id;
    this.tablename = tablename;
    this.columnname = columnname; 
    this.datatype = datatype; 
  }
}