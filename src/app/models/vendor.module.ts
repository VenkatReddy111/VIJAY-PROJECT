import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class VendorModule { 

  VendorID: number;
  VendorName: string;
  Customer: string;
     
  constructor(VendorID, VendorName, Customer ) {
  
    this.VendorID =VendorID;
    this.VendorName = VendorName;
    this.Customer = Customer;
   
  }

}
