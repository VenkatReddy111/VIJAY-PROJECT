import { NgModule } from '@angular/core';
import { CommonModule, Time } from '@angular/common';

export class TemplateParameter {        
  documenttypeid: number;
  customerid: number;
  vendorid: number; 
  file:string;
  templatename: string;   
  templatepath:string; 
  customername:string;
  documenttype:string;
  templatevirtualpath:string;
  constructor(documenttypeid,customerid,vendorid,file,templatename,templatepath,customername,documenttype,templatevirtualpath) {                     
    this.documenttypeid = documenttypeid;
    this.customerid = customerid;
    this.vendorid = vendorid;         
    this.file=file;           
    this.templatename = templatename;  
    this.templatepath=templatepath;
    this.customername=customername;
    this.documenttype=documenttype;
    this.templatevirtualpath=templatevirtualpath;
  }    
}

export class AppSettingsParameter  {   
  settingName: string;
  settingValue: string; 
constructor(settingName , settingValue ) {       
  this.settingName = settingName;
  this.settingValue = settingValue; 
}
} 