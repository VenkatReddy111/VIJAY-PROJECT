/**************************************************
LEADTOOLS (C) 1991-2019 LEAD Technologies, Inc. ALL RIGHTS RESERVED.
This software is protected by United States and International copyright laws.
Any copying, duplication, deployment, redistribution, modification or other
disposition hereof is STRICTLY PROHIBITED without an express written license
granted by LEAD Technologies, Inc. Specifically, no portion of this file may be modified, 
altered or otherwise changed under any circumstances, nor may any portion of this file be 
merged with any other file(s) or code.
Portions of this product are licensed under US patent 5,327,254 and foreign
counterparts.
For more information, contact LEAD Technologies, Inc. at 704-332-5532 or visit
https://www.leadtools.com
**************************************************/
// Leadtools.Document.d.ts
// Version:20.0.0.44
declare module lt {
    class Watermark {
        constructor();
        check(): void;
        private _watermark;
    }
}
declare module lt.Barcode {
    enum BarcodeSymbology {
        unknown = 0,
        ean13 = 1,
        ean8 = 2,
        upca = 3,
        upce = 4,
        code3Of9 = 5,
        code128 = 6,
        codeInterleaved2Of5 = 7,
        codabar = 8,
        uccean128 = 9,
        code93 = 10,
        eanext5 = 11,
        eanext2 = 12,
        msi = 13,
        code11 = 14,
        codeStandard2Of5 = 15,
        gs1Databar = 16,
        gs1DatabarLimited = 17,
        gs1DatabarExpanded = 18,
        patchCode = 19,
        postNet = 20,
        planet = 21,
        australianPost4State = 22,
        royalMail4State = 23,
        usps4State = 24,
        gs1DatabarStacked = 25,
        gs1DatabarExpandedStacked = 26,
        pdf417 = 27,
        microPDF417 = 28,
        datamatrix = 29,
        qr = 30,
        aztec = 31,
        maxi = 32,
        microQR = 33,
        pharmaCode = 34
    }
    class BarcodeData {
        constructor();
        symbology: BarcodeSymbology;
        bounds: LeadRectD;
        rotationAngle: number;
        data: number[];
        value: string;
    }
}
declare module lt.Document.Compare {
    class DocumentCompareOptions {
        checkLines: boolean;
        performSemanticCleanup: boolean;
        timeout: number;
        editCost: number;
        matchThreshold: number;
        matchDistance: number;
        patchDeleteThreshold: number;
    }
}
declare module lt.Document.Compare {
    enum DifferenceOperation {
        delete = 0,
        insert = 1,
        equal = 2
    }
    class PageCharacter {
        character: DocumentCharacter;
        pageNumber: number;
        characterIndex: number;
        wordmapIndex: number;
        toJSON(): any;
    }
    class DifferenceLocation {
        pageNumber: number;
        bounds: LeadRectD;
        toJSON(): any;
    }
    abstract class Difference {
        protected constructor();
        abstract getLocations(): DifferenceLocation[];
    }
    class TextDifference extends Difference {
        constructor();
        text: string;
        operation: DifferenceOperation;
        getLocations(): DifferenceLocation[];
        toJSON(): any;
    }
    class PageCharactersDifference extends TextDifference {
        constructor();
        characters: PageCharacter[];
        GetForPage(pageNumber: number): PageCharacter[];
        getLocations(): DifferenceLocation[];
        toJSON(): any;
    }
    class DocumentDifference {
        unparsedDifferences: TextDifference[];
        additions: PageCharactersDifference[];
        deletions: PageCharactersDifference[];
        private _differences;
        differences: PageCharactersDifference[];
        toJSON(): any;
        hasInsertions(): boolean;
        canGetNextInsertion(): boolean;
        canGetPreviousInsertion(): boolean;
        getNextInsertion(): PageCharactersDifference;
        getPreviousInsertion(): PageCharactersDifference;
        resetInsertionCounter(): void;
        getInsertions(): PageCharactersDifference[];
        hasDeletions(): boolean;
        canGetNextDeletion(): boolean;
        canGetPreviousDeletion(): boolean;
        getNextDeletion(): PageCharactersDifference;
        getPreviousDeletion(): PageCharactersDifference;
        getDeletions(): PageCharactersDifference[];
        resetDeletionCounter(): void;
        generateMarkdownReport(mimetype: string, options: lt.Document.Compare.ReportOptions, userData?: any): JQueryPromise<string>;
    }
}
declare module lt.Document.Compare {
    abstract class ReportOptions {
        protected constructor();
        documentNames: string[];
        reportHeaders: string[];
        reportFooters: string[];
        insertionColor: string;
        deletionColor: string;
        baseColor: string;
        underlineColor: string;
        strikethroughColor: string;
    }
    class MarkdownReportOptions extends ReportOptions {
        constructor();
        insertionCSSClass: string;
        deletionCSSClass: string;
        baseCSSClass: string;
        underlineCSSClass: string;
        strikethroughCSSClass: string;
    }
}
declare module lt.Document {
    enum DocumentConverterSvgImagesRecognitionMode {
        auto = 0,
        disabled = 1,
        always = 2
    }
    enum DocumentConverterEmptyPageMode {
        none = 0,
        skip = 1,
        skipIgnoreAnnotations = 2
    }
    enum DocumentConverterJobErrorMode {
        abort = 0,
        resume = 1
    }
    enum DocumentConverterAnnotationsMode {
        none = 0,
        external = 1,
        overlay = 2,
        embed = 3
    }
    class DocumentConverterJobData {
        jobErrorMode: DocumentConverterJobErrorMode;
        pageNumberingTemplate: string;
        enableSvgConversion: boolean;
        svgImagesRecognitionMode: DocumentConverterSvgImagesRecognitionMode;
        emptyPageMode: DocumentConverterEmptyPageMode;
        preprocessorDeskew: boolean;
        preprocessorOrient: boolean;
        preprocessorInvert: boolean;
        inputDocumentFirstPageNumber: number;
        inputDocumentLastPageNumber: number;
        documentFormat: Writer.DocumentFormat;
        documentOptions: Writer.DocumentOptions;
        rasterImageFormat: RasterImageFormat;
        rasterImageBitsPerPixel: number;
        jobName: string;
        annotationsMode: DocumentConverterAnnotationsMode;
        documentName: string;
        annotations: string;
    }
}
declare module lt.Document.Converter {
    class StatusJobDataRunner {
        static runConvertJob(documentId: string, jobData: DocumentConverterJobData): JQueryPromise<RunConvertJobResult>;
        static queryConvertJobStatus(userToken: string, jobToken: string): JQueryPromise<StatusJobData>;
        static deleteConvertJob(userToken: string, jobToken: string): JQueryPromise<void>;
        static abortConvertJob(userToken: string, jobToken: string): JQueryPromise<void>;
    }
    class StatusJobData {
        readonly documentWriterOptions: string;
        readonly rasterImageBitsPerPixel: number;
        readonly rasterImageFormat: RasterImageFormat;
        readonly documentFormat: Writer.DocumentFormat;
        readonly outputDocumentUri: string;
        readonly outputDocumentId: string;
        readonly outputCachePolicy: string;
        readonly outputCacheConfiguration: string;
        readonly inputDocumentLastPageNumber: number;
        readonly inputDocumentFirstPageNumber: number;
        readonly inputDocumentId: string;
        readonly inputCacheConfiguration: string;
        readonly ocrEngineSettings: string;
        readonly ocrEngineStartupParameters: string;
        readonly ocrEngineName: string;
        readonly annotationsMode: DocumentConverterAnnotationsMode;
        readonly documentConverterOptions: string;
        readonly errorMessages: string[];
        readonly jobCompletedTimestamp: string;
        readonly jobStartedTimestamp: string;
        readonly abort: boolean;
        readonly isCompleted: boolean;
        readonly jobStatus: DocumentConverterJobStatus;
        readonly jobStatusMessage: string;
        readonly jobStatusTimestamp: string;
        readonly queryJobStatusTimestamp: string;
        readonly userData: string;
        readonly statusCachePolicy: string;
        readonly statusCacheConfiguration: string;
        readonly userToken: string;
        readonly jobToken: string;
        readonly jobName: string;
    }
    class RunConvertJobResult {
        readonly userToken: string;
        readonly jobToken: string;
    }
    enum DocumentConverterJobStatus {
        success = 0,
        successWithErrors = 1,
        aborted = 2
    }
}
declare module lt.Document {
    class DocumentBarcodes {
        constructor(document: LEADDocument);
        dispose(): void;
        readonly document: LEADDocument;
    }
}
declare module lt.Document {
    class DocumentDocuments extends LeadCollection {
        constructor(document?: LEADDocument);
        dispose(): void;
        readonly document: LEADDocument;
        beginAdd(): void;
        endAdd(): void;
        insertItem(index: number, item: LEADDocument): void;
        removeItem(index: number): void;
        moveItem(oldIndex: number, newIndex: number): void;
        setItem(index: number, item: any): void;
        clearItems(): void;
        tryAdd(document: LEADDocument): void;
        tryRemove(document: LEADDocument): void;
    }
}
declare module lt.Document {
    enum DocumentViewLayout {
        single = 0,
        vertical = 1,
        double = 2,
        horizontal = 3
    }
    enum DocumentViewAnnotationsUserMode {
        design = 0,
        run = 1,
        render = 2
    }
    enum DocumentViewSizeMode {
        actualSize = 0,
        fitWidth = 1,
        fitPage = 2
    }
    enum DocumentViewItemType {
        image = 0,
        svg = 1
    }
    class DocumentViewCommand {
        constructor();
        command: string;
        parameters: Object;
    }
    class DocumentViewOptions {
        constructor();
        viewLayout: DocumentViewLayout;
        pageNumber: number;
        viewZoomPercent: number;
        viewScrollOffset: LeadPointD;
        annotationsUserMode: DocumentViewAnnotationsUserMode;
        viewSizeMode: DocumentViewSizeMode;
        viewItemType: DocumentViewItemType;
        loadAnnotations: boolean;
        loadThumbnails: boolean;
        loadBookmarks: boolean;
        viewCommands: DocumentViewCommand[];
        private static copyMatchingProperties;
    }
}
declare module lt.Document {
    enum RasterImageFormat {
        unknown = 0,
        pcx = 1,
        gif = 2,
        tif = 3,
        tga = 4,
        cmp = 5,
        bmp = 6,
        jpeg = 10,
        tifJpeg = 11,
        os2 = 14,
        wmf = 15,
        eps = 16,
        tifLzw = 17,
        jpeg411 = 21,
        tifJpeg411 = 22,
        jpeg422 = 23,
        tifJpeg422 = 24,
        ccitt = 25,
        lead1Bit = 26,
        ccittGroup31Dim = 27,
        ccittGroup32Dim = 28,
        ccittGroup4 = 29,
        abc = 32,
        cals = 50,
        mac = 51,
        img = 52,
        msp = 53,
        wpg = 54,
        ras = 55,
        pct = 56,
        pcd = 57,
        dxf = 58,
        dxf12 = 58,
        fli = 61,
        cgm = 62,
        epsTiff = 63,
        epsWmf = 64,
        faxG31Dim = 66,
        faxG32Dim = 67,
        faxG4 = 68,
        wfxG31Dim = 69,
        wfxG4 = 70,
        icaG31Dim = 71,
        icaG32Dim = 72,
        icaG4 = 73,
        os22 = 74,
        png = 75,
        psd = 76,
        rawIcaG31Dim = 77,
        rawIcaG32Dim = 78,
        rawIcaG4 = 79,
        fpx = 80,
        fpxSingleColor = 81,
        fpxJpeg = 82,
        fpxJpegQFactor = 83,
        bmpRle = 84,
        tifCmyk = 85,
        tifLzwCmyk = 86,
        tifPackBits = 87,
        tifPackBitsCmyk = 88,
        dicomGray = 89,
        dicomColor = 90,
        winIco = 91,
        winCur = 92,
        tifYcc = 93,
        tifLzwYcc = 94,
        tifPackbitsYcc = 95,
        exif = 96,
        exifYcc = 97,
        exifJpeg = 98,
        exifJpeg422 = 98,
        awd = 99,
        exifJpeg411 = 101,
        pbmAscii = 102,
        pbmBinary = 103,
        pgmAscii = 104,
        pgmBinary = 105,
        ppmAscii = 106,
        ppmBinary = 107,
        cut = 108,
        xpm = 109,
        xbm = 110,
        iffIlbm = 111,
        iffCat = 112,
        xwd = 113,
        clp = 114,
        jbig = 115,
        emf = 116,
        icaIbmMmr = 117,
        rawIcaIbmMmr = 118,
        ani = 119,
        laserData = 121,
        intergraphRle = 122,
        intergraphVector = 123,
        dwg = 124,
        dicomRleGray = 125,
        dicomRleColor = 126,
        dicomJpegGray = 127,
        dicomJpegColor = 128,
        cals4 = 129,
        cals2 = 130,
        cals3 = 131,
        xwd10 = 132,
        xwd11 = 133,
        flc = 134,
        kdc = 135,
        drw = 136,
        plt = 137,
        tifCmp = 138,
        tifJbig = 139,
        tifDxf = 140,
        tifUnknown = 141,
        sgi = 142,
        sgiRle = 143,
        dwf = 145,
        rasPdf = 146,
        rasPdfG31Dim = 147,
        rasPdfG32Dim = 148,
        rasPdfG4 = 149,
        rasPdfJpeg = 150,
        rasPdfJpeg422 = 151,
        rasPdfJpeg411 = 152,
        raw = 153,
        tifCustom = 155,
        rawRgb = 156,
        rawRle4 = 157,
        rawRle8 = 158,
        rawBitfields = 159,
        rawPackBits = 160,
        rawJpeg = 161,
        rawCcitt = 162,
        faxG31DimNoEol = 162,
        jp2 = 163,
        j2k = 164,
        cmw = 165,
        tifJ2k = 166,
        tifCmw = 167,
        mrc = 168,
        gerber = 169,
        wbmp = 170,
        jpegLab = 171,
        jpegLab411 = 172,
        jpegLab422 = 173,
        geoTiff = 174,
        tifLead1Bit = 175,
        tifMrc = 177,
        rawLzw = 178,
        rasPdfLzw = 179,
        tifAbc = 180,
        nap = 181,
        jpegRgb = 182,
        jbig2 = 183,
        rawIcaAbic = 184,
        abic = 185,
        tifAbic = 186,
        tifJbig2 = 187,
        rasPdfJbig2 = 188,
        tifZip = 189,
        icaAbic = 190,
        afpIcaAbic = 191,
        postscript = 222,
        svg = 247,
        ptoca = 249,
        sct = 250,
        pcl = 251,
        afp = 252,
        icaUncompressed = 253,
        rawIcaUncompressed = 254,
        shp = 255,
        smp = 256,
        smpG31Dim = 257,
        smpG32Dim = 258,
        smpG4 = 259,
        cmx = 261,
        tgaRle = 262,
        kdc120 = 263,
        kdc40 = 264,
        kdc50 = 265,
        dcs = 266,
        tifxJbig = 269,
        tifxJbigT43 = 270,
        tifxJbigT43ItuLab = 271,
        tifxJbigT43Gs = 272,
        tifxFaxG4 = 273,
        tifxFaxG31D = 274,
        tifxFaxG32D = 275,
        tifxJpeg = 276,
        rasRle = 288,
        dxf13 = 290,
        clpRle = 291,
        dcr = 292,
        dicomJ2kGray = 293,
        dicomJ2kColor = 294,
        fit = 295,
        crw = 296,
        dwfTextAsPolyline = 297,
        cin = 298,
        epsPostscript = 300,
        intergraphCcittG4 = 301,
        sff = 302,
        iffIlbmUncompressed = 303,
        iffCatUncompressed = 304,
        rtfRaster = 305,
        wmz = 307,
        afpIcaG31Dim = 309,
        afpIcaG32Dim = 310,
        afpIcaG4 = 311,
        afpIcaUncompressed = 312,
        afpIcaIbmMmr = 313,
        leadMrc = 314,
        tifLeadMrc = 315,
        txt = 316,
        pdfLeadMrc = 317,
        hdp = 318,
        hdpGray = 319,
        hdpCmyk = 320,
        pngIco = 321,
        xps = 322,
        jpx = 323,
        xpsJpeg = 324,
        xpsJpeg422 = 325,
        xpsJpeg411 = 326,
        mng = 327,
        mngGray = 329,
        mngJng = 330,
        mngJng411 = 331,
        mngJng422 = 332,
        rasPdfCmyk = 333,
        rasPdfLzwCmyk = 334,
        mif = 335,
        e00 = 336,
        tdb = 337,
        tdb2 = 338,
        snp = 339,
        afpIm1 = 340,
        xls = 341,
        doc = 342,
        anz = 343,
        ppt = 344,
        pptJpeg = 345,
        pptPng = 346,
        jpm = 347,
        vff = 348,
        pclXl = 349,
        docx = 350,
        xlsx = 351,
        pptx = 352,
        jxr = 353,
        jxrGray = 354,
        jxrCmyk = 355,
        jls = 356,
        jxr422 = 357,
        jxr420 = 358,
        dcfArw = 359,
        dcfRaf = 360,
        dcfOrf = 361,
        dcfCr2 = 362,
        dcfNef = 363,
        dcfRw2 = 364,
        dcfCasio = 365,
        dcfPentax = 366,
        jlsLine = 367,
        jlsSample = 368,
        htm = 369,
        mob = 370,
        pub = 371,
        ing = 372,
        ingRle = 373,
        ingAdaptiveRle = 374,
        ingG4 = 375,
        dwfx = 376,
        icaJpeg = 377,
        icaJpeg411 = 378,
        icaJpeg422 = 379,
        dcfDng = 380,
        rawFlate = 381,
        rawRle = 382,
        dicomJlsGray = 383,
        dicomJlsColor = 384,
        pst = 385,
        msg = 386,
        eml = 387,
        rasPdfJpx = 388,
        dicomJpxGray = 389,
        dicomJpxColor = 390,
        jpegCmyk = 391,
        jpegCmyk411 = 392,
        jpegCmyk422 = 393,
        tifJpegCmyk = 394,
        tifJpegCmyk411 = 395,
        tifJpegCmyk422 = 396,
        svgz = 397,
        x9f = 398,
        threeJS = 399,
        stl = 400,
        csv = 401
    }
}
declare module lt.Document.Writer {
    class DocumentOptions {
        constructor(format: DocumentFormat);
        readonly format: DocumentFormat;
    }
}
declare module lt.Document.Writer {
    class RtfDocumentOptions extends DocumentOptions {
        constructor();
        textMode: DocumentTextMode;
    }
}
declare module lt.Document.Writer {
    enum TextDocumentType {
        ansi = 0,
        unicode = 1,
        unicodeBigEndian = 2,
        utf8 = 3
    }
    class TextDocumentOptions extends DocumentOptions {
        constructor();
        documentType: TextDocumentType;
        addPageNumber: boolean;
        addPageBreak: boolean;
        formatted: boolean;
    }
}
declare module lt.Document.Writer {
    class SvgDocumentOptions extends DocumentOptions {
        constructor();
    }
    class EmfDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    class XlsDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    enum PdfDocumentType {
        pdf = 0,
        pdfA = 1,
        pdf12 = 2,
        pdf13 = 3,
        pdf15 = 4,
        pdf16 = 5
    }
    enum PdfDocumentEncryptionMode {
        rc40Bit = 0,
        rc128Bit = 1
    }
    enum PdfDocumentPageModeType {
        pageOnly = 0,
        fullScreen = 3,
        bookmarksAndPage = 1,
        thumbnailAndPage = 2,
        layerAndPage = 4,
        attachmentsAndPage = 5
    }
    enum PdfDocumentPageLayoutType {
        singlePageDisplay = 0,
        oneColumnDisplay = 1,
        twoColumnLeftDisplay = 2,
        twoColumnRightDisplay = 3,
        twoPageLeft = 4,
        twoPageRight = 5
    }
    enum PdfDocumentPageFitType {
        defaultType = 0,
        fitWidth = 1,
        fitHeight = 2,
        fitWidthBounds = 3,
        fitHeightBounds = 4,
        fitBounds = 5
    }
    class PdfDocumentOptions extends DocumentOptions {
        constructor();
        documentType: PdfDocumentType;
        fontEmbedMode: DocumentFontEmbedMode;
        imageOverText: boolean;
        linearized: boolean;
        title: string;
        subject: string;
        keywords: string;
        author: string;
        isProtected: boolean;
        userPassword: string;
        ownerPassword: string;
        encryptionMode: PdfDocumentEncryptionMode;
        printEnabled: boolean;
        highQualityPrintEnabled: boolean;
        copyEnabled: boolean;
        editEnabled: boolean;
        annotationsEnabled: boolean;
        assemblyEnabled: boolean;
        oneBitImageCompression: OneBitImageCompressionType;
        coloredImageCompression: ColoredImageCompressionType;
        qualityFactor: number;
        imageOverTextSize: DocumentImageOverTextSize;
        imageOverTextMode: DocumentImageOverTextMode;
        pageModeType: PdfDocumentPageModeType;
        pageLayoutType: PdfDocumentPageLayoutType;
        pageFitType: PdfDocumentPageFitType;
        initialPageNumber: number;
        xCoordinate: number;
        yCoordinate: number;
        zoomPercent: number;
        hideToolbar: boolean;
        hideMenubar: boolean;
        hideWindowUI: boolean;
        fitWindow: boolean;
        centerWindow: boolean;
        displayDocTitle: boolean;
    }
}
declare module lt.Document.Writer {
    class XpsDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    class PubDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    class MobDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    class LtdDocumentOptions extends DocumentOptions {
        constructor();
    }
}
declare module lt.Document.Writer {
    class HtmlDocumentOptions extends DocumentOptions {
        constructor();
        fontEmbedMode: DocumentFontEmbedMode;
        useBackgroundColor: boolean;
        backgroundColor: string;
    }
}
declare module lt.Document.Writer {
    class DocxDocumentOptions extends DocumentOptions {
        constructor();
        textMode: DocumentTextMode;
    }
}
declare module lt.Document.Writer {
    class DocDocumentOptions extends DocumentOptions {
        constructor();
        textMode: DocumentTextMode;
    }
}
declare module lt.Document.Writer {
    enum AltoXmlMeasurementUnit {
        mm10 = 0,
        inch1200 = 1,
        dpi = 2,
        pixel = 3
    }
    class AltoXmlDocumentOptions extends DocumentOptions {
        constructor();
        measurementUnit: AltoXmlMeasurementUnit;
        fileName: string;
        processingDateTime: string;
        processingAgency: string;
        processingStepDescription: string;
        processingStepSettings: string;
        softwareCreator: string;
        softwareName: string;
        softwareVersion: string;
        applicationDescription: string;
        firstPhysicalPageNumber: number;
        formatted: boolean;
        indentation: string;
    }
}
declare module lt.Document {
    enum DocumentRedactionMode {
        none = 0,
        apply = 1,
        applyThenRasterize = 2
    }
    class AnnotationsRedactionOptions {
        mode: number;
        replaceCharacter: string;
        equals(obj: any): boolean;
        clone(): AnnotationsRedactionOptions;
    }
    class ViewRedactionOptions extends AnnotationsRedactionOptions {
    }
    class ConvertRedactionOptions extends AnnotationsRedactionOptions {
    }
    class DocumentRedactionOptions {
        viewOptions: ViewRedactionOptions;
        convertOptions: ConvertRedactionOptions;
        constructor();
        equals(obj: any): boolean;
        clone(): DocumentRedactionOptions;
        private static copyMatchingProperties;
    }
    class DocumentAnnotations {
        constructor(document: LEADDocument);
        dispose(): void;
        readonly document: LEADDocument;
        readonly annotationsUri: string;
        static createEmptyContainer(page: DocumentPage): ltAnnotationsEngine.AnnContainer;
        private static createEmptyContainersList;
        getAnnotations(createEmpty: boolean): JQueryPromise<ltAnnotationsEngine.AnnContainer[]>;
        modifiedContainers: ltAnnotationsEngine.AnnContainer[];
        setAnnotations(containers: ltAnnotationsEngine.AnnContainer[]): JQueryPromise<void>;
        redactionOptions: DocumentRedactionOptions;
    }
}
declare module lt.Document.Writer {
    enum DocumentFormat {
        user = -1,
        ltd = 0,
        pdf = 1,
        doc = 2,
        rtf = 3,
        html = 4,
        text = 5,
        emf = 6,
        xps = 7,
        docx = 8,
        xls = 9,
        pub = 10,
        mob = 11,
        svg = 12,
        altoXml = 13
    }
    enum DocumentFontEmbedMode {
        none = 0,
        auto = 1,
        force = 2,
        all = 3
    }
    enum OneBitImageCompressionType {
        flate = 0,
        faxG31D = 1,
        faxG32D = 2,
        faxG4 = 3,
        lzw = 4,
        jbig2 = 5
    }
    enum ColoredImageCompressionType {
        flateJpeg = 0,
        lzwJpeg = 1,
        flate = 2,
        lzw = 3,
        jpeg = 4,
        flateJpx = 5,
        lzwJpx = 6,
        jpx = 7
    }
    enum DocumentImageOverTextSize {
        original = 0,
        half = 1,
        quarter = 2
    }
    enum DocumentImageOverTextMode {
        none = 0,
        strict = 1,
        relaxed = 2
    }
    enum DocumentTextMode {
        auto = 0,
        nonFramed = 1,
        framed = 2
    }
}
declare module lt.Document {
    class DocumentPages extends LeadCollection {
        constructor(document?: LEADDocument);
        dispose(): void;
        readonly document: LEADDocument;
        readonly originalFirstPageNumber: number;
        readonly originalLastPageNumber: number;
        readonly originalPageCount: number;
        defaultPageSize: lt.LeadSizeD;
        defaultResolution: number;
        getTargetPageNumber(sourceDocument: LEADDocument, sourcePageNumber: number): number;
        beginAdd(): void;
        endAdd(): void;
        createPage(size: LeadSizeD, resolution: number): DocumentPage;
        remove(item: DocumentPage): void;
        add(item: DocumentPage): void;
        addRange(items: DocumentPage[]): void;
        contains(item: DocumentPage): boolean;
        toArray(): DocumentPage[];
        insertItem(index: number, item: DocumentPage): void;
        insert(index: number, item: DocumentPage): void;
        insertRange(index: number, items: DocumentPage[]): void;
        insertItemRange(index: number, items: DocumentPage[]): void;
        moveItem(oldIndex: number, newIndex: number): void;
        removeItem(index: number): void;
        removeItemRange(index: number, count: number): void;
        setItem(index: number, item: DocumentPage): void;
        clearItems(): void;
        indexOf(item: DocumentPage): number;
        item(index: number, value?: DocumentPage): DocumentPage;
        rotate(angle: number, firstPageNumber: number, lastPageNumber: number): void;
        flip(firstPageNumber: number, lastPageNumber: number): void;
        reverse(firstPageNumber: number, lastPageNumber: number): void;
        setViewPerspective(viewPerspective: RasterViewPerspective, firstPageNumber: number, lastPageNumber: number): void;
    }
}
declare module lt.Document {
    class DocumentStructure {
        dispose(): void;
        readonly document: LEADDocument;
        constructor(document: LEADDocument);
        bookmarks: DocumentBookmark[];
        parseBookmarks: boolean;
        parsePageLinks: boolean;
        readonly isParsed: boolean;
        parse(): JQueryPromise<LEADDocument>;
    }
}
declare module lt.Document {
    enum DocumentTextExtractionMode {
        auto = 0,
        svgOnly = 1,
        ocrOnly = 2
    }
    enum DocumentTextImagesRecognitionMode {
        auto = 0,
        disabled = 1,
        always = 2
    }
    class DocumentText {
        readonly document: LEADDocument;
        constructor(document: LEADDocument);
        textExtractionMode: DocumentTextExtractionMode;
        imagesRecognitionMode: DocumentTextImagesRecognitionMode;
        autoParseLinks: boolean;
        preApplyViewPerspective: boolean;
        static readonly linkPatterns: RegExp[];
        static resetLinkPatterns(): void;
    }
}
declare module lt.Document {
    class DocumentImages {
        constructor(document: LEADDocument);
        dispose(): void;
        readonly document: LEADDocument;
        readonly isSvgSupported: boolean;
        readonly isSvgViewingPreferred: boolean;
        readonly isResolutionsSupported: boolean;
        defaultBitsPerPixel: number;
        maximumImagePixelSize: number;
        thumbnailPixelSize: lt.LeadSizeD;
        unembedSvgImages: boolean;
        static elementAjaxMethod: string;
        static elementUrlMode: lt.ImageLoaderUrlMode;
        getThumbnailsGrid(firstPageNumber: number, lastPageNumber: number, maximumGridWidth: number): string;
        getThumbnailsGridUrl(firstPageNumber: number, lastPageNumber: number, maximumGridWidth: number): string;
        getThumbnailsGridElement(firstPageNumber: number, lastPageNumber: number, maximumGridWidth: number, imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        static rotateViewPerspective(value: RasterViewPerspective, angle: number): RasterViewPerspective;
        private static rotateViewPerspective90;
        static flipViewPerspective(value: RasterViewPerspective): RasterViewPerspective;
        static getViewPerspectiveTransform(viewPerspective: RasterViewPerspective, size: LeadSizeD, apply: boolean): LeadMatrix;
    }
}
declare module lt.Document {
    class DocumentLinkTarget {
        constructor();
        pageFitType: DocumentPageFitType;
        pageNumber: number;
        position: lt.LeadPointD;
        zoomPercent: number;
        clone(): DocumentLinkTarget;
    }
}
declare module lt.Document {
    enum DocumentLinkType {
        value = 0,
        targetPage = 1
    }
    class DocumentLink {
        constructor();
        bounds: lt.LeadRectD;
        linkType: DocumentLinkType;
        value: string;
        target: DocumentLinkTarget;
    }
}
declare module lt.Document {
    enum DocumentGetSvgOptions {
        none = 0,
        allowPolylineText = 1,
        dropImages = 2,
        dropShapes = 4,
        dropText = 8,
        forConversion = 16,
        ignoreXmlParsingErrors = 32,
        forceRealText = 64,
        forceTextPath = 1
    }
    class DocumentPage {
        dispose(): void;
        setDocument(value: LEADDocument, pageNumber: number): void;
        setSize(size: LeadSizeD): void;
        dataType: DocumentDataType;
        readonly document: LEADDocument;
        size: lt.LeadSizeD;
        resolution: number;
        readonly pageNumber: number;
        readonly imageScale: number;
        readonly originalPageNumber: number;
        readonly isAnnotationsModified: boolean;
        readonly hasEmbeddedAnnotations: boolean;
        customData: {
            [key: string]: any;
        };
        isDeleted: boolean;
        readonly isViewPerspectiveRotated: boolean;
        readonly isViewPerspectiveFlipped: boolean;
        readonly viewPerspectiveSize: LeadSizeD;
        viewPerspective: RasterViewPerspective;
        isViewPerspectiveModified: boolean;
        rotate(angle: number): void;
        reverse(): void;
        flip(): void;
        getRotateFlip(): DocumentRotateFlip;
        getViewPerspectiveTransform(apply: boolean): LeadMatrix;
        processPageText(pageText: DocumentPageText): void;
        getLinks(): DocumentLink[];
        getText(clip: LeadRectD): JQueryPromise<DocumentPageText>;
        getAnnotations(createEmpty: boolean): JQueryPromise<ltAnnotationsEngine.AnnContainer>;
        setAnnotations(container: ltAnnotationsEngine.AnnContainer): JQueryPromise<void>;
        applyAnnotationsViewPerspective(container: ltAnnotationsEngine.AnnContainer, apply: boolean): void;
        applyTextViewPerspective(text: DocumentPageText, apply: boolean): void;
        getThumbnailImage(): string;
        getThumbnailImageUrl(): string;
        getThumbnailImageElement(imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        getImage(): string;
        getImageUrl(): string;
        getImageResized(width: number, height: number): string;
        getImageResizedUrl(width: number, height: number): string;
        getImageElement(imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        getImageResizedElement(width: number, height: number, imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        private deleteTextAndLinksFromCache;
        readonly isSvgSupported: boolean;
        readonly isSvgViewingPreferred: boolean;
        getSvgBackImage(backColor: string): string;
        getSvgBackImageUrl(backColor: string): string;
        getSvgBackImageElement(backColor: string, imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        getSvg(options: DocumentGetSvgOptions): string;
        getSvgUrl(options: DocumentGetSvgOptions): string;
        getSvgElement(options: DocumentGetSvgOptions, imageLoader?: lt.ImageLoader): JQueryPromise<Element>;
        readBarcodes(bounds: LeadRectD, maximumBarcodes: number, symbologies: Barcode.BarcodeSymbology[]): JQueryPromise<Barcode.BarcodeData[]>;
    }
}
declare module lt.Document {
    enum DocumentFontStyles {
        normal = 0,
        bold = 1,
        italic = 2,
        underline = 4
    }
    enum DocumentPageFitType {
        none = 0,
        fit = 1,
        fitAlways = 2,
        fitWidth = 3,
        fitHeight = 4
    }
    class DocumentBookmark {
        constructor();
        clone(withChildren: boolean): DocumentBookmark;
        fontStyles: DocumentFontStyles;
        children: DocumentBookmark[];
        target: DocumentLinkTarget;
        title: string;
    }
}
declare module lt.Document {
    class CreateDocumentOptions {
        documentId: string;
        mimeType: string;
    }
    class DocumentPageDescriptor {
        documentId: string;
        pageNumber: number;
        originalPageNumber: number;
        size: LeadSizeD;
        resolution: number;
        viewPerspective: lt.RasterViewPerspective;
        isDeleted: boolean;
    }
    class DocumentDescriptor {
        documentId: string;
        name: string;
        autoDeleteFromCache: boolean;
        autoSaveToCache: boolean;
        autoDisposeDocuments: boolean;
        isReadOnly: boolean;
        mimeType: string;
        defaultPageSize: LeadSizeD;
        defaultResolution: number;
        defaultBitsPerPixel: number;
        maximumImagePixelSize: number;
        thumbnailPixelSize: lt.LeadSizeD;
        unembedSvgImages: boolean;
        documentType: string;
        isStructureParsed: boolean;
        isStructureSupported: boolean;
        isSvgSupported: boolean;
        isSvgViewingPreferred: boolean;
        isResolutionsSupported: boolean;
        textExtractionMode: DocumentTextExtractionMode;
        imagesRecognitionMode: DocumentTextImagesRecognitionMode;
        autoParseLinks: boolean;
        parseBookmarks: boolean;
        parsePageLinks: boolean;
        metadata: string;
        pages: DocumentPageDescriptor[];
        viewOptions: DocumentViewOptions;
        redactionOptions: DocumentRedactionOptions;
    }
}
declare module lt.Document {
    enum DocumentLoadMode {
        service = 0,
        local = 1,
        localThenService = 2
    }
    class LoadDocumentOptions {
        documentId: string;
        resolution: number;
        name: string;
        password: string;
        annotationsUri: string;
        loadEmbeddedAnnotations: boolean;
        maximumImagePixelSize: number;
        firstPageNumber: number;
        lastPageNumber: number;
        loadMode: DocumentLoadMode;
        redactionOptions: DocumentRedactionOptions;
    }
    class UploadDocumentOptions {
        documentId: string;
        name: string;
        mimeType: string;
        pageCount: number;
        enableStreaming: boolean;
        password: string;
        postUploadOperations: {
            [key: string]: string;
        };
    }
}
declare module lt.Document {
    class DocumentCharacter {
        constructor();
        code: number;
        bounds: lt.LeadRectD;
        spaceWidth: number;
        isEndOfWord: boolean;
        isEndOfLine: boolean;
        isLineBreak: boolean;
        isEndOfParagraph: boolean;
        isRightToLeft: boolean;
        toJSON(): any;
    }
    class DocumentWord {
        constructor();
        value: string;
        bounds: lt.LeadRectD;
        firstCharacterIndex: number;
        lastCharacterIndex: number;
    }
    class DocumentPageText {
        constructor(characters: DocumentCharacter[]);
        readonly characters: DocumentCharacter[];
        readonly words: DocumentWord[];
        readonly text: string;
        readonly textMap: number[];
        clearBuildData(): void;
        buildWords(): void;
        buildText(): void;
        buildTextWithMap(): void;
        parseLinks(linkPatterns: RegExp[]): DocumentLink[];
        clipText(bounds: LeadRectD): DocumentPageText;
    }
}
declare module lt.Document {
    enum DocumentDataType {
        transient = 0,
        cached = 1,
        virtual = 2
    }
    class ConvertItem {
        constructor();
        name: string;
        url: string;
        mimeType: string;
        length: number;
    }
    class DocumentConvertResult {
        constructor();
        readonly documentId: string;
        readonly archive: ConvertItem;
        readonly document: ConvertItem;
        readonly annotations: ConvertItem;
    }
    class LEADDocument {
        static readonly metadataKey_IsLinearized: string;
        static readonly postUpload_LinearizePdfMinimumLength: string;
        static cacheControllerName: string;
        static cacheGetDocumentDataMethodName: string;
        createDocumentDescriptor(): DocumentDescriptor;
        constructor();
        static create(options: CreateDocumentOptions): LEADDocument;
        readonly isDisposed: boolean;
        dispose(): void;
        autoDisposeDocuments: boolean;
        canModify(): void;
        createPage(size: LeadSizeD, resolution: number, originalPageNumber: number): DocumentPage;
        readonly documentId: string;
        name: string;
        readonly uri: string;
        cacheUri: string;
        readonly lastCacheSyncTime: Date;
        cacheStatus: DocumentCacheStatus;
        readonly isAnyCacheStatusNotSynced: boolean;
        readonly isDownloaded: boolean;
        isReadOnly: boolean;
        isLocal: boolean;
        dataType: DocumentDataType;
        mimeType: string;
        readonly pages: DocumentPages;
        readonly isEncrypted: boolean;
        readonly isDecrypted: boolean;
        readonly isStructureSupported: boolean;
        viewOptions: DocumentViewOptions;
        readonly documents: DocumentDocuments;
        readonly annotations: DocumentAnnotations;
        readonly structure: DocumentStructure;
        readonly images: DocumentImages;
        readonly barcodes: DocumentBarcodes;
        readonly metadata: {
            [key: string]: string;
        };
        readonly text: DocumentText;
        readonly defaultResolution: number;
        static readonly unitsPerInch: number;
        readonly annotationsUri: string;
        defaultBitsPerPixel: number;
        readonly defaultPageSize: lt.LeadSizeD;
        readonly documentType: string;
        readonly password: string;
        serviceUserData: string;
        readonly hasDocuments: boolean;
        forEachDocument(action: (document: LEADDocument) => void): void;
        documentsAddedRemoved(document: LEADDocument, added: boolean): void;
        static compare(documentIds: string[], options: lt.Document.Compare.DocumentCompareOptions, userData?: any): JQueryPromise<Compare.DocumentDifference>;
        decrypt(password: string): JQueryPromise<LEADDocument>;
        private _clientSideData;
        private updateClientDocument;
        private finishLoadClientDocument;
        private loadClientDocuement;
        internalCacheClientDocument(): JQueryPromise<LEADDocument>;
        convert(jobData: DocumentConverterJobData): JQueryPromise<DocumentConvertResult>;
        static documentToPixels(resolution: number, size: number): number;
        static pixelsToDocument(resolution: number, pixels: number): number;
        pointToPixels(value: lt.LeadPointD): lt.LeadPointD;
        pointToDocument(value: lt.LeadPointD): lt.LeadPointD;
        sizeToPixels(value: lt.LeadSizeD): lt.LeadSizeD;
        sizeToDocument(value: lt.LeadSizeD): lt.LeadSizeD;
        rectToPixels(value: lt.LeadRectD): lt.LeadRectD;
        rectToDocument(value: lt.LeadRectD): lt.LeadRectD;
        static getRotateFlip(viewPerspective: RasterViewPerspective): DocumentRotateFlip;
        static getViewPerspectiveTransform(viewPerspective: RasterViewPerspective, size: LeadSizeD, apply: boolean): LeadMatrix;
    }
}
declare module lt.Document {
    enum DocumentCacheStatus {
        synced = 0,
        notSynced = 1
    }
    class DocumentRotateFlip {
        isFlipped: boolean;
        rotationAngle: number;
    }
    enum DocumentUploadProgressState {
        created = 0,
        uploading = 1,
        finished = 2,
        error = 3,
        aborted = 4
    }
    class DocumentUploadProgress {
        constructor(state: DocumentUploadProgressState, progress: number, userData: any);
        readonly state: DocumentUploadProgressState;
        readonly progress: number;
        readonly userData: any;
    }
    interface AbortableJqueryPromise<T> extends JQueryPromise<T> {
        abort: () => {};
    }
    enum OcrEngineStatus {
        unset = 0,
        error = 1,
        ready = 2
    }
    class ServiceStatus {
        constructor(message: string, time: Date, licenseChecked: boolean, licenseExpired: boolean, cacheAccessible: boolean, kernelType: string, ocrEngineStatus: OcrEngineStatus);
        readonly message: string;
        readonly time: Date;
        readonly isLicenseChecked: boolean;
        readonly isLicenseExpired: boolean;
        readonly isCacheAccessible: boolean;
        readonly kernelType: string;
        readonly ocrEngineStatus: OcrEngineStatus;
    }
    class ResolveDocumentEventArgs extends lt.LeadEventArgs {
        constructor(sourceDocument: LEADDocument, documentId: string);
        sourceDocument: LEADDocument;
        readonly documentId: string;
        document: LEADDocument;
    }
    interface ResolveDocumentEventHandler {
        (sender: any, e: ResolveDocumentEventArgs): void;
    }
    class ResolveDocumentEventType extends lt.LeadEvent {
        add(value: ResolveDocumentEventHandler): ResolveDocumentEventHandler;
        remove(value: ResolveDocumentEventHandler): void;
    }
    class DocumentRefInfo {
        document: LEADDocument;
        refCount: number;
    }
    class DocumentFactory {
        static create(options: CreateDocumentOptions): LEADDocument;
        static verifyService(): JQueryPromise<ServiceStatus>;
        static serviceHost: string;
        static servicePath: string;
        static serviceApiPath: string;
        static localProxyUrlTemplate: string;
        static readonly serviceUri: string;
        static serviceUserData: string;
        static logErrors: boolean;
        static isUploadDocumentUri(uri: string): boolean;
        static readonly loadDocumentFromCache: ResolveDocumentEventType;
        static tryLoadDocumentFromCache(document: LEADDocument, documentId: string): LEADDocument;
        static loadFromCache(documentId: string): JQueryPromise<LEADDocument>;
        static checkCacheInfo(uri: string): JQueryPromise<CacheInfo>;
        static loadFromUri(uri: string, options: LoadDocumentOptions): JQueryPromise<LEADDocument>;
        static loadFromFile(file: File, options: LoadDocumentOptions): AbortableJqueryPromise<any>;
        static uploadFile(file: File, documentId?: string): AbortableJqueryPromise<any>;
        static beginUpload(documentId?: string): JQueryPromise<string>;
        static beginUploadDocument(uploadOptions?: UploadDocumentOptions): JQueryPromise<string>;
        static uploadDocument(uri: string, data: ArrayBuffer, offset: number, length: number): JQueryPromise<any>;
        static endUpload(uri: string): JQueryPromise<any>;
        static abortUploadDocument(uri: string): JQueryPromise<void>;
        static downloadDocumentData(documentId: string, uri: string, includeAnnotations: boolean): JQueryPromise<Service.DownloadDocumentResponse>;
        private static setDocumentDataType;
        static saveToCache(doc: LEADDocument): JQueryPromise<void>;
        static deleteFromCache(documentId: string): JQueryPromise<void>;
        static readonly prepareAjax: PrepareAjaxEventType;
        static cancelFromPrepareAjax(sender: Object, sourceClass: string, sourceMethod: string, settings: JQueryAjaxSettings, isLocalResource?: boolean): boolean;
        static readonly documentRefs: {
            [documentId: string]: DocumentRefInfo;
        };
        static incrementDocumentRef(document: LEADDocument): number;
        static decrementDocumentRef(document: LEADDocument): number;
    }
    class PrepareAjaxEventArgs extends lt.LeadEventArgs {
        constructor(sourceClass: string, sourceMethod: string, settings: JQueryAjaxSettings, isLocalResource?: boolean);
        readonly sourceClass: string;
        readonly sourceMethod: string;
        readonly isLocalResource: boolean;
        readonly settings: JQueryAjaxSettings;
        cancel: boolean;
    }
    interface PrepareAjaxEventHandler {
        (sender: any, e: PrepareAjaxEventArgs): void;
    }
    class PrepareAjaxEventType extends lt.LeadEvent {
        add(value: PrepareAjaxEventHandler): PrepareAjaxEventHandler;
        remove(value: PrepareAjaxEventHandler): void;
    }
    interface CacheInfo {
        isVirtual: boolean;
        isLoaded: boolean;
        hasAnnotations: boolean;
        name: string;
        mimeType: string;
        isMimeTypeAccepted: boolean;
        pageCount: number;
        userToken: string;
        hasUserToken: boolean;
    }
}
interface StringStatic {
    format(...args: any[]): string;
}
declare var ltDocumentsString: StringStatic;
declare module lt.Document {
    interface PDFProxyFailure {
        (reason: string, pageNumber: number): void;
    }
    interface PDFPageProxyLoaded {
        (pageProxy: any): boolean;
    }
    interface PDFDocumentLoadArguments {
        uri: string;
        data?: Uint8Array;
        password?: string;
        headers?: {
            [key: string]: any;
        };
        withCredentials?: boolean;
    }
    class PDFProxyCache {
        static removalQueueLimit: number;
        static loadPageFromDocument(doc: Document.LEADDocument, pageNumber: number, pageSuccess: PDFPageProxyLoaded, pageFail: PDFProxyFailure, documentFail: PDFProxyFailure): void;
        static loadPage(id: string, isLocalResource: boolean, args: PDFDocumentLoadArguments, pageNumber: number, pageSuccess: PDFPageProxyLoaded, pageFail: PDFProxyFailure, documentFail: PDFProxyFailure): void;
        static getExistingDocument(id: string): any;
        static releasePage(id: string, pageNumber: number): void;
    }
}
declare module lt.Document {
    class PDFRender {
        static initialize(): void;
        static getPageSize(pageProxy: any): lt.LeadSizeD;
        static readonly isPDFRenderingSupported: boolean;
        static canRenderPage(page: DocumentPage): boolean;
        static getDeviceScaling(ctx: CanvasRenderingContext2D): number;
        static disposeCanvasElement(canvas: HTMLCanvasElement, isAsync: boolean): void;
        static disposeImageElement(image: HTMLImageElement): void;
        static removeTransitions(element: HTMLElement): void;
    }
    interface PDFPageRendererDone {
        (source: PDFPageRenderer, cancelled: boolean, ex: Error): void;
    }
    class PDFPageRenderer {
        done: PDFPageRendererDone;
        readonly isTaskCancelling: boolean;
        readonly isTaskRunning: boolean;
        cancel(): void;
        tryRender(pageProxy: any, ctx: CanvasRenderingContext2D, resultWidth: number, resultHeight: number, paintOffsetX: number, paintOffsetY: number, deviceScaling: number): boolean;
        static render(pageProxy: any, ctx: CanvasRenderingContext2D, resultWidth: number, resultHeight: number, paintOffsetX: number, paintOffsetY: number, deviceScaling: number): any;
        dispose(): void;
    }
    class RenderElement {
        constructor(initial: HTMLCanvasElement);
        readonly element: HTMLElement;
        dispose(asAsync: boolean): void;
    }
}
declare module lt.Document {
    interface PDFGetPageTextDone {
        (pageText: DocumentPageText, ex: Error): void;
    }
    class PDFText {
        static assignDefaultDrawText(ctx: CanvasRenderingContext2D): void;
        static getTextForDocumentPage(page: DocumentPage, done: PDFGetPageTextDone): void;
        static getText(id: string, isLocalResource: boolean, args: PDFDocumentLoadArguments, pageNumber: number, documentPageSize: LeadSizeD, done: PDFGetPageTextDone): void;
    }
}
declare module lt.Document.Service {
    class Custom {
        static createEndpointUrl(controller: string, endpoint: string): string;
        static createEndpointGetUrl<T extends Request>(controller: string, endpoint: string, params: T, encode: boolean): string;
        static createGetAjaxSettings<T extends Request>(url: string, params: T): JQueryAjaxSettings;
        static createPostAjaxSettings<T extends Request>(url: string, params: T): JQueryAjaxSettings;
        static createHeadAjaxSettings<T extends Request>(url: string, params: T): JQueryAjaxSettings;
        static requestAjax<R>(sender: any, sourceClass: string, sourceMethod: string, ajaxSettings: JQueryAjaxSettings, isLocalResource?: boolean): JQueryPromise<R>;
        static requestAjaxWithMimeType(sender: any, sourceClass: string, sourceMethod: string, ajaxSettings: JQueryAjaxSettings, isLocalResource?: boolean): JQueryPromise<ArrayBuffer>;
    }
}
declare module lt.Document {
    class ServiceError {
        message: string;
        detail: string;
        code: number;
        link: string;
        exceptionType: string;
        methodName: string;
        statusCode: number;
        userData: string;
        jqXHR: JQueryXHR;
        statusText: string;
        errorThrown: string;
        readonly isAbortError: boolean;
        readonly isParseError: boolean;
        readonly isCancelError: boolean;
        readonly isBrowserError: boolean;
        readonly isTimeoutError: boolean;
        readonly isError: boolean;
        private static create;
        static parseError(jqXHR: JQueryXHR, statusText: string, errorThrown: string): ServiceError;
    }
}
declare module lt.Document.Service {
    interface GetAnnotationsRequest extends Request {
        documentId: string;
        pageNumber: number;
        createEmpty: boolean;
    }
    interface GetAnnotationsResponse extends Response {
        annotations: string;
    }
    interface SetAnnotationsRequest extends Request {
        documentId: string;
        pageNumber: number;
        annotations: string;
    }
}
declare module lt.Document.Service {
    interface GenerateReportRequest extends Request {
        mimetype: string;
        options: lt.Document.Compare.ReportOptions;
        differences: any;
    }
}
declare module lt.Document.Service.Converter {
    interface RunConvertJobRequest extends Request {
        documentId: string;
        jobData: DocumentConverterJobData;
    }
    interface RunConvertJobResponse extends Response {
        userToken: string;
        jobToken: string;
    }
    interface QueryConvertJobStatusRequest extends Request {
        userToken: string;
        jobToken: string;
    }
    interface QueryConvertJobStatusResponse extends Response {
        jobData: lt.Document.Converter.StatusJobData;
    }
    interface DeleteConvertJobStatusRequest extends Request {
        userToken: string;
        jobToken: string;
    }
    interface AbortConvertJobRequest extends Request {
        userToken: string;
        jobToken: string;
    }
    interface CacheUriRequest extends Request {
        documentId: string;
    }
}
declare module lt.Document.Service {
    interface DecryptRequest extends Request {
        documentId: string;
        password: string;
    }
    interface DecryptResponse extends Response {
        document: LEADDocument;
    }
    interface ConvertRequest extends Request {
        documentId: string;
        jobData: DocumentConverterJobData;
    }
    interface ConvertResponse extends Response {
        documentId: string;
        archive: ConvertItem;
        document: ConvertItem;
        annotations: ConvertItem;
    }
    interface RunConvertJobRequest extends Request {
        documentId: string;
        jobData: DocumentConverterJobData;
    }
    interface RunConvertJobResponse extends Response {
        userToken: string;
        jobToken: string;
    }
    interface CacheUriRequest extends Request {
        documentId: string;
    }
    interface CorsUrlRequest extends Request {
        url: string;
    }
    interface CompareDocumentRequest extends Request {
        documentIds: string[];
        options: lt.Document.Compare.DocumentCompareOptions;
    }
    interface CompareDocumentResponse extends Response {
        documentDifference: lt.Document.Compare.DocumentDifference;
    }
}
declare module lt.Document.Service {
    interface LoadFromCacheRequest extends Request {
        documentId: string;
    }
    interface LoadFromCacheResponse extends Response {
        document: LEADDocument;
    }
    interface CheckCacheInfoRequest extends Request {
        uri: string;
    }
    interface CheckCacheInfoResponse extends Request {
        cacheInfo: CacheInfo;
    }
    interface LoadFromUriRequest extends Request {
        options: LoadDocumentOptions;
        uri: string;
        resolution: number;
    }
    interface LoadFromUriResponse extends Response {
        document: LEADDocument;
    }
    interface BeginUploadRequest extends Request {
        documentId: string;
        options: UploadDocumentOptions;
    }
    interface BeginUploadResponse extends Response {
        uploadUri: string;
    }
    interface UploadDocumentRequest extends Request {
        uri: string;
        data: string;
    }
    interface EndUploadRequest extends Request {
        uri: string;
    }
    interface DownloadRequest extends Request {
        documentId: string;
        uri: string;
        position: number;
        dataSize: number;
    }
    interface DownloadDocumentRequest extends Request {
        documentId: string;
        uri: string;
        includeAnnotations: boolean;
        contentDisposition: string;
    }
    interface DownloadDocumentResponse extends Response {
        data: ArrayBuffer;
        mimeType: string;
    }
    interface AbortUploadDocumentRequest extends Request {
        uri: string;
    }
    interface SaveToCacheRequest extends Request {
        descriptor: DocumentDescriptor;
    }
    interface SaveToCacheResponse extends Response {
        document: LEADDocument;
    }
    interface DeleteFromCacheRequest extends Request {
        documentId: string;
    }
}
declare module lt.Document.Service {
    interface GetThumbnailsGridRequest extends Request {
        documentId: string;
        firstPageNumber: number;
        lastPageNumber: number;
        maximumGridWidth: number;
        width: number;
        height: number;
    }
}
declare module lt.Document.Service {
    interface GetImageRequest extends Request {
        documentId: string;
        pageNumber: number;
    }
    interface GetSvgBackImageRequest extends Request {
        documentId: string;
        pageNumber: number;
        backColor: string;
    }
    interface GetThumbnailRequest extends Request {
        documentId: string;
        pageNumber: number;
        width: number;
        height: number;
    }
    interface GetSvgRequest extends Request {
        documentId: string;
        pageNumber: number;
        options: DocumentGetSvgOptions;
        unembedImages: boolean;
    }
    interface GetTextRequest extends Request {
        documentId: string;
        pageNumber: number;
        clip: LeadRectD;
        textExtractionMode: DocumentTextExtractionMode;
        imagesRecognitionMode: DocumentTextImagesRecognitionMode;
    }
    interface GetTextResponse extends Response {
        pageText: DocumentPageText;
    }
    interface ReadBarcodesRequest extends Request {
        documentId: string;
        pageNumber: number;
        bounds: LeadRectD;
        maximumBarcodes: number;
        symbologies: Barcode.BarcodeSymbology[];
    }
    interface ReadBarcodesResponse extends Response {
        barcodes: Barcode.BarcodeData[];
    }
}
declare module lt.Document.Service {
    interface Request {
        userData: string;
    }
}
declare module lt.Document.Service {
    interface Response {
        userData: string;
    }
}
declare module lt.Document.Service {
    interface ParseStructureRequest extends Request {
        documentId: string;
        parseBookmarks: boolean;
        parsePageLinks: boolean;
    }
    interface ParseStructureResponse extends Response {
        bookmarks: DocumentBookmark[];
        pageLinks: DocumentLink[][];
    }
}
declare module lt.Document.Service {
    interface PingResponse extends Response {
        message: string;
        time: string;
        isLicenseChecked: boolean;
        isLicenseExpired: boolean;
        isCacheAccessible: boolean;
        kernelType: string;
        ocrEngineStatus: number;
        serviceVersion: string;
        kernelVersion: string;
    }
}
