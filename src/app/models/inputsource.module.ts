
export class InputSourceModel {
    id: number;
    inputSourceTypeId: string;
    customerId: number;  
    name : string;
    fileFilter: string;
    isMultiDocInPdf: boolean;
    isActive: boolean;
    customerName: string;
    documentType: string;
    documentTypeID: number;  
    inputSourceTypeName: string;
    documentSubTypeId: number;  
    documentSubTypeName: string;

    constructor(id, inputSourceTypeId, customerId, name,fileFilter,isMultiDocInPdf,isActive,customerName,documentType,documentTypeID,inputSourceTypeName,documentSubTypeId,documentSubTypeName) {
    
      this.id =id;
      this. inputSourceTypeId = inputSourceTypeId;
      this.customerId=customerId;
      this.name = name;
      this.fileFilter = fileFilter;
      this.isMultiDocInPdf = isMultiDocInPdf;
      this.isActive = isActive;
      this.customerName = customerName;
      this.documentType = documentType;
      this.documentTypeID = documentTypeID;
      this.inputSourceTypeName = inputSourceTypeName;
      this.documentSubTypeId = documentSubTypeId;
      this.documentSubTypeName = documentSubTypeName;
      
    }
}

export class Parameter {
  inputSourceParamValueID: number;
  inputSourceID: number;
  inputSourceParamID:number;
  parameterName:string;
  displayName:string;
  parameterValue:string;
  masterID:number;
  isEncrypted: boolean;
  isEditable: boolean;
  isSystemDefault: boolean;
  parameterValueType:string;
  masterModel:[];

  constructor(inputSourceParamValueID, inputSourceID,inputSourceParamID,parameterName,displayName,parameterValue,masterID,isEncrypted,isEditable,isSystemDefault,parameterValueType,masterModel  ) {
  
    this.inputSourceParamValueID =inputSourceParamValueID;
    this.inputSourceID = inputSourceID;
    this.inputSourceParamID = inputSourceParamID;
    this.parameterName = parameterName;
    this.displayName = displayName;
    this.parameterValue = parameterValue;
    this.masterID=masterID;
    this.isEncrypted=isEncrypted;
    this.isEditable=isEditable;
    this.isSystemDefault=isSystemDefault;
    this.parameterValueType=parameterValueType;
    this.masterModel=masterModel;
  }
}

 



  export class InputSourceTypeModel { 
    id : number;
    name : string;
    isListingAvailable: boolean;
    isBatchAllowed: boolean;
    isActive: boolean;
      


      constructor(
        id,
        name,
        isListingAvailable,
        isBatchAllowed,
        isActive 
      ) 
      {
        this.id = id;
        this.name = name; 
        this.isListingAvailable = isListingAvailable;
        this.isBatchAllowed = isBatchAllowed;
        this.isActive = isActive; 
      }
  } 