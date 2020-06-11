declare module lt.Demos.Basic {
    class DemoInteractiveMode {
        interactiveMode: lt.Controls.ImageViewerInteractiveMode;
        resetToPanZoom: boolean;
        constructor(mode: lt.Controls.ImageViewerInteractiveMode, reset: boolean);
    }
    class CommonApp {
        private static _defaultServiceConfig;
        protected _imageViewer: lt.Controls.ImageViewer;
        protected _demoImages: DemoImage[];
        protected _demoName: string;
        protected _imageDPI: number;
        protected _isLoadedBitonal: boolean;
        protected _useService: boolean;
        protected _tempImageUrl: string;
        protected _currentImageUrl: string;
        protected _loadImagesFromService: boolean;
        protected _interactiveModes: DemoInteractiveMode[];
        protected _openFileDlg: Dialogs.OpenFileDialog;
        protected _aboutDlg: Dialogs.AboutDialog;
        protected _loadingDlg: Dialogs.LoadingDialog;
        protected _commonUI: {
            imageViewerDiv: string;
            openBtn: string;
            saveImageBtn: string;
            panZoomBtn: string;
            interactiveModesBtns: string;
            fitBtn: string;
            actualSizeBtn: string;
            zoomInBtn: string;
            zoomOutBtn: string;
            aboutBtn: string;
            toggleMobileMenuSource: string;
            toggleMobileMenuTarget: string;
            toggleMobileLeftPanelSource: string;
            toggleMobileLeftPanelTarget: string;
        };
        protected _dispose(): void;
        run(): void;
        private _verifyService;
        protected _onServiceVerified(): void;
        protected _demoRequiresOCR: boolean;
        private _ocrReady;
        readonly ocrReady: boolean;
        protected _startDemo(): void;
        private _initService;
        protected _initUI(): void;
        private _initDialogs;
        protected _initViewer(): void;
        protected _viewer_ItemError(sender: any, e: lt.Controls.ImageViewerItemErrorEventArgs): void;
        protected _viewer_ItemChanged(sender: any, e: lt.Controls.ImageViewerItemChangedEventArgs): void;
        protected _initInteractiveModes(): void;
        protected _bindInteractiveModes(): void;
        private _createViewerInElementsMode;
        protected _toggleViewerMode(elementsModeOn?: boolean): void;
        protected _loadDemoImage(index: number): void;
        protected _loadImageFromURL(url: string): void;
        _beginOperation(processText: string, callback?: () => void): void;
        _endOperation(imageChanged: boolean): void;
        private _openBtn_Click;
        protected _saveImageBtn_Click(): void;
        protected _interactiveModesBtns_BtnClicked(e: JQueryEventObject): void;
        protected _fitBtn_Click(e: JQueryEventObject): void;
        protected _actualSizeBtn_Click(e: JQueryEventObject): void;
        protected _zoomInBtn_Click(e: JQueryEventObject): void;
        protected _zoomOutBtn_Click(e: JQueryEventObject): void;
        protected _aboutBtn_Click(e: JQueryEventObject): void;
        protected _openFileDlg_FileSelect(selectedIndex: number): void;
        protected _openFileDlg_GoClick(url: string): void;
    }
}
declare module lt.Demos.Basic {
    class DemoImage {
        url: string;
        useDpi: boolean;
        dpi: number;
        isLoadedImageBitonal: boolean;
        constructor(url: string, useDpi: boolean, dpi: number, isLoadedImageBitonal: boolean);
    }
}
declare module lt.Demos.Basic {
    class PingResponse {
        message: string;
        isLicenseChecked: boolean;
        isLicenseExpired: boolean;
        kernelType: string;
        ocrEngineStatus: OcrEngineStatus;
    }
    enum OcrEngineStatus {
        unset = 0,
        error = 1,
        ready = 2
    }
    interface ServiceConfig {
        licenseDirectory: string;
        serviceHost: string;
        servicePath: string;
        serviceApiPath: string;
    }
    interface ImageInfo {
        uri: string;
        formatId: number;
        formatName: string;
        mimeType: string;
        browserCompatible: boolean;
        width: number;
        height: number;
        bitsPerPixel: number;
        bytesPerLine: number;
        sizeDisk: number;
        sizeMemory: number;
        compression: string;
        viewPerspective: string;
        order: string;
        colorSpace: string;
        pageNumber: number;
        totalPages: number;
        hasResolution: boolean;
        xResolution: number;
        yResolution: number;
        isRotated: boolean;
        isSigned: boolean;
        hasAlpha: boolean;
    }
    class ServiceHelper {
        static ServiceConfigJSONPath: string;
        static init(): void;
        private static _serviceHost;
        static serviceHost: string;
        private static _servicePath;
        static servicePath: string;
        private static _serviceApiPath;
        static serviceApiPath: string;
        private static _serviceUri;
        static readonly serviceUri: string;
        private static buildServiceUrl;
        private static clean;
        private static _serviceTestResource;
        static serviceTestResource: string;
        static verifyService(): JQueryXHR;
        static addParamsToUrl(url: string, params: {}): string;
    }
}
declare module lt.Demos.Basic {
    module Utils {
        class Slider {
            private static attr_slider;
            private static class_buttons_visible;
            private static class_button_disabled;
            private static class_button_left;
            private static class_button_right;
            private static class_view;
            private static class_list;
            private $root;
            private $view;
            private $left;
            private $right;
            private $list;
            private scrollOn;
            private scrollOffset;
            private viewWidth;
            static search(): void;
            static create(root: HTMLElement): Slider;
            constructor(root: HTMLElement);
            private scroll;
            private checkDisabled;
            private resize;
            private scrollButton;
        }
    }
}
