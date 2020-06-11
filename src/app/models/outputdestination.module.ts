

export class OutputDestinationModel {
  name: string;  
  documentSubTypeID: number;  
  documentSubType : string;
  documentTypeID: number;
  documentType: string;
  documentOutputSourceID: number;
  inputSourceID: number;
  inputSourcename: number;  
  fileFormat: string;
  rowDelimiter: string;  
  columnDelimiter: string;
  unicode: string;
  inputSourceTypeID: number;  
  inputSourceType: string;
  destinationFolder: string;
  emailID: string;
  id: number;
  status: string;
  lastRunResult: number;

  
   constructor(name, documentSubTypeID, documentSubType,documentTypeID,documentType,documentOutputSourceID,inputSourceID,inputSourcename,
    fileFormat,rowDelimiter,columnDelimiter,unicode,inputSourceTypeID,inputSourceType,destinationFolder,emailID, id, status, lastRunResult) {
      this.name = name;
      this.documentSubTypeID=documentSubTypeID;
      this.documentSubType = documentSubType;
      this.documentTypeID = documentTypeID;
      this.documentType = documentType;
      this.documentOutputSourceID = documentOutputSourceID;
      this.inputSourceID = inputSourceID;
      this.inputSourcename = inputSourcename;
      this.fileFormat = fileFormat;
      this.rowDelimiter = rowDelimiter;
      this.columnDelimiter = columnDelimiter;
      this.unicode = unicode;
      this.inputSourceTypeID = inputSourceTypeID;
      this.inputSourceType = inputSourceType;
      this.id =id;
      this.destinationFolder = destinationFolder;
      this.emailID = emailID;
      this.status = status;
      this.lastRunResult = lastRunResult
    }
}

export class OutputTransformation {

  docTypeFieldMappingID:number;
  documentTypeFieldID:number;
  fieldName: string;
  dataType:string;
  documentSubTypeID:number;
  docOutputFieldFormatID:number;
  documentOutputFieldFormatModels:[];
  id: number;
  isTabularField : boolean;
  documentTypeTableID : number;
  tableName : number;

  constructor(docTypeFieldMappingID, documentTypeFieldID, fieldName, dataType, documentSubTypeID, docOutputFieldFormatID, documentOutputFieldFormatModels, id, istablefield, documentTypeTableID, tableName) {
  
    this.docTypeFieldMappingID =docTypeFieldMappingID;
    this.documentTypeFieldID = documentTypeFieldID;
    this.fieldName = fieldName;
    this.dataType = dataType;
    this.documentSubTypeID = documentSubTypeID;
    this.docOutputFieldFormatID=docOutputFieldFormatID;
    this.documentOutputFieldFormatModels = documentOutputFieldFormatModels;
    this.id=id;
    this.isTabularField = istablefield;
    this.documentTypeTableID = documentTypeTableID;
    this.tableName = tableName;
  }
}

 