//***********************************************************************************************
//   Type definitions for Leadtools.Document.Viewer.js
//   Updated: 3/11/2019 10:47
//   Version: 20.0.0.46
//
//   Dependencies:
//      Leadtools.d.ts
//      Leadtools.Annotations.Automation.d.ts
//      Leadtools.Annotations.Designers.d.ts
//      Leadtools.Annotations.Engine.d.ts
//      Leadtools.Annotations.Rendering.JavaScript.d.ts
//      Leadtools.Controls.d.ts
//      Leadtools.Document.d.ts
//      Leadtools.Pdf.ScriptSharp.d.ts
//
//   Copyright (c) 1991-2019 All Rights Reserved. LEAD Technologies, Inc.
//   https://www.leadtools.com
//***********************************************************************************************

declare module lt.Document.Viewer {

   interface DocumentViewerAsyncDone {
      (operation: DocumentViewerAsyncOperation): void;
   }

   interface DocumentViewerAsyncError {
      (operation: DocumentViewerAsyncOperation, error: Error): void;
   }

   interface DocumentViewerAsyncAlways {
      (operation: DocumentViewerAsyncOperation): void;
   }

   class DocumentViewerAsyncOperation {
      get_userState(): any;
      set_userState(value: any): void;
      get_done(): DocumentViewerAsyncDone;
      set_done(value: DocumentViewerAsyncDone): void;
      get_error(): DocumentViewerAsyncError;
      set_error(value: DocumentViewerAsyncError): void;
      get_always(): DocumentViewerAsyncAlways;
      set_always(value: DocumentViewerAsyncAlways): void;
      constructor();
      userState: any;
      done: DocumentViewerAsyncDone;
      error: DocumentViewerAsyncError;
      always: DocumentViewerAsyncAlways;
   }

   class DocumentViewerAnnotations {
      get_documentViewer(): DocumentViewer;
      get_automationManager(): lt.Annotations.Automation.AnnAutomationManager;
      get_automation(): lt.Annotations.Automation.AnnAutomation;
      get_automationControl(): lt.Annotations.Engine.IAnnAutomationControl;
      get_interactiveMode(): lt.Controls.ImageViewerInteractiveMode;
      isContainerModified(pageNumber: number): boolean;
      setContainerModified(pageNumber: number, isModified: boolean): void;
      get_isLoading(): boolean;
      initialize(): void;
      groupSelectedObjects(groupName: string): void;
      ungroupSelectedObjects(): void;
      get_useRotateThumbs(): boolean;
      set_useRotateThumbs(value: boolean): void;
      get_renderOnThumbnails(): boolean;
      set_renderOnThumbnails(value: boolean): void;
      selectedTextToReviewObject(pageNumber: number, textReviewObject: lt.Annotations.Engine.AnnTextReviewObject): boolean;
      dispose(): void;
      documentViewer: DocumentViewer; // read-only
      automationManager: lt.Annotations.Automation.AnnAutomationManager; // read-only
      automation: lt.Annotations.Automation.AnnAutomation; // read-only
      automationControl: lt.Annotations.Engine.IAnnAutomationControl; // read-only
      interactiveMode: lt.Controls.ImageViewerInteractiveMode; // read-only
      isLoading: boolean; // read-only
      useRotateThumbs: boolean;
      renderOnThumbnails: boolean;
   }

   interface UpdateAutomationTransformCallback {
      (item: lt.Controls.ImageViewerItem, transform: lt.LeadMatrix): lt.LeadMatrix;
   }

   class ImageViewerAutomationControl {
      dispose(): void;
      get_imageViewer(): lt.Controls.ImageViewer;
      set_imageViewer(value: lt.Controls.ImageViewer): void;
      get_automationScrollOffset(): lt.LeadPointD;
      get_automationObject(): any;
      set_automationObject(value: any): void;
      add_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      add_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      remove_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
      onAutomationPointerDown(e: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationPointerMove(e: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationPointerUp(e: lt.Annotations.Engine.AnnPointerEventArgs): void;
      onAutomationDoubleClick(e: lt.Annotations.Engine.AnnPointerEventArgs): void;
      get_automationDpiX(): number;
      get_automationDpiY(): number;
      get_automationEnabled(): boolean;
      add_automationEnabledChanged(value: lt.LeadEventHandler): void;
      remove_automationEnabledChanged(value: lt.LeadEventHandler): void;
      add_automationGotFocus(value: lt.LeadEventHandler): void;
      remove_automationGotFocus(value: lt.LeadEventHandler): void;
      add_automationLostFocus(value: lt.LeadEventHandler): void;
      remove_automationLostFocus(value: lt.LeadEventHandler): void;
      add_automationSizeChanged(value: lt.LeadEventHandler): void;
      remove_automationSizeChanged(value: lt.LeadEventHandler): void;
      get_updateAutomationTransform(): UpdateAutomationTransformCallback;
      set_updateAutomationTransform(value: UpdateAutomationTransformCallback): void;
      get_automationTransform(): lt.LeadMatrix;
      add_automationTransformChanged(value: lt.LeadEventHandler): void;
      remove_automationTransformChanged(value: lt.LeadEventHandler): void;
      get_automationUseDpi(): boolean;
      add_automationUseDpiChanged(value: lt.LeadEventHandler): void;
      remove_automationUseDpiChanged(value: lt.LeadEventHandler): void;
      get_automationXResolution(): number;
      get_automationYResolution(): number;
      automationInvalidate(rc: lt.LeadRectD): void;
      get_automationAntiAlias(): boolean;
      set_automationAntiAlias(value: boolean): void;
      get_renderingEngine(): lt.Annotations.Engine.AnnRenderingEngine;
      set_renderingEngine(value: lt.Annotations.Engine.AnnRenderingEngine): void;
      get_automationGetContainersCallback(): lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
      set_automationGetContainersCallback(value: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback): void;
      get_automationContainerIndex(): number;
      set_automationContainerIndex(value: number): void;
      automationAttach(container: lt.Annotations.Engine.AnnContainer): void;
      automationDetach(): void;
      get_automationDataProvider(): lt.Annotations.Engine.AnnDataProvider;
      set_automationDataProvider(value: lt.Annotations.Engine.AnnDataProvider): void;
      get_automationRotateAngle(): number;
      get_automationScaleFactor(): number;
      get_isAutomationEventsHooked(): boolean;
      set_isAutomationEventsHooked(value: boolean): void;
      constructor();
      imageViewer: lt.Controls.ImageViewer;
      automationScrollOffset: lt.LeadPointD; // read-only
      automationObject: any;
      automationDpiX: number; // read-only
      automationDpiY: number; // read-only
      automationEnabled: boolean; // read-only
      updateAutomationTransform: UpdateAutomationTransformCallback;
      automationTransform: lt.LeadMatrix; // read-only
      automationUseDpi: boolean; // read-only
      automationXResolution: number; // read-only
      automationYResolution: number; // read-only
      automationAntiAlias: boolean;
      renderingEngine: lt.Annotations.Engine.AnnRenderingEngine;
      automationGetContainersCallback: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
      automationContainerIndex: number;
      automationDataProvider: lt.Annotations.Engine.AnnDataProvider;
      automationRotateAngle: number; // read-only
      automationScaleFactor: number; // read-only
      isAutomationEventsHooked: boolean;
      automationPointerDown: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationPointerMove: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationPointerUp: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationDoubleClick: lt.Annotations.Engine.AnnPointerEventType; // read-only
      automationEnabledChanged: lt.LeadEventType; // read-only
      automationGotFocus: lt.LeadEventType; // read-only
      automationLostFocus: lt.LeadEventType; // read-only
      automationSizeChanged: lt.LeadEventType; // read-only
      automationTransformChanged: lt.LeadEventType; // read-only
      automationUseDpiChanged: lt.LeadEventType; // read-only
   }

   class DocumentViewerBookmarks {
      get_documentViewer(): DocumentViewer;
      get_isLoading(): boolean;
      dispose(): void;
      get_treeView(): HTMLElement;
      documentViewer: DocumentViewer; // read-only
      isLoading: boolean; // read-only
      treeView: HTMLElement; // read-only
   }

   interface DocumentViewerCanRunCommand {
      (documentViewer: DocumentViewer, command: DocumentViewerCommand, value: any): boolean;
   }

   interface DocumentViewerRunCommand {
      (documentViewer: DocumentViewer, command: DocumentViewerCommand, value: any): any;
   }

   interface DocumentViewerIsSlowCommand {
      (documentViewer: DocumentViewer, command: DocumentViewerCommand, value: any): boolean;
   }

   class DocumentViewerCommand {
      get_name(): string;
      set_name(value: string): void;
      get_canRunHandler(): DocumentViewerCanRunCommand;
      set_canRunHandler(value: DocumentViewerCanRunCommand): void;
      get_runHandler(): DocumentViewerRunCommand;
      set_runHandler(value: DocumentViewerRunCommand): void;
      get_isSlowHandler(): DocumentViewerIsSlowCommand;
      set_isSlowHandler(value: DocumentViewerIsSlowCommand): void;
      get_tag(): any;
      set_tag(value: any): void;
      get_value(): any;
      set_value(value: any): void;
      get_hasState(): boolean;
      set_hasState(value: boolean): void;
      get_state(): boolean;
      set_state(value: boolean): void;
      preRun(documentViewer: DocumentViewer, value: any): boolean;
      postRun(documentViewer: DocumentViewer, value: any): void;
      constructor();
      name: string;
      canRunHandler: DocumentViewerCanRunCommand;
      runHandler: DocumentViewerRunCommand;
      isSlowHandler: DocumentViewerIsSlowCommand;
      tag: any;
      value: any;
      hasState: boolean;
      state: boolean;
   }

   class DocumentViewerCommands {
      getCommand(commandName: string): DocumentViewerCommand;
      get_documentViewer(): DocumentViewer;
      canRun(commandName: string, value: any): boolean;
      run(commandName: string, value: any): any;
      isSlow(commandName: string, value: any): boolean;
      documentViewer: DocumentViewer; // read-only
      static pageFirst: string;
      static pageNext: string;
      static pagePrevious: string;
      static pageLast: string;
      static pageGoto: string;
      static pageRotateClockwise: string;
      static pageRotateCounterClockwise: string;
      static pageDisable: string;
      static pageEnable: string;
      static viewZoomIn: string;
      static viewZoomOut: string;
      static viewZoomPercentage: string;
      static viewFitWidth: string;
      static viewFitPage: string;
      static viewActualSize: string;
      static viewRotateClockwise: string;
      static viewRotateCounterClockwise: string;
      static viewItemType: string;
      static layoutSingle: string;
      static layoutVertical: string;
      static layoutDouble: string;
      static layoutHorizontal: string;
      static interactivePanZoom: string;
      static interactivePan: string;
      static interactiveZoom: string;
      static interactiveZoomTo: string;
      static interactiveMagnifyGlass: string;
      static interactiveSelectText: string;
      static interactiveAutoPan: string;
      static interactiveRubberBand: string;
      static textCopy: string;
      static textSelectAll: string;
      static textClearSelection: string;
      static textExport: string;
      static textFindNext: string;
      static textFindPrevious: string;
      static textGet: string;
      static annotationsUndo: string;
      static annotationsRedo: string;
      static annotationsCut: string;
      static annotationsCopy: string;
      static annotationsPaste: string;
      static annotationsDelete: string;
      static annotationsSelectAll: string;
      static annotationsClearSelection: string;
      static annotationsUserModeDesign: string;
      static annotationsUserModeRun: string;
      static annotationsUserModeRender: string;
      static annotationsBringToFront: string;
      static annotationsSendToBack: string;
      static annotationsBringToFirst: string;
      static annotationsSendToLast: string;
      static annotationsFlip: string;
      static annotationsReverse: string;
      static annotationsGroup: string;
      static annotationsUngroup: string;
      static annotationsLock: string;
      static annotationsUnlock: string;
      static annotationsResetRotatePoints: string;
      static annotationsAntiAlias: string;
      static annotationsProperties: string;
      static annotationsUseRotateThumbs: string;
      static annotationsEnableToolTips: string;
      static annotationsRenderOnThumbnails: string;
   }

   class DocumentViewerCreateOptions {
      get_viewContainer(): HTMLElement;
      set_viewContainer(value: HTMLElement): void;
      get_thumbnailsContainer(): HTMLElement;
      set_thumbnailsContainer(value: HTMLElement): void;
      get_bookmarksContainer(): HTMLElement;
      set_bookmarksContainer(value: HTMLElement): void;
      get_useAnnotations(): boolean;
      set_useAnnotations(value: boolean): void;
      get_viewCreateOptions(): lt.Controls.ImageViewerCreateOptions;
      get_thumbnailsCreateOptions(): lt.Controls.ImageViewerCreateOptions;
      constructor();
      viewContainer: HTMLElement;
      thumbnailsContainer: HTMLElement;
      bookmarksContainer: HTMLElement;
      useAnnotations: boolean;
      viewCreateOptions: lt.Controls.ImageViewerCreateOptions; // read-only
      thumbnailsCreateOptions: lt.Controls.ImageViewerCreateOptions; // read-only
   }

   class DocumentViewerDiagnostics {
      get_documentViewer(): DocumentViewer;
      get_showLinks(): boolean;
      set_showLinks(value: boolean): void;
      get_showTextCharacters(): boolean;
      set_showTextCharacters(value: boolean): void;
      documentViewer: DocumentViewer; // read-only
      showLinks: boolean;
      showTextCharacters: boolean;
   }

   class DocumentViewer {
      print(options: PrintDocumentOptions): JQueryPromise<any>;
      openBrowserPrint(parent: HTMLElement, printRoot: HTMLElement, title: string, printStyles: HTMLElement[]): void;
      dispose(): void;
      get_useAjaxImageLoading(): boolean;
      set_useAjaxImageLoading(value: boolean): void;
      static get_isPDFRenderingSupported(): boolean;
      get_usePDFRendering(): boolean;
      set_usePDFRendering(value: boolean): void;
      get_usePDFText(): boolean;
      set_usePDFText(value: boolean): void;
      get_isUsingPDFRendering(): boolean;
      getPDFRenderingObject(document: lt.Document.LEADDocument): any;
      prepareToSave(): boolean;
      get_document(): lt.Document.LEADDocument;
      get_autoDisposeDocument(): boolean;
      set_autoDisposeDocument(value: boolean): void;
      get_hasDocument(): boolean;
      get_pageCount(): number;
      get_view(): DocumentViewerView;
      get_thumbnails(): DocumentViewerThumbnails;
      get_bookmarks(): DocumentViewerBookmarks;
      get_annotations(): DocumentViewerAnnotations;
      get_commands(): DocumentViewerCommands;
      get_text(): DocumentViewerText;
      get_userName(): string;
      set_userName(value: string): void;
      get_diagnostics(): DocumentViewerDiagnostics;
      setDocument(document: lt.Document.LEADDocument): void;
      getCurrentViewOptions(): lt.Document.DocumentViewOptions;
      beginUpdate(): void;
      endUpdate(): void;
      add_operation(value: DocumentViewerOperationEventHandler): void;
      remove_operation(value: DocumentViewerOperationEventHandler): void;
      onOperation(e: DocumentViewerOperationEventArgs): void;  // protected
      get_currentPageNumber(): number;
      get_smartCurrentPageNumber(): boolean;
      set_smartCurrentPageNumber(value: boolean): void;
      gotoPage(pageNumber: number): void;
      gotoBookmark(bookmark: lt.Document.DocumentBookmark): void;
      runLinkTarget(linkTarget: lt.Document.DocumentLinkTarget): void;
      rotatePages(pageNumbers: number[], angle: number): void;
      disablePages(pageNumbers: number[]): void;
      enablePages(pageNumbers: number[]): void;
      useAjaxImageLoading: boolean;
      static isPDFRenderingSupported: boolean; // read-only
      usePDFRendering: boolean;
      usePDFText: boolean;
      isUsingPDFRendering: boolean; // read-only
      document: lt.Document.LEADDocument; // read-only
      autoDisposeDocument: boolean;
      hasDocument: boolean; // read-only
      pageCount: number; // read-only
      view: DocumentViewerView; // read-only
      thumbnails: DocumentViewerThumbnails; // read-only
      bookmarks: DocumentViewerBookmarks; // read-only
      annotations: DocumentViewerAnnotations; // read-only
      commands: DocumentViewerCommands; // read-only
      text: DocumentViewerText; // read-only
      userName: string;
      diagnostics: DocumentViewerDiagnostics; // read-only
      currentPageNumber: number; // read-only
      smartCurrentPageNumber: boolean;
      operation: DocumentViewerOperationEventType; // read-only
      tag: any;
      static annotationsInteractiveModeId: number;
      static pageLinksInteractiveModeId: number;
      static selectTextInteractiveModeId: number;
   }

   class AnnotationsInteractiveMode extends lt.Controls.ImageViewerInteractiveMode {
      get_id(): number;
      get_automationControl(): lt.Annotations.Engine.IAnnAutomationControl;
      set_automationControl(value: lt.Annotations.Engine.IAnnAutomationControl): void;
      get_name(): string;
      canStartWork(e: lt.Controls.InteractiveEventArgs): boolean;  // protected
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      constructor();
      id: number; // read-only
      automationControl: lt.Annotations.Engine.IAnnAutomationControl;
      name: string; // read-only
   }

   class DocumentViewerPageLinksInteractiveMode extends lt.Controls.ImageViewerInteractiveMode {
      get_documentViewer(): DocumentViewer;
      get_name(): string;
      get_id(): number;
      get_runLinkKeyModifier(): lt.Controls.Keys;
      set_runLinkKeyModifier(value: lt.Controls.Keys): void;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      canStartWork(e: lt.Controls.InteractiveEventArgs): boolean;  // protected
      constructor(documentViewer: DocumentViewer);
      documentViewer: DocumentViewer; // read-only
      name: string; // read-only
      id: number; // read-only
      runLinkKeyModifier: lt.Controls.Keys;
   }

   class DocumentViewerSelectTextInteractiveMode extends lt.Controls.ImageViewerRubberBandInteractiveMode {
      get_documentViewer(): DocumentViewer;
      set_documentViewer(value: DocumentViewer): void;
      get_shape(): lt.Controls.ImageViewerRubberBandShape;
      set_shape(value: lt.Controls.ImageViewerRubberBandShape): void;
      get_name(): string;
      get_id(): number;
      start(imageViewer: lt.Controls.ImageViewer): void;
      stop(imageViewer: lt.Controls.ImageViewer): void;
      onRubberBandStarted(e: lt.Controls.ImageViewerRubberBandEventArgs): void;  // protected
      onRubberBandDelta(e: lt.Controls.ImageViewerRubberBandEventArgs): void;  // protected
      onRubberBandCompleted(e: lt.Controls.ImageViewerRubberBandEventArgs): void;  // protected
      constructor();
      documentViewer: DocumentViewer;
      shape: lt.Controls.ImageViewerRubberBandShape;
      name: string; // read-only
      id: number; // read-only
   }

   enum DocumentViewerOperation {
      setDocument = 0,
      loadingThumbnails = 1,
      getThumbnail = 2,
      loadingPages = 3,
      getPage = 4,
      runCommand = 5,
      gotoPage = 6,
      itemTypeChanged = 7,
      getText = 8,
      pageTextSelectionChanged = 9,
      textSelectionChanged = 10,
      renderItemPlaceholder = 11,
      renderSelectedText = 12,
      gotoBookmark = 13,
      runLink = 14,
      loadingAnnotations = 15,
      getAnnotations = 16,
      createAutomation = 17,
      destroyAutomation = 18,
      automationStateChanged = 19,
      selectedTextToReviewObject = 20,
      loadingBookmarks = 21,
      hoverLink = 22,
      printPages = 23,
      pagesAdded = 24,
      pagesRemoved = 25,
      findText = 26,
      renderFoundText = 27,
      renderViewPage = 28,
      renderThumbnailPage = 29,
      detachFromDocument = 30,
      attachToDocument = 31,
      pageRotate = 32,
      pageDisabled = 33,
      pageEnabled = 34,
      pagesDisabledEnabled = 35,
      currentPageNumberChanged = 36
   }

   interface DocumentViewerOperationEventHandler extends lt.LeadEventHandler {
      (sender: any, e: DocumentViewerOperationEventArgs): void;
   }

   class DocumentViewerOperationEventType extends lt.LeadEvent {
      add(value: DocumentViewerOperationEventHandler): DocumentViewerOperationEventHandler;
      remove(value: DocumentViewerOperationEventHandler): void;
   }

   class DocumentViewerOperationEventArgs extends lt.LeadEventArgs {
      get_operation(): DocumentViewerOperation;
      get_error(): Error;
      get_data1(): any;
      get_data2(): any;
      get_pageNumber(): number;
      get_isPostOperation(): boolean;
      get_abort(): boolean;
      set_abort(value: boolean): void;
      constructor(operation: DocumentViewerOperation, error: Error, data1: any, data2: any, pageNumber: number, isPostOperation: boolean);
      operation: DocumentViewerOperation; // read-only
      error: Error; // read-only
      data1: any; // read-only
      data2: any; // read-only
      pageNumber: number; // read-only
      isPostOperation: boolean; // read-only
      abort: boolean;
   }

   interface DocumentViewerFindTextResultsHandler {
      (results: DocumentViewerMultiLineTextItem[]): void;
   }

   enum DocumentViewerFindTextStart {
      beginPosition = 0,
      inSelection = 1,
      afterSelection = 2,
      manualPosition = 3
   }

   class DocumentViewerFindText {
      clone(): DocumentViewerFindText;
      get_beginPosition(): DocumentViewerTextPosition;
      set_beginPosition(value: DocumentViewerTextPosition): void;
      get_endPosition(): DocumentViewerTextPosition;
      set_endPosition(value: DocumentViewerTextPosition): void;
      get_text(): string;
      set_text(value: string): void;
      get_matchCase(): boolean;
      set_matchCase(value: boolean): void;
      get_wholeWordsOnly(): boolean;
      set_wholeWordsOnly(value: boolean): void;
      get_findAll(): boolean;
      set_findAll(value: boolean): void;
      get_loop(): boolean;
      set_loop(value: boolean): void;
      get_renderResults(): boolean;
      set_renderResults(value: boolean): void;
      get_selectFirstResult(): boolean;
      set_selectFirstResult(value: boolean): void;
      get_start(): DocumentViewerFindTextStart;
      set_start(value: DocumentViewerFindTextStart): void;
      get_manualStartPosition(): DocumentViewerTextPosition;
      set_manualStartPosition(value: DocumentViewerTextPosition): void;
      constructor();
      beginPosition: DocumentViewerTextPosition;
      endPosition: DocumentViewerTextPosition;
      text: string;
      matchCase: boolean;
      wholeWordsOnly: boolean;
      findAll: boolean;
      loop: boolean;
      renderResults: boolean;
      selectFirstResult: boolean;
      start: DocumentViewerFindTextStart;
      manualStartPosition: DocumentViewerTextPosition;
      data: any;
   }

   class DocumentViewerText {
      get_documentViewer(): DocumentViewer;
      get_lineSelectionMode(): DocumentViewerLineSelectionMode;
      set_lineSelectionMode(value: DocumentViewerLineSelectionMode): void;
      get_renderSelection(): boolean;
      set_renderSelection(value: boolean): void;
      get_autoGetText(): boolean;
      set_autoGetText(value: boolean): void;
      getDocumentPageText(pageNumber: number): lt.Document.DocumentPageText;
      getAllDocumentPageText(): void;
      hasAnyDocumentPageText(): boolean;
      hasDocumentPageText(pageNumber: number): boolean;
      setDocumentPageText(pageText: lt.Document.DocumentPageText, pageNumber: number): void;
      getSelectedTextItems(pageNumber: number): DocumentViewerTextItem[];
      setSelectedTextItems(pageNumber: number, items: DocumentViewerTextItem[]): void;
      clearSelection(pageNumber: number): boolean;
      selectAll(pageNumber: number): void;
      selectText(area: lt.LeadRectD, mode: DocumentViewerSelectTextMode): void;
      get_selectedTextBegin(): DocumentViewerTextPosition;
      get_selectedTextEnd(): DocumentViewerTextPosition;
      get_hasAnySelectedText(): boolean;
      hasSelectedText(pageNumber: number): boolean;
      getSelectedText(pageNumber: number): string;
      exportText(pageNumber: number): string;
      copy(pageNumber: number): void;
      getPageTextItems(begin: DocumentViewerTextPosition, end: DocumentViewerTextPosition): DocumentViewerMultiLineTextItem;
      get_lastFindText(): DocumentViewerFindText;
      clearLastFindText(): void;
      clearRenderedFoundText(): void;
      get_lineKeyModifier(): lt.Controls.Keys;
      set_lineKeyModifier(value: lt.Controls.Keys): void;
      get_wordKeyModifier(): lt.Controls.Keys;
      set_wordKeyModifier(value: lt.Controls.Keys): void;
      get_characterKeyModifier(): lt.Controls.Keys;
      set_characterKeyModifier(value: lt.Controls.Keys): void;
      dispose(): void;
      find(options: DocumentViewerFindText, resultsHandler: DocumentViewerFindTextResultsHandler): void;
      static get_foundTextFill(): string;
      static set_foundTextFill(value: string): void;
      static get_selectedFill(): string;
      static set_selectedFill(value: string): void;
      static createFromPDF(pdfPage: any, onSuccess: (arg: lt.Document.DocumentPageText) => any, onError: (arg: string) => any): void;
      documentViewer: DocumentViewer; // read-only
      lineSelectionMode: DocumentViewerLineSelectionMode;
      renderSelection: boolean;
      autoGetText: boolean;
      selectedTextBegin: DocumentViewerTextPosition; // read-only
      selectedTextEnd: DocumentViewerTextPosition; // read-only
      hasAnySelectedText: boolean; // read-only
      lastFindText: DocumentViewerFindText; // read-only
      lineKeyModifier: lt.Controls.Keys;
      wordKeyModifier: lt.Controls.Keys;
      characterKeyModifier: lt.Controls.Keys;
      static foundTextFill: string;
      static selectedFill: string;
   }

   enum DocumentViewerSelectTextMode {
      line = 0,
      word = 1,
      character = 2
   }

   enum DocumentViewerLineSelectionMode {
      auto = 0,
      columns = 1,
      flowText = 2
   }

   class DocumentViewerMultiLineTextItem {
      get_textItems(): DocumentViewerTextItem[];
      set_textItems(value: DocumentViewerTextItem[]): void;
      get_firstPosition(): DocumentViewerTextPosition;
      get_lastPosition(): DocumentViewerTextPosition;
      clone(): DocumentViewerMultiLineTextItem;
      constructor();
      textItems: DocumentViewerTextItem[];
      firstPosition: DocumentViewerTextPosition; // read-only
      lastPosition: DocumentViewerTextPosition; // read-only
   }

   class DocumentViewerTextPosition {
      get_pageNumber(): number;
      set_pageNumber(value: number): void;
      get_characterIndex(): number;
      set_characterIndex(value: number): void;
      static create(pageNumber: number, characterIndex: number): DocumentViewerTextPosition;
      static createBeginOfPage(pageNumber: number): DocumentViewerTextPosition;
      static createEndOfPage(pageNumber: number): DocumentViewerTextPosition;
      static isInOrder(minPosition: DocumentViewerTextPosition, maxPosition: DocumentViewerTextPosition): boolean;
      constructor();
      pageNumber: number;
      characterIndex: number;
   }

   class DocumentViewerTextItem {
      clone(): DocumentViewerTextItem;
      get_pageNumber(): number;
      set_pageNumber(value: number): void;
      get_firstCharacterIndex(): number;
      set_firstCharacterIndex(value: number): void;
      get_lastCharacterIndex(): number;
      set_lastCharacterIndex(value: number): void;
      get_bounds(): lt.LeadRectD;
      set_bounds(value: lt.LeadRectD): void;
      constructor();
      pageNumber: number;
      firstCharacterIndex: number;
      lastCharacterIndex: number;
      bounds: lt.LeadRectD;
   }

   class DocumentViewerThumbnails {
      get_documentViewer(): DocumentViewer;
      get_imageViewer(): lt.Controls.ImageViewer;
      get_workerCount(): number;
      set_workerCount(value: number): void;
      get_maximumSize(): lt.LeadSizeD;
      set_maximumSize(value: lt.LeadSizeD): void;
      get_lazyLoad(): boolean;
      set_lazyLoad(value: boolean): void;
      get_useGrids(): boolean;
      set_useGrids(value: boolean): void;
      get_gridPixelSize(): number;
      set_gridPixelSize(value: number): void;
      get_isLoading(): boolean;
      invalidate(bounds: lt.LeadRectD): void;
      dispose(): void;
      documentViewer: DocumentViewer; // read-only
      imageViewer: lt.Controls.ImageViewer; // read-only
      workerCount: number;
      maximumSize: lt.LeadSizeD;
      lazyLoad: boolean;
      useGrids: boolean;
      gridPixelSize: number;
      isLoading: boolean; // read-only
   }

   class DocumentViewerView {
      get_documentViewer(): DocumentViewer;
      get_imageViewer(): lt.Controls.ImageViewer;
      get_useSvgBackImage(): boolean;
      set_useSvgBackImage(value: boolean): void;
      get_workerCount(): number;
      set_workerCount(value: number): void;
      get_lazyLoad(): boolean;
      set_lazyLoad(value: boolean): void;
      get_zoomRatio(): number;
      set_zoomRatio(value: number): void;
      get_itemType(): DocumentViewerItemType;
      get_preferredItemType(): DocumentViewerItemType;
      set_preferredItemType(value: DocumentViewerItemType): void;
      runLinkTarget(linkTarget: lt.Document.DocumentLinkTarget): void;
      invalidate(bounds: lt.LeadRectD): void;
      dispose(): void;
      documentViewer: DocumentViewer; // read-only
      imageViewer: lt.Controls.ImageViewer; // read-only
      useSvgBackImage: boolean;
      workerCount: number;
      lazyLoad: boolean;
      zoomRatio: number;
      itemType: DocumentViewerItemType; // read-only
      preferredItemType: DocumentViewerItemType;
   }

   enum PrintOrientation {
      portrait = 0,
      landscape = 1
   }

   interface AnnotationsRendererCreatedCallback {
      (renderingEngine: lt.Annotations.Engine.AnnRenderingEngine): void;
   }

   class PrintDocumentOptions {
      get_annotationsRendererCreated(): AnnotationsRendererCreatedCallback;
      set_annotationsRendererCreated(value: AnnotationsRendererCreatedCallback): void;
      get_parent(): HTMLElement;
      set_parent(value: HTMLElement): void;
      get_pagesList(): number[];
      set_pagesList(value: number[]): void;
      get_pageSize(): lt.LeadSizeD;
      set_pageSize(value: lt.LeadSizeD): void;
      get_useViewportLayout(): boolean;
      set_useViewportLayout(value: boolean): void;
      get_viewportClip(): lt.LeadRectD;
      set_viewportClip(value: lt.LeadRectD): void;
      get_dpi(): number;
      set_dpi(value: number): void;
      get_orientation(): PrintOrientation;
      set_orientation(value: PrintOrientation): void;
      get_rotateToOrientation(): boolean;
      set_rotateToOrientation(value: boolean): void;
      get_usePDFClientRendering(): boolean;
      set_usePDFClientRendering(value: boolean): void;
      get_autoDispose(): boolean;
      set_autoDispose(value: boolean): void;
      get_autoOpenBrowserPrint(): boolean;
      set_autoOpenBrowserPrint(value: boolean): void;
      get_showAnnotations(): boolean;
      set_showAnnotations(value: boolean): void;
      get_removeMargins(): boolean;
      set_removeMargins(value: boolean): void;
      get_title(): string;
      set_title(value: string): void;
      get_clientRenderSizePixels(): number;
      set_clientRenderSizePixels(value: number): void;
      get_imageLoaderImagesHolder(): HTMLDivElement;
      set_imageLoaderImagesHolder(value: HTMLDivElement): void;
      clone(): PrintDocumentOptions;
      constructor();
      annotationsRendererCreated: AnnotationsRendererCreatedCallback;
      parent: HTMLElement;
      pagesList: number[];
      pageSize: lt.LeadSizeD;
      useViewportLayout: boolean;
      viewportClip: lt.LeadRectD;
      dpi: number;
      orientation: PrintOrientation;
      rotateToOrientation: boolean;
      usePDFClientRendering: boolean;
      autoDispose: boolean;
      autoOpenBrowserPrint: boolean;
      showAnnotations: boolean;
      removeMargins: boolean;
      title: string;
      clientRenderSizePixels: number;
      imageLoaderImagesHolder: HTMLDivElement;
   }

   class DocumentViewerPrintProgress {
      get_pagesTotal(): number;
      get_pagesCompleted(): number;
      pagesTotal: number; // read-only
      pagesCompleted: number; // read-only
   }

   class DocumentPrintData {
      get_options(): PrintDocumentOptions;
      set_options(value: PrintDocumentOptions): void;
      get_printStyles(): HTMLElement[];
      set_printStyles(value: HTMLElement[]): void;
      get_root(): HTMLElement;
      set_root(value: HTMLElement): void;
      get_pages(): DocumentPrintPageData[];
      set_pages(value: DocumentPrintPageData[]): void;
      get_progress(): DocumentViewerPrintProgress;
      set_progress(value: DocumentViewerPrintProgress): void;
      get_viewportSize(): lt.LeadSizeD;
      set_viewportSize(value: lt.LeadSizeD): void;
      get_viewportImage(): HTMLImageElement;
      set_viewportImage(value: HTMLImageElement): void;
      buildPrintRoot(): void;
      buildViewportImage(): void;
      dispose(): void;
      constructor();
      options: PrintDocumentOptions;
      printStyles: HTMLElement[];
      root: HTMLElement;
      pages: DocumentPrintPageData[];
      progress: DocumentViewerPrintProgress;
      viewportSize: lt.LeadSizeD;
      viewportImage: HTMLImageElement;
   }

   enum DocumentPrintPageAction {
      auto = 0,
      remove = 1,
      manual = 2
   }

   class DocumentPrintPageData {
      get_action(): DocumentPrintPageAction;
      set_action(value: DocumentPrintPageAction): void;
      get_rotate(): boolean;
      set_rotate(value: boolean): void;
      get_printSize(): lt.LeadSizeD;
      set_printSize(value: lt.LeadSizeD): void;
      get_printSizeDpi(): lt.LeadSizeD;
      set_printSizeDpi(value: lt.LeadSizeD): void;
      get_size(): lt.LeadSizeD;
      set_size(value: lt.LeadSizeD): void;
      get_boundsInViewport(): lt.LeadRectD;
      set_boundsInViewport(value: lt.LeadRectD): void;
      get_relativeClip(): lt.LeadRectD;
      set_relativeClip(value: lt.LeadRectD): void;
      get_documentPage(): lt.Document.DocumentPage;
      set_documentPage(value: lt.Document.DocumentPage): void;
      get_pageElement(): HTMLElement;
      set_pageElement(value: HTMLElement): void;
      get_annotationsElement(): HTMLElement;
      set_annotationsElement(value: HTMLElement): void;
      dispose(): void;
      constructor();
      action: DocumentPrintPageAction;
      rotate: boolean;
      printSize: lt.LeadSizeD;
      printSizeDpi: lt.LeadSizeD;
      size: lt.LeadSizeD;
      boundsInViewport: lt.LeadRectD;
      relativeClip: lt.LeadRectD;
      documentPage: lt.Document.DocumentPage;
      pageElement: HTMLElement;
      annotationsElement: HTMLElement;
   }

   enum CurrentPageNumberChangedCause {
      visibility = 0,
      activity = 1
   }

   class CurrentPageNumberChangeData {
      get_oldCurrentPageNumber(): number;
      get_newCurrentPageNumber(): number;
      get_cause(): CurrentPageNumberChangedCause;
      constructor(oldCurrentPagenumber: number, newCurrentPageNumber: number, cause: CurrentPageNumberChangedCause);
      oldCurrentPageNumber: number; // read-only
      newCurrentPageNumber: number; // read-only
      cause: CurrentPageNumberChangedCause; // read-only
   }

   enum DocumentViewerItemType {
      image = 0,
      svg = 1
   }

   class DocumentViewerFactory {
      static createDocumentViewer(createOptions: DocumentViewerCreateOptions): DocumentViewer;
   }
}
