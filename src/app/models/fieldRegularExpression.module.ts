import { NgModule } from '@angular/core';


export class FieldRegularExpression {
    id: number;
    name: string;
    expression:  any ;

  constructor(ID, Name, Expression) {
    this.id = ID;
    this.name =  Name;
    this.expression = Expression;
  }


}
