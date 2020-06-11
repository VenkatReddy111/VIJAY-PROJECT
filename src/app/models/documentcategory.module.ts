import { NgModule } from '@angular/core';
 

export class DocumentCategory { 

    Id: number;
    CustomerID: number;
    CategoryName: string;
    Description: string;
    CustomerName: string;
    isActive:boolean;
   // lastUpdateBy:boolean;
    //lastUpdateDate:string;
  constructor(Id, CustomerID, CategoryName, Description ,CustomerName,isActive) {
  
    this.Id =Id;
    this.CustomerID = CustomerID;
    this.CategoryName = CategoryName;
    this.Description = Description;
    this.CustomerName = CustomerName;  
    this.isActive=isActive;
    //this.lastUpdateBy = lastUpdateBy;  
    //this.lastUpdateDate = lastUpdateDate;  
  }

}
 