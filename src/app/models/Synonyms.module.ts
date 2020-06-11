

import { NgModule } from '@angular/core';

export class SynonymsDetails {
  filter(arg0: (book: any) => boolean): SynonymsDetails {
    throw new Error("Method not implemented.");
  }

id: number ;
docTypeFieldID: number;
synonym:  string;
priority: number;
isDeleted:boolean;

constructor( documentOntologyDID ,  docTypeFieldID	, synonym	 , priority,isDeleted) {
this.id  = documentOntologyDID  ;
this.docTypeFieldID = docTypeFieldID;
this.synonym = synonym ;
this.priority = priority;
this.isDeleted=isDeleted;
}


}

