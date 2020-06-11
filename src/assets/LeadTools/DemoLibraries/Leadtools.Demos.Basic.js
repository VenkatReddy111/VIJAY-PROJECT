// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Basic;
        (function (Basic) {
            var DemoInteractiveMode = /** @class */ (function () {
                function DemoInteractiveMode(mode, reset) {
                    this.resetToPanZoom = reset;
                    this.interactiveMode = mode;
                }
                return DemoInteractiveMode;
            }());
            Basic.DemoInteractiveMode = DemoInteractiveMode;
            var CommonApp = /** @class */ (function () {
                function CommonApp() {
                    this._useService = true;
                    this._loadImagesFromService = true;
                    // Array of interactive modes that used by the demo
                    this._interactiveModes = [];
                    // Common UI elements 
                    this._commonUI = {
                        imageViewerDiv: "imageViewerDiv",
                        openBtn: "#openFile",
                        saveImageBtn: "#saveImage",
                        /* Used when resetToPanZoom in DemoInteractiveMode class is set to true */
                        panZoomBtn: "#panZoom",
                        interactiveModesBtns: ".interactiveModesBtns",
                        fitBtn: "#fit", actualSizeBtn: "#actualSize",
                        zoomInBtn: "#zoomIn", zoomOutBtn: "#zoomOut",
                        aboutBtn: "#about",
                        toggleMobileMenuSource: "#navbar .navbar-toggle",
                        toggleMobileMenuTarget: "#navbar, #leftPanel, #leftPanelOpen",
                        toggleMobileLeftPanelSource: "#leftPanelOpen, #leftPanel .side-panel-title",
                        toggleMobileLeftPanelTarget: "#main",
                    };
                    this._demoRequiresOCR = false;
                    this._ocrReady = false;
                    this._createViewerInElementsMode = false;
                }
                CommonApp.prototype._dispose = function () {
                    if (this._imageViewer)
                        this._imageViewer.dispose();
                };
                // Virtual method
                CommonApp.prototype.run = function () {
                    // Set the LEADTOOLS Evaluation license
                    lt.RasterSupport.setLicenseUri("https://demo.leadtools.com/licenses/v200/LEADTOOLSEVAL.txt", "h0n08kw2clsS2WTtxzW94EMTdcHTklRXH9aT4EPYU0otTPm3", null);
                    window.onunload = this._dispose.bind(this);
                    // Set demo images
                    this._demoImages = this._demoImages;
                    // Initial setup
                    this._initUI();
                    // Add a 'type="button"' to all buttons in IE9 and IE10
                    // Prevents random button clickings due to <form> bugs
                    Demos.Utils.UI.ensureSafeIEButtons();
                    this._initDialogs();
                    this._initViewer();
                    this._initInteractiveModes();
                    this._bindInteractiveModes();
                    // Sometimes service connection values need to be specified outside of the client side code, like in a configuration file.
                    // Here we show how that approach is used, and provide manual setting of the properties as a backup.
                    this._verifyService();
                };
                CommonApp.prototype._verifyService = function () {
                    var _this = this;
                    // Ensure jQuery support for IE9
                    $.support.cors = true;
                    this._beginOperation("Verifying Service Connection...", function () {
                        $.getJSON(Basic.ServiceHelper.ServiceConfigJSONPath)
                            .done(_this._initService)
                            .fail(_this._initService)
                            .always(function () {
                            // Regardless of what happens, this runs after.
                            Basic.ServiceHelper.verifyService()
                                .done(function (response) {
                                // Check if the LEADTOOLS license on the server is usable, otherwise, show a warning
                                if (!response.isLicenseChecked) {
                                    // The server has failed to check the license, could be an invalid license or one that does not exist
                                    var warnMessage = "Warning!\n\nThe LEADTOOLS License used in the service could not be found. This demo may not function as expected.";
                                    lt.LTHelper.logWarning(warnMessage);
                                    alert(warnMessage);
                                }
                                else if (response.isLicenseExpired) {
                                    // The server has detected that the license used has expired
                                    var warnMessage = "Warning!\n\nThe LEADTOOLS Kernel has expired. This demo may not function as expected.";
                                    lt.LTHelper.logWarning(warnMessage);
                                    alert(warnMessage);
                                }
                                // If the kernel is not release, log it (for debugging)
                                if (response.kernelType != null && response.kernelType != "Release") {
                                    lt.LTHelper.log("Server LEADTOOLS Kernel type: " + response.kernelType);
                                }
                                if (response.ocrEngineStatus !== Basic.OcrEngineStatus.ready) {
                                    // The OCR Engine on the service is not working properly
                                    var needsOCR = _this._demoRequiresOCR;
                                    var message = needsOCR ? "This demo cannot run:\n" : "";
                                    if (response.ocrEngineStatus === Basic.OcrEngineStatus.unset) {
                                        message += "The LEADTOOLS OCR Engine Runtime was not set on the service, so OCR is not supported.";
                                        lt.LTHelper.logWarning(message);
                                    }
                                    else if (response.ocrEngineStatus === Basic.OcrEngineStatus.error) {
                                        message += "The LEADTOOLS OCR Engine setup experienced an error on the service, so OCR is not supported.";
                                        lt.LTHelper.logError(message);
                                    }
                                    if (needsOCR) {
                                        alert(message);
                                        _this._endOperation(false);
                                        return;
                                    }
                                }
                                else {
                                    _this._ocrReady = true;
                                }
                                _this._onServiceVerified();
                                _this._startDemo();
                            })
                                .fail(function (xhr, statusText, errorThrown) {
                                // On Failure
                                _this._endOperation(false);
                                var failMessage = "The LEADTOOLS Service could not be reached.\nEnsure the service is running and the correct paths have been set in serviceConfig.json.";
                                ;
                                alert(failMessage);
                                lt.LTHelper.logError(failMessage);
                                _this._onServiceVerified();
                            });
                        });
                    });
                };
                CommonApp.prototype._onServiceVerified = function () {
                    // To be overridden
                };
                Object.defineProperty(CommonApp.prototype, "ocrReady", {
                    get: function () {
                        return this._ocrReady;
                    },
                    enumerable: true,
                    configurable: true
                });
                CommonApp.prototype._startDemo = function () {
                    // If user specified "?...url=....", use the url
                    var url = Demos.Utils.Network.queryString["url"];
                    if (url && url[0]) {
                        this._loadImageFromURL(url[0]);
                    }
                    else if (this._demoImages && this._demoImages.length > 0)
                        this._loadDemoImage(0);
                };
                CommonApp.prototype._initService = function (json) {
                    Basic.ServiceHelper.init();
                    // If you have a different route to verify service, change it here
                    //ServiceHelper.serviceTestResource = "Path/To/Ping"
                    json = json || {};
                    var licDir = json.licenseDirectory !== undefined ? json.licenseDirectory : CommonApp._defaultServiceConfig.licenseDirectory;
                    if (!!licDir)
                        lt.LTHelper.licenseDirectory = licDir;
                    Basic.ServiceHelper.serviceHost = json.serviceHost !== undefined ? json.serviceHost : CommonApp._defaultServiceConfig.serviceHost;
                    Basic.ServiceHelper.servicePath = json.servicePath !== undefined ? json.servicePath : CommonApp._defaultServiceConfig.servicePath;
                    Basic.ServiceHelper.serviceApiPath = json.serviceApiPath !== undefined ? json.serviceApiPath : CommonApp._defaultServiceConfig.serviceApiPath;
                };
                CommonApp.prototype._initUI = function () {
                    var _this = this;
                    // Bind events to UI elements
                    $(this._commonUI.openBtn).bind("click", this._openBtn_Click.bind(this));
                    $(this._commonUI.interactiveModesBtns).bind("click", this._interactiveModesBtns_BtnClicked.bind(this));
                    $(this._commonUI.fitBtn).bind("click", this._fitBtn_Click.bind(this));
                    $(this._commonUI.actualSizeBtn).bind("click", this._actualSizeBtn_Click.bind(this));
                    $(this._commonUI.zoomInBtn).bind("click", this._zoomInBtn_Click.bind(this));
                    $(this._commonUI.zoomOutBtn).bind("click", this._zoomOutBtn_Click.bind(this));
                    $(this._commonUI.aboutBtn).bind("click", this._aboutBtn_Click.bind(this));
                    // The save button must be bound as simply as possible so the browser doesn't believe it's a malicious popup
                    var saveImageButton = document.querySelector(this._commonUI.saveImageBtn);
                    if (saveImageButton) {
                        saveImageButton.onclick = this._saveImageBtn_Click.bind(this);
                    }
                    // Hook up our dynamic menu slider
                    Basic.Utils.Slider.search();
                    // Hook up the toggle for the mobile menu bar
                    $(this._commonUI.toggleMobileMenuSource).bind("click", function () {
                        $(_this._commonUI.toggleMobileMenuTarget).toggleClass("lt-toggle-nav-open");
                    });
                    // Hook up the toggle for the mobile left panel
                    $(this._commonUI.toggleMobileLeftPanelSource).bind("click", function () {
                        $(_this._commonUI.toggleMobileLeftPanelTarget).toggleClass("lt-toggle-open");
                    });
                };
                CommonApp.prototype._initDialogs = function () {
                    this._openFileDlg = new Demos.Dialogs.OpenFileDialog($("#openFileDialog"), {
                        itemSelect: "#fileSelect",
                        urlInput: {
                            container: "#urlDiv",
                            textInput: "#fileUrl",
                            acceptButton: "#goBtn"
                        },
                        hide: ".dlg-close, .dlg-close-x"
                    });
                    this._openFileDlg.onUrlGoClick = this._openFileDlg_GoClick.bind(this);
                    this._openFileDlg.onIndexSelected = this._openFileDlg_FileSelect.bind(this);
                    this._loadingDlg = new Demos.Dialogs.LoadingDialog($("#loadingDialog"), {
                        title: "#processText"
                    });
                    this._aboutDlg = new Demos.Dialogs.AboutDialog($("#aboutDialog"), {
                        title: "#demoName",
                        hide: ".dlg-close, .dlg-close-x"
                    });
                    this._aboutDlg.name = this._demoName;
                };
                CommonApp.prototype._initViewer = function () {
                    // For interpolation (scaleToGray and resample)
                    lt.Controls.ImageViewer.imageProcessingLibrariesPath = "Common/Libs";
                    var createOptions = new lt.Controls.ImageViewerCreateOptions(document.getElementById(this._commonUI.imageViewerDiv));
                    createOptions.useElements = this._createViewerInElementsMode || false;
                    var imageViewer = new lt.Controls.ImageViewer(createOptions);
                    imageViewer.autoCreateCanvas = !createOptions.useElements;
                    imageViewer.itemError.add(this._viewer_ItemError.bind(this));
                    imageViewer.itemChanged.add(this._viewer_ItemChanged.bind(this));
                    imageViewer.viewHorizontalAlignment = lt.Controls.ControlAlignment.center;
                    imageViewer.viewVerticalAlignment = lt.Controls.ControlAlignment.center;
                    imageViewer.autoResetOptions = lt.Controls.ImageViewerAutoResetOptions.all;
                    if (lt.LTHelper.msPointerEnabled && !lt.LTHelper.supportsMouse)
                        imageViewer.scrollMode = lt.Controls.ControlScrollMode.hidden;
                    this._imageViewer = imageViewer;
                };
                CommonApp.prototype._viewer_ItemError = function (sender, e) {
                    window.alert("Cannot open: " + this._tempImageUrl);
                    this._endOperation(false);
                };
                CommonApp.prototype._viewer_ItemChanged = function (sender, e) {
                    if (e.reason == lt.Controls.ImageViewerItemChangedReason.url) {
                        this._endOperation(true);
                    }
                };
                CommonApp.prototype._initInteractiveModes = function () {
                    this._interactiveModes = [];
                    // All demos use Pan/Zoom mode
                    var panZoom = new lt.Controls.ImageViewerPanZoomInteractiveMode();
                    panZoom.doubleTapSizeMode = lt.Controls.ControlSizeMode.none;
                    panZoom.inertiaScrollOptions.isEnabled = true;
                    this._interactiveModes.push(new DemoInteractiveMode(panZoom, false));
                    // Only add MagnifyGlass if not in useElements mode
                    if (!this._imageViewer.useElements) {
                        this._interactiveModes.push(new DemoInteractiveMode(new lt.Controls.ImageViewerMagnifyGlassInteractiveMode(), false));
                    }
                };
                CommonApp.prototype._bindInteractiveModes = function () {
                    var _this = this;
                    var backToPanZoomOnCompleted = function () {
                        // Unmark all interactive modes buttons
                        Demos.Utils.UI.toggleChecked($(_this._commonUI.interactiveModesBtns), false);
                        // Mark the pan/zoom button
                        var $panZoom = $(_this._commonUI.panZoomBtn);
                        Demos.Utils.UI.toggleChecked($panZoom, true);
                        // Go back to Pan and Zoom mode
                        var $allInteractiveBtns = $(_this._commonUI.interactiveModesBtns);
                        _this._imageViewer.defaultInteractiveMode = _this._interactiveModes[$allInteractiveBtns.index($panZoom)].interactiveMode;
                    };
                    var panZoomMode;
                    for (var i = 0; i < this._interactiveModes.length; i++) {
                        var mode = this._interactiveModes[i];
                        var interactiveMode = mode.interactiveMode;
                        if (interactiveMode) {
                            if (interactiveMode.name === "PanZoom") {
                                panZoomMode = mode;
                                interactiveMode.idleCursor = "move";
                                interactiveMode.workingCursor = "pointer";
                            }
                            else {
                                interactiveMode.idleCursor = "crosshair";
                                interactiveMode.workingCursor = "crosshair";
                            }
                            interactiveMode.workOnBounds = true;
                            if (mode.resetToPanZoom)
                                interactiveMode.workCompleted.add(backToPanZoomOnCompleted);
                        }
                    }
                    // Always try to start with the Pan/Zoom mode
                    this._imageViewer.defaultInteractiveMode = panZoomMode ? panZoomMode.interactiveMode : this._interactiveModes[0].interactiveMode;
                };
                CommonApp.prototype._toggleViewerMode = function (elementsModeOn) {
                    if (!this._imageViewer)
                        return;
                    var wasElementsModeOn = this._imageViewer.useElements;
                    this._createViewerInElementsMode = typeof elementsModeOn !== "undefined" ? elementsModeOn : !wasElementsModeOn;
                    if (this._createViewerInElementsMode === wasElementsModeOn)
                        return;
                    if (this._imageViewer) {
                        this._imageViewer.dispose();
                        this._imageViewer = null;
                    }
                    this._initViewer();
                    this._initInteractiveModes();
                    this._bindInteractiveModes();
                };
                CommonApp.prototype._loadDemoImage = function (index) {
                    var _this = this;
                    var demoImage = this._demoImages[index];
                    var url = "Resources/Samples/" + demoImage.url;
                    var location = window.location.href;
                    // Remove the application name
                    this._tempImageUrl = location.substring(0, location.lastIndexOf("/") + 1) + url;
                    if (this._imageViewer.imageUrl === url)
                        return;
                    this._beginOperation("Please Wait... Loading New Image", function () {
                        // Set the DPI when the image has finished loading.
                        if (demoImage.useDpi)
                            _this._imageDPI = demoImage.dpi;
                        else
                            _this._imageDPI = 0;
                        _this._isLoadedBitonal = demoImage.isLoadedImageBitonal;
                        _this._imageViewer.beginUpdate();
                        _this._imageViewer.imageUrl = url;
                        _this._imageViewer.endUpdate();
                    });
                };
                CommonApp.prototype._loadImageFromURL = function (url) {
                    var _this = this;
                    this._beginOperation("Please Wait... Loading New Image");
                    // Reset DPI
                    this._imageDPI = 0;
                    // Disable 1BPP
                    this._isLoadedBitonal = false;
                    if (this._loadImagesFromService) {
                        var rest = [Basic.ServiceHelper.serviceUri, "Raster", "Info"].join("/");
                        var params = {
                            uri: url
                        };
                        $.get(rest, params)
                            .done(function (info) {
                            if (info.formatId === 0) {
                                window.alert("Unrecognized image file format.");
                                return;
                            }
                            // Save the DPI
                            _this._imageDPI = info.xResolution;
                            // 1BPP (bitonal B/W image)
                            _this._isLoadedBitonal = (info.bitsPerPixel === 1);
                            var width = 0;
                            var height = 0;
                            if (lt.LTHelper.device == lt.LTDevice.mobile || lt.LTHelper.device == lt.LTDevice.tablet) {
                                // To save bandwidth and memory on mobile devices, and to get around the
                                // iOS limitation of loading large image sizes, limit the maximum image size
                                // to 1000 by 1000 pixels
                                width = 1000;
                                height = 1000;
                                _this._imageDPI = 0; // Since we resized the image, the DPI is not true anymore
                            }
                            // Now load it
                            var imageRest = [Basic.ServiceHelper.serviceUri, "Raster", "Load"].join("/");
                            var imageParams = {
                                uri: url
                            };
                            if (width != 0 && height != 0) {
                                imageParams["width"] = width;
                                imageParams["height"] = height;
                            }
                            imageRest = Basic.ServiceHelper.addParamsToUrl(imageRest, imageParams);
                            _this._tempImageUrl = url;
                            _this._imageViewer.imageUrl = imageRest;
                        })
                            .fail(function (xhr, statusText, errorThrown) {
                            _this._endOperation(false);
                            Demos.Utils.Network.showRequestError(xhr, statusText, errorThrown);
                        });
                    }
                    else {
                        // Load it directly
                        this._tempImageUrl = url;
                        this._imageViewer.imageUrl = url;
                    }
                };
                CommonApp.prototype._beginOperation = function (processText, callback) {
                    this._loadingDlg.show(processText, callback);
                };
                CommonApp.prototype._endOperation = function (imageChanged) {
                    this._loadingDlg.hide();
                    if (imageChanged) {
                        this._currentImageUrl = this._tempImageUrl;
                        this._imageViewer.beginUpdate();
                        var resolution = lt.LeadSizeD.create(this._imageDPI == 0 ? 96 : this._imageDPI, this._imageDPI == 0 ? 96 : this._imageDPI);
                        this._imageViewer.imageResolution = resolution;
                        this._imageViewer.useDpi = (this._imageDPI != 0);
                        if (lt.LTHelper.device == lt.LTDevice.mobile || lt.LTHelper.device == lt.LTDevice.tablet) {
                            // Default on tablet and mobile is to fit width
                            this._imageViewer.zoom(lt.Controls.ControlSizeMode.fitWidth, 1, this._imageViewer.defaultZoomOrigin);
                        }
                        this._imageViewer.endUpdate();
                    }
                    this._tempImageUrl = null;
                };
                // Common UI events handlers
                CommonApp.prototype._openBtn_Click = function (e) {
                    this._openFileDlg.show();
                };
                CommonApp.prototype._saveImageBtn_Click = function () {
                    var canvas = this._imageViewer.canvas;
                    // Check if the viewer has a canvas
                    if (!canvas) {
                        // if not, create one and draw the image on it
                        var imageSize = this._imageViewer.imageSize;
                        canvas = document.createElement("canvas");
                        canvas.width = imageSize.width;
                        canvas.height = imageSize.height;
                        var context = canvas.getContext("2d");
                        context.drawImage(this._imageViewer.image, 0, 0, imageSize.width, imageSize.height);
                    }
                    var dataUrl = canvas.toDataURL("image/png");
                    var saveWindow = window.open("about:blank", "_blank");
                    // Is the save window opened?
                    if (!saveWindow || typeof saveWindow === "undefined")
                        alert("Your Popup Blocker may have blocked saving the image. Disable the Popup Blocker for this web site and try again.");
                    else
                        saveWindow.document.write("<img src='" + dataUrl + "' alt='Viewer does not contain image'/>");
                };
                // Handle all interactive modes buttons, which behave as radio buttons
                CommonApp.prototype._interactiveModesBtns_BtnClicked = function (e) {
                    // Unmark all interactive modes buttons
                    var $allInteractiveBtns = $(this._commonUI.interactiveModesBtns);
                    Demos.Utils.UI.toggleChecked($allInteractiveBtns, false);
                    // Mark the selected one
                    var $selected = $(e.currentTarget);
                    Demos.Utils.UI.toggleChecked($selected, true);
                    var modeIndex = $allInteractiveBtns.index($selected);
                    this._imageViewer.defaultInteractiveMode = this._interactiveModes[modeIndex].interactiveMode;
                };
                CommonApp.prototype._fitBtn_Click = function (e) {
                    this._imageViewer.zoom(lt.Controls.ControlSizeMode.fitAlways, 1.0, this._imageViewer.defaultZoomOrigin);
                    this._imageViewer.scrollOffset = lt.LeadPointD.create(0, 0);
                };
                CommonApp.prototype._actualSizeBtn_Click = function (e) {
                    this._imageViewer.zoom(lt.Controls.ControlSizeMode.actualSize, 1.0, this._imageViewer.defaultZoomOrigin);
                    this._imageViewer.scrollOffset = lt.LeadPointD.create(0, 0);
                };
                CommonApp.prototype._zoomInBtn_Click = function (e) {
                    var newScaleFactor = this._imageViewer.scaleFactor + 0.1;
                    if (newScaleFactor <= this._imageViewer.maximumScaleFactor) {
                        this._imageViewer.zoom(lt.Controls.ControlSizeMode.none, newScaleFactor, this._imageViewer.defaultZoomOrigin);
                    }
                };
                CommonApp.prototype._zoomOutBtn_Click = function (e) {
                    var newScaleFactor = this._imageViewer.scaleFactor - 0.1;
                    if (newScaleFactor >= this._imageViewer.minimumScaleFactor) {
                        this._imageViewer.zoom(lt.Controls.ControlSizeMode.none, newScaleFactor, this._imageViewer.defaultZoomOrigin);
                    }
                };
                CommonApp.prototype._aboutBtn_Click = function (e) {
                    this._aboutDlg.show();
                };
                // Open file dialog events handlars
                CommonApp.prototype._openFileDlg_FileSelect = function (selectedIndex) {
                    this._loadDemoImage(selectedIndex);
                };
                CommonApp.prototype._openFileDlg_GoClick = function (url) {
                    if (url != null && url.length > 0) {
                        this._loadImageFromURL(url);
                    }
                };
                // These values are used if serviceConfig or any properties are not found.
                CommonApp._defaultServiceConfig = {
                    licenseDirectory: null,
                    serviceHost: null,
                    servicePath: "",
                    serviceApiPath: "api"
                };
                return CommonApp;
            }());
            Basic.CommonApp = CommonApp;
        })(Basic = Demos.Basic || (Demos.Basic = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Basic;
        (function (Basic) {
            var DemoImage = /** @class */ (function () {
                function DemoImage(url, useDpi, dpi, isLoadedImageBitonal) {
                    this.url = url;
                    this.useDpi = useDpi;
                    this.dpi = dpi;
                    this.isLoadedImageBitonal = isLoadedImageBitonal;
                }
                return DemoImage;
            }());
            Basic.DemoImage = DemoImage;
        })(Basic = Demos.Basic || (Demos.Basic = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Basic;
        (function (Basic) {
            // Return value from Service Ping
            var PingResponse = /** @class */ (function () {
                function PingResponse() {
                }
                return PingResponse;
            }());
            Basic.PingResponse = PingResponse;
            var OcrEngineStatus;
            (function (OcrEngineStatus) {
                OcrEngineStatus[OcrEngineStatus["unset"] = 0] = "unset";
                OcrEngineStatus[OcrEngineStatus["error"] = 1] = "error";
                OcrEngineStatus[OcrEngineStatus["ready"] = 2] = "ready";
            })(OcrEngineStatus = Basic.OcrEngineStatus || (Basic.OcrEngineStatus = {}));
            var ServiceHelper = /** @class */ (function () {
                function ServiceHelper() {
                }
                // Build our service url for the first time
                // Only needed once per life of application
                ServiceHelper.init = function () {
                    ServiceHelper._serviceUri = ServiceHelper.buildServiceUrl();
                };
                Object.defineProperty(ServiceHelper, "serviceHost", {
                    get: function () { return ServiceHelper._serviceHost; },
                    set: function (value) {
                        ServiceHelper._serviceHost = value;
                        ServiceHelper._serviceUri = ServiceHelper.buildServiceUrl();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ServiceHelper, "servicePath", {
                    get: function () { return ServiceHelper._servicePath; },
                    set: function (value) {
                        ServiceHelper._servicePath = value;
                        ServiceHelper._serviceUri = ServiceHelper.buildServiceUrl();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ServiceHelper, "serviceApiPath", {
                    get: function () { return ServiceHelper._serviceApiPath; },
                    set: function (value) {
                        ServiceHelper._serviceApiPath = value;
                        ServiceHelper._serviceUri = ServiceHelper.buildServiceUrl();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ServiceHelper, "serviceUri", {
                    get: function () { return ServiceHelper._serviceUri; },
                    enumerable: true,
                    configurable: true
                });
                ServiceHelper.buildServiceUrl = function () {
                    // set up our service url
                    var serviceUri = null;
                    var location = window.location;
                    var serviceHost = ServiceHelper._serviceHost;
                    var servicePath = ServiceHelper._servicePath;
                    var serviceApiPath = ServiceHelper._serviceApiPath;
                    // get protocol, host, and port ( "http:" + // + "localhost" + : + "8080")
                    if (serviceHost == null)
                        serviceUri = location.protocol + "//" + location.host;
                    else
                        serviceUri = serviceHost;
                    // get serviceApp  ( /path/to/service )
                    if (servicePath == null) {
                        var pathname = location.pathname;
                        // If we are on a page instead of in a directory (we are at .../___.html),
                        // then only keep the path to the directory
                        var dotIndex = pathname.indexOf(".");
                        if (dotIndex > -1) {
                            var lastSlashIndex = pathname.lastIndexOf("/");
                            if (lastSlashIndex > -1)
                                pathname = pathname.substring(0, lastSlashIndex);
                        }
                        serviceUri += ServiceHelper.clean(pathname); // starts with "/"
                    }
                    else {
                        serviceUri += ServiceHelper.clean(servicePath);
                    }
                    // api path ( 'api' )
                    if (serviceApiPath != null && serviceApiPath.length > 0)
                        serviceUri += ServiceHelper.clean(serviceApiPath);
                    return serviceUri;
                };
                ServiceHelper.clean = function (value) {
                    var length = value.length;
                    if (value.charAt(0) !== "/") {
                        //value = value.substring(1, length - 1);
                        value = "/" + value;
                        length += 1;
                    }
                    if (value.charAt(length - 1) === "/")
                        value = value.substring(0, length - 1);
                    return value;
                };
                Object.defineProperty(ServiceHelper, "serviceTestResource", {
                    get: function () { return ServiceHelper._serviceTestResource; },
                    set: function (value) {
                        ServiceHelper._serviceTestResource = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                // Checks that the service is properly working
                // For use before anything else
                ServiceHelper.verifyService = function () {
                    var serviceUrl = [ServiceHelper.serviceUri, ServiceHelper.serviceTestResource].join("/");
                    var d = $.Deferred();
                    return $.get(serviceUrl);
                };
                ServiceHelper.addParamsToUrl = function (url, params) {
                    url += "?";
                    var keys = Object.keys(params);
                    keys.forEach(function (key, idx) {
                        url += key + "=" + params[key];
                        if (idx != keys.length - 1) {
                            url += "&";
                        }
                    });
                    return url;
                };
                ServiceHelper.ServiceConfigJSONPath = "serviceConfig.json";
                // Meant for host, such as "localhost:1234"
                ServiceHelper._serviceHost = null;
                // Meant for service name and path to it, such as "this/that/myService"
                ServiceHelper._servicePath = null;
                // Meant for path to service's API endpoints, such as "api" or "routing/controllers"
                ServiceHelper._serviceApiPath = null;
                // The combined serviceUri to use
                ServiceHelper._serviceUri = null;
                // The default resource to send a request for to ensure the service is properly set up
                // Usually a "Ping" method or similar
                ServiceHelper._serviceTestResource = "Test/Ping";
                return ServiceHelper;
            }());
            Basic.ServiceHelper = ServiceHelper;
        })(Basic = Demos.Basic || (Demos.Basic = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var lt;
(function (lt) {
    var Demos;
    (function (Demos) {
        var Basic;
        (function (Basic) {
            var Utils;
            (function (Utils) {
                // UI Component used in some basic demos to provide a scrollable menu bar with buttons.
                // Must be found from HTML markup
                var Slider = /** @class */ (function () {
                    function Slider(root) {
                        // Initial checks
                        if (!root)
                            throw new Error("No element provided");
                        this.$root = $(root);
                        var parentNode = root.parentNode;
                        if (!parentNode)
                            throw new Error("Root does not have parent node");
                        // init
                        this.scrollOn = false;
                        this.scrollOffset = 0;
                        this.viewWidth = 0;
                        // Left is the designated class, else we exit
                        var left = root.querySelector("." + Slider.class_button_left);
                        if (!left) {
                            throw new Error("No left button element");
                        }
                        this.$left = $(left);
                        this.$left.click(this.scrollButton.bind(this, true));
                        // Right is the designated class, else we exit
                        var right = root.querySelector("." + Slider.class_button_right);
                        if (!right) {
                            throw new Error("No right button element");
                        }
                        this.$right = $(right);
                        this.$right.click(this.scrollButton.bind(this, false));
                        // View is the designated class, else we exit
                        var view = root.querySelector("." + Slider.class_view);
                        if (!view) {
                            throw new Error("No view element");
                        }
                        this.$view = $(view);
                        this.$view.scroll(this.scroll.bind(this));
                        // List is the designated class or the first (ul | ol), else we exit
                        var list = root.querySelector("." + Slider.class_list);
                        if (!list) {
                            var lists = Array.prototype.slice.call(root.querySelectorAll("ol, ul"));
                            if (lists.length)
                                list = lists[0];
                            else
                                throw new Error("No list element");
                        }
                        this.$list = $(list);
                        // Add the scroll bar styles for mobile and desktop
                        var attrValue = "desktop";
                        if (lt.LTHelper.device == lt.LTDevice.tablet)
                            attrValue = "tablet";
                        else if (lt.LTHelper.device == lt.LTDevice.mobile)
                            attrValue = "mobile";
                        this.$root.attr(Slider.attr_slider, attrValue);
                        // Add the resize, and run it once
                        window.addEventListener("resize", this.resize.bind(this));
                        this.resize();
                    }
                    // Static Constructor
                    Slider.search = function () {
                        $("[" + Slider.attr_slider + "]").each(function () {
                            Slider.create(this);
                        });
                    };
                    Slider.create = function (root) {
                        return new Slider(root);
                    };
                    Slider.prototype.scroll = function () {
                        this.scrollOffset = this.$view.scrollLeft();
                        this.checkDisabled();
                    };
                    Slider.prototype.checkDisabled = function () {
                        if (this.scrollOn) {
                            var view = this.$view.get(0);
                            this.$left.toggleClass(Slider.class_button_disabled, this.scrollOffset === 0);
                            this.$left.prop("disabled", this.scrollOffset === 0);
                            this.$right.toggleClass(Slider.class_button_disabled, this.scrollOffset + view.clientWidth === view.scrollWidth);
                            this.$right.prop("disabled", this.scrollOffset + view.clientWidth === view.scrollWidth);
                        }
                    };
                    Slider.prototype.resize = function () {
                        // update our state
                        this.scrollOffset = this.$view.scrollLeft();
                        var view = this.$view.get(0);
                        this.scrollOn = view.scrollWidth > view.clientWidth;
                        // Based on whether scrolling is present, show the buttons
                        if (this.scrollOn) {
                            this.$root.addClass(Slider.class_buttons_visible);
                            this.checkDisabled();
                        }
                        else {
                            this.$root.removeClass(Slider.class_buttons_visible);
                        }
                    };
                    Slider.prototype.scrollButton = function (doScrollLeft) {
                        var fudge = 30;
                        var change = this.$view.outerWidth(true) / 2;
                        if (doScrollLeft) {
                            change = this.scrollOffset - change;
                            if (change <= fudge)
                                change = 0;
                        }
                        else {
                            change = this.scrollOffset + change;
                            var scrollWidth = this.$view.get(0).scrollWidth;
                            var clientWidth = this.$view.get(0).clientWidth;
                            if (change + fudge + clientWidth >= scrollWidth)
                                change = change + fudge;
                        }
                        var options = {
                            duration: 200,
                            complete: this.scroll.bind(this)
                        };
                        this.$view.animate({ scrollLeft: change }, options);
                    };
                    // attr to look for in HTML
                    Slider.attr_slider = "data-lt-slider";
                    // our classes
                    //private static class_button_left_visible: string = "lt-slider-left-on";
                    //private static class_button_right_visible: string = "lt-slider-right-on";
                    Slider.class_buttons_visible = "lt-slider-buttons-on";
                    Slider.class_button_disabled = "lt-slider-button-disabled";
                    // our classes for element discovery
                    Slider.class_button_left = "lt-slider-left";
                    Slider.class_button_right = "lt-slider-right";
                    Slider.class_view = "lt-slider-view";
                    Slider.class_list = "lt-slider-list";
                    return Slider;
                }());
                Utils.Slider = Slider;
            })(Utils = Basic.Utils || (Basic.Utils = {}));
        })(Basic = Demos.Basic || (Demos.Basic = {}));
    })(Demos = lt.Demos || (lt.Demos = {}));
})(lt || (lt = {}));
