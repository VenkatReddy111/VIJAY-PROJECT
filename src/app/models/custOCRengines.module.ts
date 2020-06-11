import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';

export class CustOCREngines {
    customerOCREngineID :number
    ocrEngineTypeID : number;
    ocrEngineType : string;
    customerName : string ;
    customerID : number;
    ocrParameterName : string;
    ocrParameterID : string;
    parameterValue : string;
    id :number;


  constructor(custocrengineid,  enginetypeid , enginetype, custname , custid , paramname, paramid, paramval, Id ) {
            this.customerOCREngineID  = custocrengineid;
            this.ocrEngineTypeID = enginetypeid;
            this.ocrEngineType = enginetype;
            this.customerName = custname;
            this.customerID = custid;
            this.ocrParameterName  = paramname;
            this.parameterValue  = paramval;
            this.ocrParameterID  = paramid;
            this.id = Id;
  }

}

