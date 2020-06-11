export class SplitterMerger {
    id: number;
    DocumentHeaderID: number;
    InputSourceHeaderId: number;
    SourceFileExtension: string;
    InputSourceFileId: number;
    FileName: string;
    FilePath: string;
    option: boolean;
    isChecked: boolean;
    BatchRootPath: string;
    docId: string;
    CurrentStatusId: number;
    InputSourceSplitFileId: number;
    objDocumentDetail: Batches;

    // tslint:disable-next-line:max-line-length
    constructor( DocumentHeaderID, InputSourceHeaderId, SourceFileExtension, fileName, FilePath, BatchRootPath, InputSourceFileId, docId, StatusId, InputSourceSplitFileId, objDocumentDetail, IsChecked) {

        this.DocumentHeaderID = DocumentHeaderID;
        this.InputSourceHeaderId = InputSourceHeaderId;
        this.SourceFileExtension = SourceFileExtension;
        this.FileName = fileName;
        this.FilePath = FilePath;
        this.option = true;
        this.isChecked = IsChecked;
        this.BatchRootPath = BatchRootPath;
        this.InputSourceFileId = InputSourceFileId;
        this.docId = docId;
        this.CurrentStatusId = StatusId;
        this.InputSourceSplitFileId = InputSourceSplitFileId;
        this.objDocumentDetail = objDocumentDetail;
      }
}
export class Batches {
  Id: number;
  InputSourceHeaderId: number;
  InputSourceDetailID: number;
  InputSourceFileID: number;
  SourceFileExtension: number;
  BatchNo: number;
  FilePath: string;
  BatchPath: string;
  FileName: string;
  CustomerName: string;
  CurrentStatusId: number;
  NoOfDocCreated: number;
  TotalSplittedPages: number;

  // tslint:disable-next-line:max-line-length
  constructor( InputSourceHeaderId, InputSourceDetailID, InputSourceFileID, SourceFileExtension, BatchNo, FilePath, BatchPath, FileName, StatusId, CustomerName, NoOfDocCreated, TotalSplittedPages) {
    this.Id = 1;
      this.InputSourceHeaderId = InputSourceHeaderId;
      this.InputSourceDetailID = InputSourceDetailID;
      this.SourceFileExtension = SourceFileExtension;
      this.InputSourceFileID = InputSourceFileID;
      this.BatchNo = BatchNo;
      this.FilePath = FilePath;
      this.BatchPath = BatchPath;
      this.FileName = FileName;
      this.CurrentStatusId = StatusId;
      this.CustomerName = CustomerName;
      this.NoOfDocCreated = NoOfDocCreated;
      this.TotalSplittedPages = TotalSplittedPages;
    }
}
