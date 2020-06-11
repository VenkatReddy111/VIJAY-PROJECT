import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


export class PreprocessingclassModule { 
  id: number;
  name: string;
  Description: string;
  Attributes: string;
  IsActive: boolean;
 
  constructor(id, name, Description,Attributes?, IsActive? ) {
  
    this.id =id;
    this.name = name;
    this.Description = Description;
    this.Attributes=Attributes;
    this.IsActive = IsActive; 
  }

  


}
