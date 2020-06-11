import { NgModule } from '@angular/core';


export class DocumentTypeTable {

    id: number;
    name: string;
    description: string;
    documentSubTypeID: number;
    sequence : number;

    constructor(DocumentTypeTableID, Name, Description, DocumentSubTypeID, Sequence) {
        this.id = DocumentTypeTableID;
        this.name = Name;
        this.description = Description;
        this.documentSubTypeID = DocumentSubTypeID;
        this.sequence = Sequence;
    }
}
