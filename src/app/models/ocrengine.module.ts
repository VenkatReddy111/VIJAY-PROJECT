import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';


export class OcrEngine {
  Id : number;
  Name: string;
  IsLicensed: boolean;
  IsDefault: boolean;
  IsActive: boolean;
  constructor(id,  name , islicensed , isdefault, isactive ) {
    this.Id = id;
    this.Name = name;
    this.IsLicensed = islicensed;
    this.IsDefault = isdefault;
    this.IsActive = isactive;
  }
}





export class OCRConf {
  id: number;
  ocrmap: string;
  ocrengines: OcrEngine[];

  constructor(p_id, p_ocrmap, p_ocrengine) {
    this.id = p_id;
    this.ocrmap = p_ocrmap;
    this.ocrengines = p_ocrengine;
  }


}

