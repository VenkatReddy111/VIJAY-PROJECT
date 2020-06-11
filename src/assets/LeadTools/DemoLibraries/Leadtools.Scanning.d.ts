declare module lt.Scanning.JavaScript {
    class SaneScanning implements lt.Scanning.JavaScript.IScanning {
        private _service;
        constructor(portNumber: number);
        init(onSuccess: () => void, onFailure: (err: string) => void): void;
        getStatus(onSuccess: (status: lt.Scanning.JavaScript.ScanningStatus) => void, onFailure: (errMessage: string) => void): void;
        getSources(onSuccess: (sources: string[]) => void, onFailure: (err: string) => void): void;
        selectSource(sourceName: string, onSuccess: () => void, onFailure: (err: string) => void): void;
        acquire(onSuccess: (status: lt.Scanning.JavaScript.ScanningStatus) => void, onFailure: (err: string) => void): void;
        getPage(pageNumber: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, width: number, height: number): string;
        stop(onSuccess: () => void, onFailure: (arg: string) => void): void;
        start(onSuccess: () => void, onFailure: (arg: string) => void): void;
        applyImageProcessingCommand(firstPageNumber: number, lastPageNumber: number, commandName: string, args: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        getImageProcessingPreview(pageNumber: number, commandName: string, args: any, width: number, height: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number): string;
        runCommand(commandName: string, args: any, userData: any): string;
        getHandle(): any;
    }
}
declare module lt.Scanning.JavaScript {
    class TwainScanning implements lt.Scanning.JavaScript.IScanning {
        private _service;
        constructor(serviceUrl: string);
        init(onSuccess: () => void, onFailure: (err: string) => void): void;
        getStatus(onSuccess: (status: lt.Scanning.JavaScript.ScanningStatus) => void, onFailure: (errMessage: string) => void): void;
        isAvailable(onSuccess: (available: boolean) => void, onFailure: (err: string) => void): void;
        getSources(onSuccess: (sources: string[]) => void, onFailure: (err: string) => void): void;
        selectSource(sourceName: string, onSuccess: () => void, onFailure: (err: string) => void): void;
        acquire(onSuccess: (status: lt.Scanning.JavaScript.ScanningStatus) => void, onFailure: (err: string) => void): void;
        getPage(pageNumber: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, width: number, height: number): string;
        stop(onSuccess: () => void, onFailure: (arg: string) => void): void;
        start(onSuccess: () => void, onFailure: (arg: string) => void): void;
        applyImageProcessingCommand(firstPageNumber: number, lastPageNumber: number, commandName: string, args: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        getImageProcessingPreview(pageNumber: number, commandName: string, args: any, width: number, height: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number): string;
        runCommand(commandName: string, args: any, userData: any): string;
        getHandle(): any;
    }
}
declare module lt.Twain.JavaScript {
    enum TwainContainerType {
        DontCare32 = -1,
        Array = 3,
        Enumeration = 4,
        OneValue = 5,
        Range = 6,
        DsmCodeId = 63,
        DontCare8 = 255,
        DsmId = 461,
        IconId = 962,
        DontCare16 = 65535
    }
    enum TwainUserInterfaceFlags {
        None = 0,
        Show = 1,
        Modal = 2,
        KeepOpen = 32,
        MemoryCheckImageInfo = 64,
        ImageSizeUndefined = 128
    }
    enum TwainItemType {
        Int8 = 0,
        Int16 = 1,
        Int32 = 2,
        Uint8 = 3,
        Uint16 = 4,
        Uint32 = 5,
        Bool = 6,
        Fix32 = 7,
        Frame = 8,
        Str32 = 9,
        Str64 = 10,
        Str128 = 11,
        Str255 = 12,
        Str1024 = 13,
        Uni512 = 14,
        Handle = 15
    }
    enum TwainGetCapabilityMode {
        DontGet = 0,
        GetCurrent = 3,
        GetDefault = 4,
        GetValues = 5
    }
    enum TwainCapabilityType {
        TransferCount = 1,
        ImageCompression = 256,
        ImagePixelType = 257,
        ImageUnits = 258,
        ImageTransferMechanism = 259,
        Author = 4096,
        Caption = 4097,
        FeederEnabled = 4098,
        FeederLoaded = 4099,
        TimeDate = 4100,
        SupportedCaps = 4101,
        ExtendedCaps = 4102,
        AutoFeed = 4103,
        ClearPage = 4104,
        FeedPage = 4105,
        RewindPage = 4106,
        Indicators = 4107,
        SupportedCapsExt = 4108,
        PaperDetectable = 4109,
        UIControllable = 4110,
        DeviceOnline = 4111,
        AutoScan = 4112,
        ThumbnailsEnabled = 4113,
        Duplex = 4114,
        DuplexEnabled = 4115,
        EnabledSuiOnly = 4116,
        CustomDSData = 4117,
        Endorser = 4118,
        JobControl = 4119,
        Alarms = 4120,
        AlarmVolume = 4121,
        AutomaticCapture = 4122,
        TimeBeforeFirstCapture = 4123,
        TimeBetweenCaptures = 4124,
        ClearBuffers = 4125,
        MaxBatchBuffers = 4126,
        DeviceTimeDate = 4127,
        PowerSupply = 4128,
        CameraPreviewUI = 4129,
        DeviceEvent = 4130,
        SerialNumber = 4132,
        Printer = 4134,
        PrinterEnabled = 4135,
        PrinterIndex = 4136,
        PrinterMode = 4137,
        PrinterString = 4138,
        PrinterSuffix = 4139,
        Language = 4140,
        FeederAlignment = 4141,
        FeederOrder = 4142,
        ReacquireAllowed = 4144,
        BatteryMinutes = 4146,
        BatteryPercentage = 4147,
        CameraSide = 4148,
        Segmented = 4149,
        CameraEnabled = 4150,
        CameraOrder = 4151,
        MicrEnabled = 4152,
        FeederPrep = 4153,
        FeederPocket = 4154,
        ImageAutoBright = 4352,
        ImageBrightness = 4353,
        ImageContrast = 4355,
        ImageCustomHalftone = 4356,
        ImageExposureTime = 4357,
        ImageFilter = 4358,
        ImageFlashUsed = 4359,
        ImageGamma = 4360,
        ImageHalftones = 4361,
        ImageHighlight = 4362,
        ImageImageFileFormat = 4364,
        ImageLampState = 4365,
        ImageLightSource = 4366,
        ImageOrientation = 4368,
        ImagePhysicalWidth = 4369,
        ImagePhysicalHeight = 4370,
        ImageShadow = 4371,
        ImageFrames = 4372,
        ImageXNativeResolution = 4374,
        ImageYNativeResolution = 4375,
        ImageXResolution = 4376,
        ImageYResolution = 4377,
        ImageMaxFrames = 4378,
        ImageTiles = 4379,
        ImageBitOrder = 4380,
        ImageCcittKFactor = 4381,
        ImageLightPath = 4382,
        ImagePixelFlavor = 4383,
        ImagePlanarChunky = 4384,
        ImageRotation = 4385,
        ImageSupportedSizes = 4386,
        ImageThreshold = 4387,
        ImageXScaling = 4388,
        ImageYScaling = 4389,
        ImageBitOrderCodes = 4390,
        ImagePixelFlavorCodes = 4391,
        ImageJpegPixelType = 4392,
        ImageTimeFill = 4394,
        ImageBitDepth = 4395,
        ImageBitDepthReduction = 4396,
        ImageUndefinedImageSize = 4397,
        ImageImageDataSet = 4398,
        ImageExtImageInfo = 4399,
        ImageMinimumHeight = 4400,
        ImageMinimumWidth = 4401,
        AutoDiscardBlankPages = 4404,
        ImageFlipRotation = 4406,
        ImageBarcodeDetectionEnabled = 4407,
        ImageSupportedBarcodeTypes = 4408,
        ImageBarcodeMaxSearchPriorities = 4409,
        ImageBarcodeSearchPriorities = 4410,
        ImageBarcodeSearchMode = 4411,
        ImageBarcodeMaxRetries = 4412,
        ImageBarcodeTimeout = 4413,
        ImageZoomFactor = 4414,
        ImagePatchCodeDetectionEnabled = 4415,
        ImageSupportedPatchCodeTypes = 4416,
        ImagePatchCodeMaxSearchPriorities = 4417,
        ImagePatchCodeSearchPriorities = 4418,
        ImagePatchCodeSearchMode = 4419,
        ImagePatchCodeMaxRetries = 4420,
        ImagePatchCodeTimeout = 4421,
        ImageFlashUsed2 = 4422,
        ImageImageFilter = 4423,
        ImageNoiseFilter = 4424,
        ImageOverScan = 4425,
        ImageAutomaticBorderDetection = 4432,
        ImageAutomaticDeskew = 4433,
        ImageAutomaticRotate = 4434,
        ImageJpegQuality = 4435,
        ImageFeederType = 4436,
        ImageIccProfile = 4437,
        ImageAutoSize = 4438,
        AudioAudioFileFormat = 4609,
        AudioTransferMechanism = 4610,
        CustomBase = 32768
    }
    enum RasterImageFormat {
        Unknown = 0,
        Pcx = 1,
        Gif = 2,
        Tif = 3,
        Tga = 4,
        Cmp = 5,
        Bmp = 6,
        Jpeg = 10,
        TifJpeg = 11,
        Os2 = 14,
        Wmf = 15,
        Eps = 16,
        TifLzw = 17,
        Jpeg411 = 21,
        TifJpeg411 = 22,
        Jpeg422 = 23,
        TifJpeg422 = 24,
        Ccitt = 25,
        Lead1Bit = 26,
        CcittGroup31Dim = 27,
        CcittGroup32Dim = 28,
        CcittGroup4 = 29,
        Abc = 32,
        Cals = 50,
        Mac = 51,
        Img = 52,
        Msp = 53,
        Wpg = 54,
        Ras = 55,
        Pct = 56,
        Pcd = 57,
        Dxf12 = 58,
        Dxf = 58,
        Fli = 61,
        Cgm = 62,
        EpsTiff = 63,
        EpsWmf = 64,
        FaxG31Dim = 66,
        FaxG32Dim = 67,
        FaxG4 = 68,
        WfxG31Dim = 69,
        WfxG4 = 70,
        IcaG31Dim = 71,
        IcaG32Dim = 72,
        IcaG4 = 73,
        Os22 = 74,
        Png = 75,
        Psd = 76,
        RawIcaG31Dim = 77,
        RawIcaG32Dim = 78,
        RawIcaG4 = 79,
        Fpx = 80,
        FpxSingleColor = 81,
        FpxJpeg = 82,
        FpxJpegQFactor = 83,
        BmpRle = 84,
        TifCmyk = 85,
        TifLzwCmyk = 86,
        TifPackBits = 87,
        TifPackBitsCmyk = 88,
        DicomGray = 89,
        DicomColor = 90,
        WinIco = 91,
        WinCur = 92,
        TifYcc = 93,
        TifLzwYcc = 94,
        TifPackbitsYcc = 95,
        Exif = 96,
        ExifYcc = 97,
        ExifJpeg = 98,
        ExifJpeg422 = 98,
        Awd = 99,
        ExifJpeg411 = 101,
        PbmAscii = 102,
        PbmBinary = 103,
        PgmAscii = 104,
        PgmBinary = 105,
        PpmAscii = 106,
        PpmBinary = 107,
        Cut = 108,
        Xpm = 109,
        Xbm = 110,
        IffIlbm = 111,
        IffCat = 112,
        Xwd = 113,
        Clp = 114,
        Jbig = 115,
        Emf = 116,
        IcaIbmMmr = 117,
        RawIcaIbmMmr = 118,
        Ani = 119,
        LaserData = 121,
        IntergraphRle = 122,
        IntergraphVector = 123,
        Dwg = 124,
        DicomRleGray = 125,
        DicomRleColor = 126,
        DicomJpegGray = 127,
        DicomJpegColor = 128,
        Cals4 = 129,
        Cals2 = 130,
        Cals3 = 131,
        Xwd10 = 132,
        Xwd11 = 133,
        Flc = 134,
        Kdc = 135,
        Drw = 136,
        Plt = 137,
        TifCmp = 138,
        TifJbig = 139,
        TifDxf = 140,
        TifUnknown = 141,
        Sgi = 142,
        SgiRle = 143,
        Dwf = 145,
        RasPdf = 146,
        RasPdfG31Dim = 147,
        RasPdfG32Dim = 148,
        RasPdfG4 = 149,
        RasPdfJpeg = 150,
        RasPdfJpeg422 = 151,
        RasPdfJpeg411 = 152,
        Raw = 153,
        TifCustom = 155,
        RawRgb = 156,
        RawRle4 = 157,
        RawRle8 = 158,
        RawBitfields = 159,
        RawPackBits = 160,
        RawJpeg = 161,
        RawCcitt = 162,
        FaxG31DimNoEol = 162,
        Jp2 = 163,
        J2k = 164,
        Cmw = 165,
        TifJ2k = 166,
        TifCmw = 167,
        Mrc = 168,
        Gerber = 169,
        Wbmp = 170,
        JpegLab = 171,
        JpegLab411 = 172,
        JpegLab422 = 173,
        GeoTiff = 174,
        TifLead1Bit = 175,
        TifMrc = 177,
        RawLzw = 178,
        RasPdfLzw = 179,
        TifAbc = 180,
        Nap = 181,
        JpegRgb = 182,
        Jbig2 = 183,
        RawIcaAbic = 184,
        Abic = 185,
        TifAbic = 186,
        TifJbig2 = 187,
        RasPdfJbig2 = 188,
        TifZip = 189,
        IcaAbic = 190,
        AfpIcaAbic = 191,
        Postscript = 222,
        Svg = 247,
        Ptoca = 249,
        Sct = 250,
        Pcl = 251,
        Afp = 252,
        IcaUncompressed = 253,
        RawIcaUncompressed = 254,
        Shp = 255,
        Smp = 256,
        SmpG31Dim = 257,
        SmpG32Dim = 258,
        SmpG4 = 259,
        Cmx = 261,
        TgaRle = 262,
        Kdc120 = 263,
        Kdc40 = 264,
        Kdc50 = 265,
        Dcs = 266,
        TifxJbig = 269,
        TifxJbigT43 = 270,
        TifxJbigT43ItuLab = 271,
        TifxJbigT43Gs = 272,
        TifxFaxG4 = 273,
        TifxFaxG31D = 274,
        TifxFaxG32D = 275,
        TifxJpeg = 276,
        Ecw = 277,
        RasRle = 288,
        Dxf13 = 290,
        ClpRle = 291,
        Dcr = 292,
        DicomJ2kGray = 293,
        DicomJ2kColor = 294,
        Fit = 295,
        Crw = 296,
        DwfTextAsPolyline = 297,
        Cin = 298,
        EpsPostscript = 300,
        IntergraphCcittG4 = 301,
        Sff = 302,
        IffIlbmUncompressed = 303,
        IffCatUncompressed = 304,
        RtfRaster = 305,
        Wmz = 307,
        AfpIcaG31Dim = 309,
        AfpIcaG32Dim = 310,
        AfpIcaG4 = 311,
        AfpIcaUncompressed = 312,
        AfpIcaIbmMmr = 313,
        LeadMrc = 314,
        TifLeadMrc = 315,
        Txt = 316,
        PdfLeadMrc = 317,
        Hdp = 318,
        HdpGray = 319,
        HdpCmyk = 320,
        PngIco = 321,
        Xps = 322,
        Jpx = 323,
        XpsJpeg = 324,
        XpsJpeg422 = 325,
        XpsJpeg411 = 326,
        Mng = 327,
        MngGray = 329,
        MngJng = 330,
        MngJng411 = 331,
        MngJng422 = 332,
        RasPdfCmyk = 333,
        RasPdfLzwCmyk = 334,
        Mif = 335,
        E00 = 336,
        Tdb = 337,
        TdbVista = 338,
        Snp = 339,
        AfpIm1 = 340,
        Xls = 341,
        Doc = 342,
        Anz = 343,
        Ppt = 344,
        PptJpeg = 345,
        PptPng = 346,
        Jpm = 347,
        Vff = 348,
        PclXl = 349,
        Docx = 350,
        Xlsx = 351,
        Pptx = 352,
        Jxr = 353,
        JxrGray = 354,
        JxrCmyk = 355,
        Jls = 356,
        Jxr422 = 357,
        Jxr420 = 358,
        DcfArw = 359,
        DcfRaf = 360,
        DcfOrf = 361,
        DcfCr2 = 362,
        DcfNef = 363,
        DcfRw2 = 364,
        DcfCasio = 365,
        DcfPentax = 366,
        JlsLine = 367,
        JlsSample = 368,
        Htm = 369,
        Mob = 370,
        Pub = 371,
        Ing = 372,
        IngRle = 373,
        IngAdaptiveRle = 374,
        IngG4 = 375,
        Dwfx = 376,
        IcaJpeg = 377,
        IcaJpeg411 = 378,
        IcaJpeg422 = 379,
        DcfDng = 380,
        RawFlate = 381,
        RawRle = 382,
        DicomJlsGray = 383,
        DicomJlsColor = 384,
        Pst = 385,
        Msg = 386,
        Eml = 387,
        RasPdfJpx = 388,
        DicomJpxGray = 389,
        DicomJpxColor = 390,
        JpegCmyk = 391,
        JpegCmyk411 = 392,
        JpegCmyk422 = 393,
        TifJpegCmyk = 394,
        TifJpegCmyk411 = 395,
        TifJpegCmyk422 = 396,
        Svgz = 397
    }
    enum TwainVersion {
        Version1 = 1,
        Version2 = 2
    }
}
declare module lt.Scanning.JavaScript {
    class ScanningStatus {
        isScanning: boolean;
        pageCount: number;
        selectedSource: string;
        errCode: number;
        errMessage: string;
    }
    interface IScanning {
        init(onSuccess: () => void, onFailure: (err: string) => void): void;
        getStatus(onSuccess: (status: ScanningStatus) => void, onFailure: (errMessage: string) => void): void;
        getSources(onSuccess: (sources: string[]) => void, onFailure: (err: string) => void): void;
        selectSource(sourceName: string, onSuccess: () => void, onFailure: (err: string) => void): void;
        acquire(onSuccess: (status: ScanningStatus) => void, onFailure: (err: string) => void): void;
        getPage(pageNumber: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, width: number, height: number): string;
        stop(onSuccess: () => void, onFailure: (err: string) => void): void;
        start(onSuccess: () => void, onFailure: (err: string) => void): void;
        applyImageProcessingCommand(firstPageNumber: number, lastPageNumber: number, commandName: string, args: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getImageProcessingPreview(pageNumber: number, commandName: string, args: any, width: number, height: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number): string;
        runCommand(commandName: string, args: any, userData: any): string;
        getHandle(): any;
    }
}
declare module lt.Sane.JavaScript {
    class SaneError {
        code: number;
        message: string;
    }
    class SaneStatus {
        isScanning: boolean;
        pageCount: number;
        selectedSource: string;
        error: SaneError;
    }
    class SaneSourceInformation {
        name: string;
        vendor: string;
        model: string;
        type: string;
    }
    class SaneService {
        private _serviceUrl;
        private _id;
        constructor(portNumber: number);
        init(userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getStatus(userData: any, onSuccess: (status: SaneStatus) => void, onFailure: (errMessage: string) => void): void;
        getSources(userData: any, onSuccess: (sources: SaneSourceInformation[]) => void, onFailure: (err: string) => void): void;
        selectSource(sourceName: string, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        acquire(userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getPage(pageNumber: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, width: number, height: number, userData: any): string;
        stop(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        start(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        applyImageProcessingCommand(firstPageNumber: number, lastPageNumber: number, commandName: string, args: any, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getImageProcessingPreview(pageNumber: number, commandName: string, args: any, width: number, height: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, userData: any): string;
        abortAcquire(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        setOptionValue(optionName: string, value: string, userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        getOptionValue(optionName: string, userData: any, onSuccess: (value: string) => void, onFailure: (arg: string) => void): void;
        deletePage(pageNumber: number, userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        runCommand(commandName: string, args: any, userData: any): string;
    }
}
interface String {
    format(...args: any[]): string;
}
declare module lt.Twain.JavaScript {
    class TwainError {
        code: number;
        message: string;
    }
    class TwainStatus {
        isScanning: boolean;
        pagesCount: number;
        selectedSource: string;
        error: TwainError;
    }
    class TwainSourceInformation {
        manufacturer: string;
        name: string;
        productFamily: string;
    }
    class TwainArrayCapability {
        itemType: TwainItemType;
        values: any[];
    }
    class TwainEnumerationCapability {
        currentIndex: number;
        defaultIndex: number;
        itemType: TwainItemType;
        values: any[];
    }
    class TwainCapabilityBase {
        containerType: TwainContainerType;
        capabilityType: TwainCapabilityType;
    }
    class TwainOneValueCapability {
        itemType: TwainItemType;
        value: any;
    }
    class TwainRangeCapability {
        currentValue: any;
        defaultValue: any;
        maximumValue: any;
        minimumValue: any;
        stepSize: any;
        itemType: TwainItemType;
    }
    class TwainCapability {
        array: TwainArrayCapability;
        enumeration: TwainEnumerationCapability;
        information: TwainCapabilityBase;
        oneValue: TwainOneValueCapability;
        range: TwainRangeCapability;
    }
    class TwainService {
        private _serviceUrl;
        private _id;
        constructor(url: string);
        init(manufacturer: string, productFamily: string, version: string, application: string, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getStatus(userData: any, onSuccess: (status: TwainStatus) => void, onFailure: (errMessage: string) => void): void;
        isAvailable(userData: any, onSuccess: (available: boolean) => void, onFailure: (err: string) => void): void;
        getSources(userData: any, onSuccess: (sources: TwainSourceInformation[]) => void, onFailure: (err: string) => void): void;
        selectSource(sourceName: string, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        acquire(flags: lt.Twain.JavaScript.TwainUserInterfaceFlags, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getPage(pageNumber: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, width: number, height: number, userData: any): string;
        stop(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        start(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        applyImageProcessingCommand(firstPageNumber: number, lastPageNumber: number, commandName: string, args: any, userData: any, onSuccess: () => void, onFailure: (err: string) => void): void;
        getImageProcessingPreview(pageNumber: number, commandName: string, args: any, width: number, height: number, format: lt.Twain.JavaScript.RasterImageFormat, bpp: number, userData: any): string;
        abortAcquire(userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        setCapabilityValue(capabilityType: TwainCapabilityType, itemType: TwainItemType, value: string, userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        getCapability(capabilityType: TwainCapabilityType, mode: TwainGetCapabilityMode, userData: any, onSuccess: (cap: TwainCapability) => void, onFailure: (arg: string) => void): void;
        deletePage(pageNumber: number, userData: any, onSuccess: () => void, onFailure: (arg: string) => void): void;
        runCommand(commandName: string, args: any, userData: any): string;
        setVersion(version: TwainVersion, userData: any, onSuccess: (status: string) => void, onFailure: (err: string) => void): void;
    }
}
