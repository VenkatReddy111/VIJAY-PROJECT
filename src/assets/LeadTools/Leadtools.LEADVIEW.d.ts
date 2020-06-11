//***********************************************************************************************
//   Type definitions for Leadtools.LEADVIEW.js
//   Updated: 3/11/2019 10:49
//   Version: 20.0.0.1
//
//   Dependencies:
//      Leadtools.Annotations.Automation.d.ts
//      Leadtools.Document.d.ts
//      Leadtools.Document.Viewer.d.ts
//
//   Copyright (c) 1991-2019 All Rights Reserved. LEAD Technologies, Inc.
//   https://www.leadtools.com
//***********************************************************************************************

declare module lt.LEADVIEW {

   class Viewer {
      run(runSettings: RunSettings, settings: any): void;
      clear(): boolean;
      getIds(): string[];
      removeDocument(id: string): boolean;
      getCurrentDocument(): lt.Document.LEADDocument;
      setCurrentDocument(document: lt.Document.LEADDocument): boolean;
      getAnnAutomation(): lt.Annotations.Automation.AnnAutomation;
      getDocumentViewer(): lt.Document.Viewer.DocumentViewer;
      loadFromUri(parameters: LoadFromUriParameters): void;
      loadFromLocal(parameters: LoadFromLocalParameters): void;
      constructor();
   }

   class RunSettings {
      constructor();
      author: string;
      logger: Logger;
   }

   enum ErrorType {
      initialization = 0,
      failedToCreate = 1
   }

   interface Logger {
      logLEADVIEWError(errorType: ErrorType, message: string): void;
      logServiceError(serviceError: lt.Document.ServiceError, defaultMessage: string): string;
   }

   class LoadFromUriParameters {
      constructor();
      url: string;
      documentViewer: lt.Document.Viewer.DocumentViewer;
      fileLoadMode: lt.Document.DocumentLoadMode;
      loadOptions: lt.Document.LoadDocumentOptions;
      loadDialogCallback: Function;
      successCallback: Function;
      failCallback: Function;
      alwaysCallback: Function;
   }

   class LoadFromLocalParameters {
      constructor();
      file: any;
      annFile: any;
      loadEmbeddedAnnotations: boolean;
      documentViewer: lt.Document.Viewer.DocumentViewer;
      fileLoadMode: lt.Document.DocumentLoadMode;
      loadOptions: lt.Document.LoadDocumentOptions;
      loadDialogCallback: Function;
      uploadSuccessCallback: Function;
      uploadFailCallback: Function;
      uploadProgressCallback: Function;
      loadSuccessCallback: Function;
      loadFailCallback: Function;
      loadAlwaysCallback: Function;
   }
}
