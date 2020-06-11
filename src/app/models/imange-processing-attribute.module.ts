import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class ImangeProcessingAttributeModule { 

  id: number;
  name: string;
  description: string;
  
   
  constructor(id, name, description ) {
  
    this.id =id;
    this.name = name;
    this.description = description;
   
  }

}
