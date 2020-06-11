import { NgModule } from '@angular/core';
 

export class Customer { 

  CustomerID: number;
  Name: string;
  Address: string;
  Email: string;
  ContactNo: string;
  CustCode:string;   
  constructor(CustomerID, Name, Address, Email, ContactNo,CustCode ) {
  
    this.CustomerID =CustomerID;
    this.Name = Name;
    this.Address = Address;
    this.Email = Email;
    this.ContactNo = ContactNo;
    this.CustCode = CustCode;
  }

}
