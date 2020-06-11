// Class to save the XML Annotation data
export class Savetemplate {
  xmlData: string;
  inputFileName: string;
  folderPath: string;

  constructor(xmlData, inputFileName, folderPath) {
    this.xmlData = xmlData;
    this.inputFileName = inputFileName;
    this.folderPath = folderPath;
  }
}

// Class to save the main Template table data
export class TemplateMainModel {
  templateId: number;
  templateName: string;
  currentVersionNumber: number;
  lastUpdateBy: number;
  lastUpdateDate: Date;

  constructor(templateId, templateName, currentVersionNumber, lastUpdateBy, lastUpdateDate) {
    //constructor(templateName) {
    this.templateId = templateId;
    this.templateName = templateName;
    this.currentVersionNumber = currentVersionNumber;
    this.lastUpdateBy = lastUpdateBy;
    this.lastUpdateDate = lastUpdateDate;
  }
}

// Class to save the Template Detail table data
export class TemplateDetailModel {
  templateId: number;
  templateDetailId: number;
  versionNumber: number;
  documentTypeId: number;
  customerId: number;
  vendorId: number;
  pageTopX: number;
  pageTopY: number;
  pageBottomX: number;
  pageBottomY: number;
  pageNo: number;
  isDefault: boolean;
  isActive: boolean;

  constructor(templateId, templateDetailId, versionNumber, documentTypeId, customerId, vendorId, pageTopX, pageTopY, pageBottomX, pageBottomY, pageNo, isDefault, isActive) {
    this.templateId = templateId;
    this.templateDetailId = templateDetailId;
    this.versionNumber = versionNumber;
    this.documentTypeId = documentTypeId;
    this.customerId = customerId;
    this.vendorId = vendorId;
    this.pageTopX = pageTopX;
    this.pageTopY = pageTopY;
    this.pageBottomX = pageBottomX;
    this.pageBottomY = pageBottomY;
    this.pageNo = pageNo;
    this.isDefault = isDefault;
    this.isActive = isActive;
  }
}

// Class to save the Template Field table data
export class TemplateFieldModel {
  templateFieldId: number;
  templateDetailId: number;
  documentTypeFieldId: number;
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;

  constructor(templateFieldId, templateDetailId, documentTypeFieldId, topX, topY, bottomX, bottomY) {
    this.templateFieldId = templateFieldId;
    this.templateDetailId = templateDetailId;
    this.documentTypeFieldId = documentTypeFieldId;
    this.topX = topX;
    this.topY = topY;
    this.bottomX = bottomX;
    this.bottomY = bottomY;
  }
}

// Class to save the Template Image table data
export class TemplateImageModel {
  templateImageId: number;
  templateDetailId: number;
  templateImagePath: string;
  templateImageFile: any;

  constructor(templateImageId, templateDetailId, templateImagePath, templateImageFile) {
    this.templateImageId = templateImageId;
    this.templateDetailId = templateDetailId;
    this.templateImagePath = templateImagePath;
    this.templateImageFile = templateImageFile;
  }
}

// Class containing the view model containing the combined data for templateF
export class TemplateViewModel {
  templateMain: TemplateMainModel;
  templateDetail: TemplateDetailModel;
  templateField: Array<TemplateFieldModel>;
  templateImage: TemplateImageModel;
  templateXml: Savetemplate;

  constructor(templateMain, templateDetail, templateField, templateImage, templateXml) {
    //constructor(templateMain) {
    this.templateMain = templateMain;
    this.templateDetail = templateDetail;
    this.templateField = templateField;
    this.templateImage = templateImage;
    this.templateXml = templateXml;
  }
}
