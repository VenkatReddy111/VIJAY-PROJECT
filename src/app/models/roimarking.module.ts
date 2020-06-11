// Class to save the XML Annotation data
export class ROIXmlModel {
  xmlData: string;
  inputFileName: string;
  folderPath: string;
  docTypeFieldMappingID: number;
  isTabularField:boolean;
  constructor(xmlData, inputFileName, folderPath, docTypeFieldMappingID,isTabularField) {
    this.xmlData = xmlData;
    this.inputFileName = inputFileName;
    this.folderPath = folderPath;
    this.docTypeFieldMappingID = docTypeFieldMappingID;
    this.isTabularField=isTabularField
  }
}

// Class to save the ROI Detail data
export class ROIDetailModel {
  rOIID: number;
  documentSubTypeID: number;
  //rOIImageID: number;
  pageTopX: number;
  pageTopY: number;
  pageBottomX: number;
  pageBottomY: number;
  pageNo: number;
  isDefault: boolean;
  isActive: boolean;

  constructor(rOIID, documentSubTypeID, pageTopX, pageTopY, pageBottomX, pageBottomY, pageNo, isDefault, isActive) {
    this.rOIID = rOIID;
    this.documentSubTypeID = documentSubTypeID;
    //this.rOIImageID = rOIImageID;
    this.pageTopX = pageTopX;
    this.pageTopY = pageTopY;
    this.pageBottomX = pageBottomX;
    this.pageBottomY = pageBottomY;
    this.pageNo = pageNo;
    this.isDefault = isDefault;
    this.isActive = isActive;
  }
}

// Class to save the ROI Field data
export class ROIFieldModel {
  rOIFieldID: number;
  rOIID: number;
  docTypeFieldMappingID: number;
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;
  anchorValue: string;

  constructor(rOIFieldID, rOIID, docTypeFieldMappingID, topX, topY, bottomX, bottomY, anchorvalue) {
    this.rOIFieldID = rOIFieldID;
    this.rOIID = rOIID;
    this.docTypeFieldMappingID = docTypeFieldMappingID;
    this.topX = topX;
    this.topY = topY;
    this.bottomX = bottomX;
    this.bottomY = bottomY;
    this.anchorValue = anchorvalue;
  }
}

// // Class to save the ROI Image
// export class ROIImageModel {
//   rOIImageID: number;
//   rOIImagePath: string;
//   rOIImageFile: any;

//   constructor(rOIImageID, rOIImagePath, rOIImageFile, templateImageFile) {
//     this.rOIImageID = rOIImageID;
//     this.rOIImagePath = rOIImagePath;
//     this.rOIImageFile = rOIImageFile;
//   }
// }

// Class to save the ROI View model containing data for ROI Detail, Field, Image and XML
export class ROIViewModel {
  rOIXml: ROIXmlModel;
  rOIDetail: ROIDetailModel;
  rOIField: ROIFieldModel;
  //rOIImage: ROIImageModel;
  docTypeFieldMappingID: number;
  documentImageFilePath: string;
  isTabularField:boolean;
  constructor(rOIXml, rOIDetail, rOIField, docTypeFieldMappingID, documentImageFilePath,isTabularField) {
    this.rOIXml = rOIXml;
    this.rOIDetail = rOIDetail;
    this.rOIField = rOIField;
    //this.rOIImage = rOIImage;
    this.docTypeFieldMappingID = docTypeFieldMappingID;
    this.documentImageFilePath = documentImageFilePath;
    this.isTabularField=isTabularField;
    
  }
}

// Class to carry the parameters from Ontology Definition screen to ROI Marking screen
export class ROIParametersModel {
  docTypeFieldMappingID: number;
  documentSubTypeID: number;
  isTabularField: boolean;
  isAnchor : boolean;
  documentImageFilePath: string;
  documentImageVirtualPath: string;
  fieldName: string;
  anchorValue: string;
  //roiImageID: number;
  constructor(docTypeFieldMappingID, documentSubTypeID, isTabularField, documentImageFilePath, documentImageVirtualPath, fieldName, isAnchor, anchorValue) {
    this.docTypeFieldMappingID = docTypeFieldMappingID;
    this.documentSubTypeID = documentSubTypeID;
    this.isTabularField = isTabularField;
    this.documentImageFilePath = documentImageFilePath;
    this.documentImageVirtualPath = documentImageVirtualPath;
    this.fieldName = fieldName;
    this.isAnchor = isAnchor;
    this.anchorValue = anchorValue;
    //this.roiImageID = roiImageID;
  }
}
