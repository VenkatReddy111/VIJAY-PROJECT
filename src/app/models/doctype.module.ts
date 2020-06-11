import { NgModule } from '@angular/core';
 
export class Doctype { 
  DoctypeID: number;
  Name: string;
  Description: string;
   
  constructor(DoctypeID, Name, Description) {
  
    this.DoctypeID =DoctypeID;
    this.Name = Name;
    this.Description = Description;     
  }

}
