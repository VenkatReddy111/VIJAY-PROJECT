declare module lt.Annotations.UserMedicalPack {
    class AnnMedicalPack implements lt.Annotations.Automation.IAnnPackage {
        private _thumbSize;
        private createLocationThumbStyle;
        private createRotateCenterThumbStyle;
        private createRotateGripperThumbStyle;
        private createParallelLines;
        private createFourParallelLines;
        private createMidline;
        private createSnapPoint;
        private createIntersectionPoint;
        private createCobbAngle;
        private createNorberg;
        getAutomationObjects(): lt.Annotations.Automation.AnnAutomationObject[];
        readonly author: string;
        get_author(): string;
        readonly description: string;
        get_description(): string;
        readonly friendlyName: string;
        get_friendlyName(): string;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnNorbergDrawer extends lt.Annotations.Designers.AnnRectangleDrawDesigner {
        private _objectTemplate;
        readonly linesCount: number;
        private _annNorbergObject;
        readonly finalTargetObject: lt.Annotations.Engine.AnnObject;
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annNorbergObject: AnnNorbergObject);
        endWorking(): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnParallelLinesDrawer extends lt.Annotations.Designers.AnnRectangleDrawDesigner {
        private _objectTemplate;
        readonly linesCount: number;
        private _annParallelLinesObject;
        readonly finalTargetObject: lt.Annotations.Engine.AnnObject;
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annParallelLinesObject: AnnParallelLinesObject);
        endWorking(): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnFourParallelLinesDrawer extends AnnParallelLinesDrawer {
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annParallelLinesObject: AnnParallelLinesObject);
        readonly linesCount: number;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnTwoLinesDrawer extends lt.Annotations.Designers.AnnDrawDesigner {
        private _end;
        private _clickCount;
        readonly clickCount: number;
        onPointerDown(sender: lt.Annotations.Engine.AnnContainer, e: lt.Annotations.Engine.AnnPointerEventArgs): boolean;
        onPointerMove(sender: lt.Annotations.Engine.AnnContainer, e: lt.Annotations.Engine.AnnPointerEventArgs): boolean;
        onPointerUp(sender: lt.Annotations.Engine.AnnContainer, e: lt.Annotations.Engine.AnnPointerEventArgs): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnSnapPointDrawer extends AnnTwoLinesDrawer {
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annMidlineObject: AnnMidlineObject);
        onPointerUp(sender: lt.Annotations.Engine.AnnContainer, e: lt.Annotations.Engine.AnnPointerEventArgs): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnParallelLinesEditor extends lt.Annotations.Designers.AnnEditDesigner {
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annParallelLinesObject: AnnParallelLinesObject);
        moveThumb(thumbIndex: number, offset: lt.LeadPointD): void;
        getThumbLocations(): lt.LeadPointD[];
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnTwoLinesEditer extends lt.Annotations.Designers.AnnEditDesigner {
        getThumbLocations(): lt.LeadPointD[];
        moveThumb(thumbIndex: number, offset: lt.LeadPointD): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnSnapPointEditor extends AnnTwoLinesEditer {
        constructor(automationControl: lt.Annotations.Engine.IAnnAutomationControl, container: lt.Annotations.Engine.AnnContainer, annMidlineObject: AnnMidlineObject);
        getThumbLocations(): lt.LeadPointD[];
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnCobbAngleData {
        private _firstPoint;
        firstPoint: lt.LeadPointD;
        private _secondPoint;
        secondPoint: lt.LeadPointD;
        private _intersectionPoint;
        intersectionPoint: lt.LeadPointD;
        private _angle;
        angle: number;
    }
    class AnnCobbAngleObject extends lt.Annotations.Engine.AnnObject {
        constructor();
        create(): lt.Annotations.Engine.AnnObject;
        readonly friendlyName: string;
        get_friendlyName(): string;
        readonly supportsStroke: boolean;
        get_supportsStroke(): boolean;
        readonly supportsFill: boolean;
        get_supportsFill(): boolean;
        private _cobbAngleData;
        readonly cobbAngleData: AnnCobbAngleData;
        private _anglePrecision;
        anglePrecision: number;
        private calculateCobbAngleData;
        private GetLineAngle;
        private Distance;
        private GetPointExtension;
        hitTest(point: lt.LeadPointD, hitTestBuffer: number): boolean;
        serialize(options: lt.Annotations.Engine.AnnSerializeOptions, parentNode: Node, document: Document): void;
        deserialize(options: lt.Annotations.Engine.AnnDeserializeOptions, element: Node, document: Document): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnIntersectionPointObject extends lt.Annotations.Engine.AnnObject {
        constructor();
        create(): lt.Annotations.Engine.AnnObject;
        readonly friendlyName: string;
        get_friendlyName(): string;
        readonly supportsStroke: boolean;
        get_supportsStroke(): boolean;
        readonly supportsFill: boolean;
        get_supportsFill(): boolean;
        private _intersectionInsideContainer;
        intersectionInsideContainer: boolean;
        private _intersectionPoint;
        readonly intersectionPoint: lt.LeadPointD;
        private _intersectionPointRadius;
        intersectionPointRadius: lt.LeadLengthD;
        getBoundingRectangle(): lt.LeadRectD;
        private calculateIntersectionPoint;
        hitTest(point: lt.LeadPointD, hitTestBuffer: number): boolean;
        serialize(options: lt.Annotations.Engine.AnnSerializeOptions, parentNode: Node, document: Document): void;
        deserialize(options: lt.Annotations.Engine.AnnDeserializeOptions, element: Node, document: Document): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnMidlineObject extends lt.Annotations.Engine.AnnObject {
        constructor();
        create(): lt.Annotations.Engine.AnnObject;
        readonly friendlyName: string;
        get_friendlyName(): string;
        readonly supportsStroke: boolean;
        get_supportsStroke(): boolean;
        readonly supportsFill: boolean;
        get_supportsFill(): boolean;
        private _centerPointRadius;
        centerPointRadius: lt.LeadLengthD;
        getBoundingRectangle(): lt.LeadRectD;
        hitTest(point: lt.LeadPointD, hitTestBuffer: number): boolean;
        serialize(options: lt.Annotations.Engine.AnnSerializeOptions, parentNode: Node, document: Document): void;
        deserialize(options: lt.Annotations.Engine.AnnDeserializeOptions, element: Node, document: Document): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnNorbergObject extends lt.Annotations.Engine.AnnProtractorObject {
        constructor();
        create(): lt.Annotations.Engine.AnnObject;
        readonly friendlyName: string;
        get_friendlyName(): string;
        readonly supportsStroke: boolean;
        get_supportsStroke(): boolean;
        readonly supportsFill: boolean;
        get_supportsFill(): boolean;
        readonly supportsOpacity: boolean;
        get_supportsOpacity(): boolean;
        readonly canRotate: boolean;
        get_canRotate(): boolean;
        readonly ShowGauge: boolean;
        get_ShowGauge(): boolean;
        readonly ShowTickMarks: boolean;
        get_ShowTickMarks(): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnParallelLinesObject extends lt.Annotations.Engine.AnnObject {
        constructor();
        create(): lt.Annotations.Engine.AnnObject;
        readonly supportsStroke: boolean;
        get_supportsStroke(): boolean;
        readonly friendlyName: string;
        get_friendlyName(): string;
        readonly supportsFill: boolean;
        get_supportsFill(): boolean;
        readonly canRotate: boolean;
        get_canRotate(): boolean;
        hitTest(point: lt.LeadPointD, hitTestBuffer: number): boolean;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnNorbergObjectRenderer extends lt.Annotations.Rendering.AnnProtractorObjectRenderer {
        constructor();
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnParallelLinesObjectRenderer extends lt.Annotations.Rendering.AnnObjectRenderer {
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnTwoLinesObjectRenderer extends lt.Annotations.Rendering.AnnObjectRenderer {
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnMidlineObjectRenderer extends AnnTwoLinesObjectRenderer {
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
        private doDrawLine;
        private doDrawPoint;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnIntersectionObjectRenderer extends AnnTwoLinesObjectRenderer {
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
        private doDrawPoint;
        private doDrawLine;
    }
}
declare module lt.Annotations.UserMedicalPack {
    class AnnCobbAngleObjectRenderer extends AnnTwoLinesObjectRenderer {
        render(mapper: lt.Annotations.Engine.AnnContainerMapper, annObject: lt.Annotations.Engine.AnnObject): void;
        private doDrawLine;
        private getAngleText;
    }
}
