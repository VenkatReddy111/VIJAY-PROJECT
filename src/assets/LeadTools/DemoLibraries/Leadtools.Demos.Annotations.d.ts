declare module lt.Demos.Annotations {
    class AnnPropertyInfo {
        valueChanged: AnnObjectEditorValueChangedHandler;
        constructor(propertyName: string, readOnly: boolean, value: any, groupName: string, description: string, displayName: string, visible: boolean, editorType: AnnEditorConstructor);
        private editorType_OnValueChanged;
        private _editor;
        readonly editor: AnnEditor;
        private _isReadOnly;
        readonly isReadOnly: boolean;
        private _isVisible;
        readonly isVisible: boolean;
        private _value;
        value: any;
        private _displayName;
        displayName: string;
        private _values;
        readonly values: {
            [key: string]: any;
        };
        private _type;
        readonly type: any;
        private _hasValues;
        readonly hasValues: boolean;
        private _groupName;
        groupName: string;
        private _description;
        description: string;
    }
}
declare module lt.Demos.Annotations {
    interface AudioPlayerDialogUI<T> {
        audioObject: T;
        hide: T;
    }
    class AudioPlayerDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: AudioPlayerDialogUI<JQuery>;
        private _source;
        private _audioElement;
        private _sourceElement1;
        private _sourceElement2;
        private _sourceElement3;
        constructor(root: JQuery, selectors: AudioPlayerDialogUI<string>);
        play(source1: string, source2: string, source3: string): void;
        readonly audioElement: HTMLAudioElement;
        private _onHide;
    }
}
declare module lt.Demos.Annotations {
    interface AutomationUpdateObjectDialogUI<T> {
        properties: {
            tab: T;
            page: T;
        };
        content: {
            tab: T;
            page: T;
        };
        reviews: {
            tab: T;
            page: T;
        };
        hide: T;
    }
    class AutomationUpdateObjectDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: AutomationUpdateObjectDialogUI<JQuery>;
        private _targetObject;
        targetObject: lt.Annotations.Engine.AnnObject;
        private _targetContainer;
        targetContainer: lt.Annotations.Engine.AnnContainer;
        private _automation;
        automation: lt.Annotations.Automation.AnnAutomation;
        private _userName;
        userName: string;
        onHide: () => void;
        showProperties: boolean;
        showContent: boolean;
        showReviews: boolean;
        private _propertiesPage;
        private _contentPage;
        private _reviewsPage;
        private $allTabsAndPages;
        static selectedClass: string;
        constructor(root: JQuery, selectors: AutomationUpdateObjectDialogUI<string>);
        private _onHideClicked;
        show(): void;
    }
}
declare module lt.Demos.Annotations {
    class ContentPage {
        constructor($propertiesPage: JQuery);
        private _pageElement;
        private _ui;
        _targetObject: lt.Annotations.Engine.AnnObject;
        targetObject: lt.Annotations.Engine.AnnObject;
        private _onContentChange;
        onContentChange: {
            (): void;
        };
        private _contentText;
        contentText: string;
        initialize: () => void;
        empty: () => void;
    }
}
declare module lt.Demos.Annotations {
    interface RichTextDialogUI<T> {
        editor: T;
        hide: T;
    }
    class RichTextDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: RichTextDialogUI<JQuery>;
        private _password;
        onHide: () => void;
        private _richTextEditor;
        readonly richTextEditor: HTMLTextAreaElement;
        constructor(root: JQuery, selectors: RichTextDialogUI<string>);
        private _onHideClicked;
        show(): void;
    }
}
declare module lt.Demos.Annotations {
    class ListTreeNode {
        private _childNodes;
        childNodes: ListTreeNode[];
        private _isExpanded;
        isExpanded: boolean;
        constructor();
        private _parentDiv;
        readonly parentDiv: HTMLDivElement;
        private _headingDiv;
        readonly headingDiv: HTMLDivElement;
        private _headingLabel;
        readonly headingLabel: HTMLLabelElement;
        private _collapseExpandBtn;
        readonly collapseExpandBtn: HTMLAnchorElement;
        private _contentDiv;
        readonly contentDiv: HTMLDivElement;
        private _contextMenu;
        contextMenu: HTMLDivElement;
        private _contextMenu_collapseExpandBtn;
        contextMenu_collapseExpandBtn: HTMLButtonElement;
        createTreeNode(): void;
        clearContent(): void;
        private collapseExpandBtn_Click;
        updateNodeExpansion(): void;
        updateObjectInfoVisibility(): void;
        private showContextMenu;
        onShowContextMenu(): void;
        private contextMenu_collapseExpandBtn_Click;
        private _isTouchHold;
        private _touchHoldTimeOutHandler;
        private _currentTouchPoint;
        private _touchMoveTolerance;
        private hideContextMenu;
        private contextmenu;
        private touchstart;
        private touchmove;
        private touchend;
    }
}
declare module lt.Demos.Annotations {
    class AnnObjectTreeNode extends ListTreeNode {
        private _owner;
        private _automation;
        private _imageViewer;
        private _annContainer;
        private _annObject;
        readonly annObject: lt.Annotations.Engine.AnnObject;
        private _contentTextArea;
        private _contextMenu_replyBtn;
        private _contextMenu_deleteBtn;
        private _contextMenu_propertiesBtn;
        constructor(owner: AutomationObjectsListControl, automation: lt.Annotations.Automation.AnnAutomation, imageViewer: lt.Controls.ImageViewer, annContainer: lt.Annotations.Engine.AnnContainer, annObject: lt.Annotations.Engine.AnnObject);
        static createContextMenu(): void;
        customizeTreeNode(): void;
        static toLocalTimeString(utcString: string): string;
        updateMetadata(): void;
        updateContent(): void;
        hookEvents(): void;
        private parentDiv_MouseDown;
        private contentTextArea_Change;
        private _doFocusOnSelectedNode;
        selectNode(selectState: boolean): void;
        private _selectNodeWithFocus;
        onShowContextMenu(): void;
        private contextMenu_replyBtn_Click;
        private contextMenu_deleteBtn_Click;
        private contextMenu_propertiesBtn_Click;
    }
}
declare module lt.Demos.Annotations {
    class AutomationObjectsListControl {
        private _automation;
        automation: lt.Annotations.Automation.AnnAutomation;
        private _imageViewer;
        imageViewer: lt.Controls.ImageViewer;
        static userName: string;
        private _listContainerDiv;
        listContainerDiv: HTMLDivElement;
        private _pages;
        constructor();
        private _automation_AfterObjectChanged;
        private _automationContainers_CollectionChanged;
        private _automation_CurrentDesignerChanged;
        private _automation_AfterUndoRedo;
        private hookEvents;
        private automationContainers_CollectionChanged;
        private automation_AfterUndoRedo;
        private _ignoreChangedCounter;
        beginIgnoreChanged(): void;
        endIgnoreChanged(): void;
        private automation_AfterObjectChanged;
        private updateAllMetadata;
        private automation_CurrentDesignerChanged;
        private updateSelection;
        private getSelectedItems;
        private clear;
        populate(): void;
        populateContainer(annContainer: lt.Annotations.Engine.AnnContainer): void;
    }
}
declare module lt.Demos.Annotations {
    class PageTreeNode extends ListTreeNode {
        private _owner;
        private _automation;
        private _imageViewer;
        private _annContainer;
        readonly annContainer: lt.Annotations.Engine.AnnContainer;
        constructor(owner: AutomationObjectsListControl, automation: lt.Annotations.Automation.AnnAutomation, imageViewer: lt.Controls.ImageViewer, annContainer: lt.Annotations.Engine.AnnContainer);
        updateTitle(): void;
        updateContent(): boolean;
    }
}
declare module lt.Demos.Annotations {
    class ReviewTreeNode extends ListTreeNode {
        private _automation;
        private _annObject;
        private _annContainer;
        private _annReview;
        readonly annReview: lt.Annotations.Engine.AnnReview;
        private _parentTreeNode;
        private _dateTimeLabel;
        private _commentTextArea;
        private _checkedCheckbox;
        private _contextMenu_replyBtn;
        private _contextMenu_checkBtn;
        private _contextMenu_addBtn;
        private _contextMenu_deleteBtn;
        private _statusBtns;
        static undoImageUrl: string;
        constructor(automation: lt.Annotations.Automation.AnnAutomation, annObject: lt.Annotations.Engine.AnnObject, annContainer: lt.Annotations.Engine.AnnContainer, annReview: lt.Annotations.Engine.AnnReview, parentTreeNode: ListTreeNode);
        static createContextMenu(): void;
        customizeTreeNode(): void;
        updateContent(): void;
        hookEvents(): void;
        private checkedCheckbox_Change;
        private commentTextArea_Change;
        onShowContextMenu(): void;
        private contextMenu_replyBtn_Click;
        private contextMenu_checkBtn_Click;
        private contextMenu_addBtn_Click;
        private contextMenu_deleteBtn_Click;
        private statusBtns_BtnClicked;
    }
}
declare module lt.Demos.Annotations {
    class AutomationTextArea {
        private _textAreaElement;
        private _removeAction;
        private _automation;
        textObject: lt.Annotations.Engine.AnnTextObject;
        constructor(parent: HTMLDivElement, automation: lt.Annotations.Automation.AnnAutomation, editTextEvent: lt.Annotations.Engine.AnnEditTextEventArgs, removeAction: {
            (update: boolean): void;
        });
        remove(update: boolean): void;
        updateTextObject(): void;
        private tryInternalRemove;
        private textAreaElement_StopPropagation;
        private textAreaElement_FocusOut;
        private textAreaElement_KeyDown;
    }
}
declare module lt.Demos.Annotations.RubberStamp {
    class Loader {
        static defaultsPath: string;
        static defaultsExtension: string;
        private static createDefaultEntities;
        static createDefaults(target: any): void;
        automationManager: lt.Annotations.Automation.AnnAutomationManager;
        element: HTMLElement;
        constructor(automationManager: lt.Annotations.Automation.AnnAutomationManager, element: HTMLElement);
        items: {
            [index: number]: Entity;
        };
        recents: Entity[];
        quickSelect: QuickSelect;
        update(): void;
        beginDraw(): void;
        updateRecents(): void;
        showQuickSelect(): void;
        selectItem: (index: number) => void;
    }
    class Entity {
        index: number;
        title: string;
        picture: lt.Annotations.Engine.AnnPicture;
        category: string;
        static create(index: number, title: string, picture: lt.Annotations.Engine.AnnPicture, category: string): Entity;
    }
}
declare module lt.Demos.Annotations.RubberStamp {
    class QuickSelect {
        static className: string;
        private static _dynamicStyle;
        private static _didInit;
        private static _init;
        private static _down;
        private static _resize;
        private static _createDynamicStyle;
        root: HTMLElement;
        rootBody: HTMLElement;
        private _isVisible;
        private _currentRef;
        showAbove: boolean;
        limit: number;
        constructor();
        private _onResize;
        private _onDown;
        hide(): void;
        private _isDisposed;
        dispose(): void;
        show(recents: Entity[], items: {
            [index: number]: Entity;
        }, ref: HTMLElement, click: (index: number) => void): void;
        private createInnerUI;
        updatePosition(ref: HTMLElement): void;
        private _updatePosition;
    }
}
declare module lt.Demos.Annotations {
    class ToolTip {
        static className: string;
        private static _dynamicStyle;
        private static _init;
        private _element;
        readonly element: HTMLElement;
        private _parent;
        readonly parent: HTMLElement;
        constructor(parent: HTMLElement);
        show(position: lt.LeadPointD, text: string): void;
        hide(): void;
        remove(): void;
    }
}
declare module lt.Demos.Annotations {
    class TreeView implements ITree {
        onSelectionChanged: {
            (event: Event): void;
        };
        root: HTMLDivElement;
        childNodesDiv: HTMLDivElement;
        parentDiv: HTMLDivElement;
        private _selectedNode;
        selectedNode: TreeNode;
        private _nodes;
        nodes: TreeNode[];
        constructor(divID: string);
        addNode(node: TreeNode): void;
        deleteNode(node: TreeNode): void;
        private updateUIElements;
    }
    class TreeNode implements ITree {
        treeView: TreeView;
        parent: TreeNode;
        parentDiv: HTMLDivElement;
        childNodesDiv: HTMLDivElement;
        header: HTMLDivElement;
        root: HTMLDivElement;
        private collapseLabel;
        private isCollapsed;
        private _isSelected;
        isSelected: boolean;
        private _nodes;
        nodes: TreeNode[];
        private _tag;
        tag: any;
        private _content;
        content: HTMLElement;
        constructor(treeView: TreeView);
        private mainDiv_Click;
        private collapseLabel_Click;
        setCollapsed(collapsedState: boolean): void;
        addNode(node: TreeNode): void;
        deleteNode(node: TreeNode): void;
    }
    interface ITree {
        root: HTMLDivElement;
        childNodesDiv: HTMLDivElement;
        addNode(node: TreeNode): any;
        deleteNode(node: TreeNode): any;
    }
}
declare module lt.Demos.Annotations {
    interface MediaPlayerDialogUI<T> {
        videoObject: T;
        hide: T;
    }
    class MediaPlayerDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: MediaPlayerDialogUI<JQuery>;
        private _source;
        private _videoElement;
        private _sourceElement1;
        private _sourceElement2;
        private _sourceElement3;
        constructor(root: JQuery, selectors: MediaPlayerDialogUI<string>);
        play(source1: string, source2: string, source3: string): void;
        readonly videoElement: HTMLVideoElement;
        private _onHideClicked;
    }
}
declare module lt.Demos.Annotations {
    interface AnnObjectEditorValueChangedHandler {
        (oldValue: any, newValue: any): void;
    }
    interface AnnEditorConstructor {
        new (value: any, groupName: string, name?: string, displayName?: string): AnnEditor;
    }
    class AnnEditor {
        onValueChanged: AnnObjectEditorValueChangedHandler;
        protected _groupName: string;
        readonly groupName: string;
        protected _properties: {
            [key: string]: AnnPropertyInfo;
        };
        readonly properties: {
            [key: string]: AnnPropertyInfo;
        };
    }
    class AnnColorEditor extends AnnEditor {
        constructor(color: string, groupName: string);
        private _color;
        value: any;
    }
    class AnnBooleanEditor extends AnnEditor {
        constructor(value: boolean, groupName: string);
        private _value;
        value: boolean;
    }
    class AnnLengthEditor extends AnnEditor {
        constructor(annLength: lt.LeadLengthD, groupName: string, propertyName: string, displayName: string);
        private _annLength;
        private info_ValueChanged;
    }
    class AnnSolidColorBrushEditor extends AnnEditor {
        constructor(annSolidColorBrush: lt.Annotations.Engine.AnnSolidColorBrush, groupName: string, propertyName: string, displayName: string);
        private _annSolidColorBrush;
        info_ValueChanged: (oldValue: any, newValue: any) => void;
    }
    class AnnDoubleEditor extends AnnEditor {
        constructor(value: number, groupName: string);
        private _value;
        value: number;
    }
    class AnnStringEditor extends AnnEditor {
        constructor(value: string, groupName: string);
        private _value;
        value: string;
    }
    class AnnPictureEditor extends AnnEditor {
        constructor(value: lt.Annotations.Engine.AnnPicture, groupName: string);
        private _value;
        value: lt.Annotations.Engine.AnnPicture;
    }
    class AnnMediaEditor extends AnnEditor {
        constructor(value: lt.Annotations.Engine.AnnMedia, groupName: string);
        private _value;
        value: lt.Annotations.Engine.AnnMedia;
    }
    class AnnIntegerEditor extends AnnEditor {
        constructor(value: number, groupName: string);
        private _value;
        value: number;
    }
    class AnnStrokeEditor extends AnnEditor {
        constructor(annStroke: lt.Annotations.Engine.AnnStroke, groupName: string);
        private strokePropertyInfo_ValueChanged;
    }
    class AnnFontEditor extends AnnEditor {
        constructor(annFont: lt.Annotations.Engine.AnnFont, groupName: string);
        private _annFont;
        private fontSize_ValueChanged;
        private fontFamilyName_ValueChanged;
    }
    class AnnObjectEditor {
        private _properties;
        readonly properties: {
            [key: string]: AnnPropertyInfo;
        };
        private _annObject;
        constructor(annObject: lt.Annotations.Engine.AnnObject);
        private wordWrapInfo_ValueChanged;
        private pictureInfo_ValueChanged;
        private hyperlink_ValueChanged;
        private showPictureInfo_ValueChanged;
        private expandedInfo_ValueChanged;
        private fillPropertyInfo_ValueChanged;
        private strokePropertyInfo_ValueChanged;
        private ruberStampTypeinfo_ValueChanged;
        private acuteInfo_ValueChanged;
        private fixedPointerInfo_ValueChanged;
        private anglePrecisionInfo_ValueChanged;
        private precisionInfo_ValueChanged;
        private angularUnitInfo_ValueChanged;
        private showTickMarksInfo_ValueChanged;
        private measurementUnitInfo_ValueChanged;
        private showGauge_ValueChanged;
        private tensionInfo_ValueChanged;
        private horizontalAlignment_ValueChanged;
        private verticalAlignment_ValueChanged;
        private text_ValueChanged;
        private media_ValueChanged;
        private encryptKey_ValueChanged;
        private encryptor_ValueChanged;
        private RubberStampTypeToString;
        private static fillEnumValue;
    }
}
declare module lt.Demos.Annotations {
    enum ObjectsAlignment {
        toLeft = -1,
        toCenter = -2,
        toRight = -3,
        toTop = -4,
        toMiddle = -5,
        toBottom = -6,
        sameWidth = -7,
        sameHeight = -8,
        sameSize = -9
    }
    interface ObjectsAlignmentDialogUI<T> {
        enabledCheckbox: T;
        objectAlignments: T;
        hide: T;
    }
    class ObjectsAlignmentDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: ObjectsAlignmentDialogUI<JQuery>;
        private _automation;
        automation: lt.Annotations.Automation.AnnAutomation;
        onApply: (alignment: ObjectsAlignment) => void;
        constructor(root: JQuery, selectors: ObjectsAlignmentDialogUI<string>);
        show(): void;
        private _onHideClicked;
        private _enableObjectsAlignment_Changed;
        private _objectsAlignmentButtons_Clicked;
    }
}
declare module lt.Demos.Annotations {
    interface PasswordDialogUI<T> {
        title: T;
        submit: T;
        input: T;
        hide: T;
    }
    class PasswordDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: PasswordDialogUI<JQuery>;
        private _lock;
        private _password;
        onVerify: () => boolean;
        constructor(root: JQuery, selectors: PasswordDialogUI<string>);
        private _onHideClicked;
        setLock(lock: boolean): void;
        readonly password: string;
        private _onSubmitClicked;
        show(): void;
    }
}
declare module lt.Demos.Annotations {
    class PropertiesPage {
        private _tabs;
        constructor($propertiesPage: JQuery);
        private _pageElement;
        private _tabHolder;
        private _pageHolder;
        private _automation;
        automation: lt.Annotations.Automation.AnnAutomation;
        private _dialogUI;
        static onPropertiesChanged: {
            (value: string, userData: any): void;
        };
        private _groups;
        readonly groupCount: number;
        initialize(): void;
        private recursiveProcessProperties;
        private addPropertyItemToGroup;
        private _currentSelected;
        private renderAllProperties;
        private createPropertyItemsHTML;
        static validateNumericKey(event: Event): void;
        private static _update;
        private clear;
    }
    enum HTMLType {
        label = 0,
        input = 1,
        dropdown = 2,
        num = 3,
        picture = 4,
        integerInput = 5,
        media = 6
    }
}
declare module lt.Demos.Annotations {
    class ReviewsPage {
        constructor($propertiesPage: JQuery);
        private _pageElement;
        private _userName;
        userName: string;
        private treeView;
        private date;
        pageUI: {
            header: string;
            content: string;
            details: string;
            author: string;
            day: string;
            month: string;
            year: string;
            status: string;
            checked: string;
            comment: string;
            reply: string;
            add: string;
            deleteBtn: string;
            treeView: string;
        };
        initialize(): void;
        private empty;
        private addUIEventHandler;
        private createUIElement;
        private treeView_SelectionChanged;
        copyReviewsFrom(annObject: lt.Annotations.Engine.AnnObject, annContainer: lt.Annotations.Engine.AnnContainer): void;
        updateContent(annObject: lt.Annotations.Engine.AnnObject, annContainer: lt.Annotations.Engine.AnnContainer): void;
        replacesReviewsIn(annObject: lt.Annotations.Engine.AnnObject): void;
        private static getNode;
        private static addNode;
        private static _monthArray;
        private static getReviewNodeText;
        private updateUIState;
        private replyNode_Click;
        private addNode_Click;
        private deleteNode_Click;
        private deleteReview;
        private addOrReply;
        private detailsTextBox_TextChanged;
        private checkedCheckBox_ValueChanged;
        private dateTimePicker_ValueChanged;
        private reviewToDetails;
        private detailsToReview;
        private getStatusSelectIndex;
        cleanUp(): void;
    }
}
declare module lt.Demos.Annotations {
    interface SnapToGridPropertiesDialogUI<T> {
        showGridCheckbox: T;
        gridColorSelect: T;
        lineStyleSelect: T;
        gridLength: T;
        lineSpacing: T;
        enableSnapCheckbox: T;
        apply: T;
        hide: T;
    }
    class SnapToGridPropertiesDialog {
        static gridLengthMin: number;
        static gridLengthMax: number;
        static lineSpacingMin: number;
        static lineSpacingMax: number;
        inner: lt.Demos.Dialogs.InnerDialog;
        el: SnapToGridPropertiesDialogUI<JQuery>;
        onHide: () => void;
        private _automation;
        automation: lt.Annotations.Automation.AnnAutomation;
        private _snapToGridOptions;
        constructor(root: JQuery, selectors: SnapToGridPropertiesDialogUI<string>);
        show(): void;
        private getLineStyleFromStroke;
        private getSelectedColorFromStroke;
        private _onHideClicked;
        private _onApplyClicked;
    }
}
declare module lt.Demos.Annotations {
    enum AnnCursorType {
        selectObject = 0,
        selectedObject = 1,
        controlPoint = 2,
        controlPointNWSE = 3,
        controlPointNS = 4,
        controlPointNESW = 5,
        controlPointWE = 6,
        selectRectangle = 7,
        run = 8,
        rotateCenterControlPoint = 9,
        rotateGripperControlPoint = 10,
        Default = 11,
        count = 12
    }
    class AutomationManagerHelper {
        private _manager;
        readonly automationManager: lt.Annotations.Automation.AnnAutomationManager;
        private _resourcesPath;
        static _resourcesTamplate: string;
        private static _drawCursorsTemplate;
        private static _objectsImagesTemplate;
        private _drawCursors;
        readonly drawCursors: {
            [objectId: string]: string;
        };
        private _objectsImages;
        private static _undoImageUrlTemplate;
        private static _automationCursors;
        readonly automationCursors: {
            [key: number]: string;
        };
        constructor(manager: lt.Annotations.Automation.AnnAutomationManager, resourcesPath: string);
        private updateResourcePaths;
        initAutomationDefaultRendering(): void;
        updateAutomationObjects(): void;
        private static updateAutomationObject;
        getAutomationObjectCursor(objectId: number): any;
        getAutomationObjectImage(objectId: number): any;
        private static checkModifierKey;
        loadPackage(annPackage: lt.Annotations.Automation.IAnnPackage): void;
    }
}
declare module lt.Demos.Annotations {
    class AutomationImageViewer extends lt.Controls.ImageViewer implements lt.Annotations.Engine.IAnnAutomationControl {
        constructor(createOptions: lt.Controls.ImageViewerCreateOptions);
        private handleGotFocus;
        automationObject: lt.Annotations.Automation.AnnAutomation;
        get_automationObject(): lt.Annotations.Automation.AnnAutomation;
        set_automationObject(value: lt.Annotations.Automation.AnnAutomation): void;
        automationPointerDown: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationPointerMove: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationPointerUp: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationDoubleClick: lt.Annotations.Engine.AnnPointerEventType;
        add_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        onAutomationPointerDown(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationPointerMove(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationPointerUp(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationDoubleClick(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        automationDpiX: number;
        automationDpiY: number;
        get_automationDpiX(): number;
        get_automationDpiY(): number;
        automationEnabled: boolean;
        get_automationEnabled(): boolean;
        automationEnabledChanged: lt.LeadEventType;
        add_automationEnabledChanged(value: lt.LeadEventHandler): void;
        remove_automationEnabledChanged(value: lt.LeadEventHandler): void;
        onEnabledChanged(e: lt.LeadEventArgs): void;
        automationLostFocus: lt.LeadEventType;
        add_automationLostFocus(value: lt.LeadEventHandler): void;
        remove_automationLostFocus(value: lt.LeadEventHandler): void;
        automationGotFocus: lt.LeadEventType;
        add_automationGotFocus(value: lt.LeadEventHandler): void;
        remove_automationGotFocus(value: lt.LeadEventHandler): void;
        automationSizeChanged: lt.LeadEventType;
        add_automationSizeChanged(value: lt.LeadEventHandler): void;
        remove_automationSizeChanged(value: lt.LeadEventHandler): void;
        onItemChanged(e: lt.Controls.ImageViewerItemChangedEventArgs): void;
        automationTransform: lt.LeadMatrix;
        get_automationTransform(): lt.LeadMatrix;
        automationTransformChanged: lt.LeadEventType;
        add_automationTransformChanged(value: lt.LeadEventHandler): void;
        remove_automationTransformChanged(value: lt.LeadEventHandler): void;
        onTransformChanged(e: lt.LeadEventArgs): void;
        automationUseDpi: boolean;
        get_automationUseDpi(): boolean;
        automationUseDpiChanged: lt.LeadEventType;
        add_automationUseDpiChanged(value: lt.LeadEventHandler): void;
        remove_automationUseDpiChanged(value: lt.LeadEventHandler): void;
        get_useDpi(): boolean;
        set_useDpi(value: boolean): void;
        automationXResolution: number;
        automationYResolution: number;
        get_automationXResolution(): number;
        get_automationYResolution(): number;
        automationInvalidate(rc: lt.LeadRectD): void;
        automationAntiAlias: boolean;
        get_automationAntiAlias(): boolean;
        set_automationAntiAlias(value: boolean): void;
        renderingEngine: lt.Annotations.Engine.AnnRenderingEngine;
        get_renderingEngine(): lt.Annotations.Engine.AnnRenderingEngine;
        set_renderingEngine(value: lt.Annotations.Engine.AnnRenderingEngine): void;
        onPostRender(e: lt.Controls.ImageViewerRenderEventArgs): void;
        private static renderContainer;
        automationGetContainersCallback: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
        get_automationGetContainersCallback(): lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
        set_automationGetContainersCallback(value: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback): void;
        automationContainerIndex: number;
        get_automationContainerIndex(): number;
        set_automationContainerIndex(value: number): void;
        container: lt.Annotations.Engine.AnnContainer;
        automationAttach(container: lt.Annotations.Engine.AnnContainer): void;
        automationDetach(): void;
        get_automationContainer(): lt.Annotations.Engine.AnnContainer;
        automationDataProvider: lt.Annotations.Engine.AnnDataProvider;
        get_automationDataProvider(): lt.Annotations.Engine.AnnDataProvider;
        set_automationDataProvider(value: lt.Annotations.Engine.AnnDataProvider): void;
        automationScrollOffset: lt.LeadPointD;
        get_automationScrollOffset(): lt.LeadPointD;
        automationRotateAngle: number;
        get_automationRotateAngle(): number;
        automationScaleFactor: number;
        get_automationScaleFactor(): number;
        isAutomationEventsHooked: boolean;
        get_isAutomationEventsHooked(): boolean;
        set_isAutomationEventsHooked(value: boolean): void;
    }
}
declare module lt.Demos.Annotations {
    class AutomationInteractiveMode extends lt.Controls.ImageViewerInteractiveMode {
        automationId: number;
        constructor();
        private _id;
        get_id(): number;
        readonly id: number;
        setId(value: number): void;
        private _automationControl;
        automationControl: lt.Annotations.Engine.IAnnAutomationControl;
        private readonly workAutomationControl;
        readonly name: string;
        get_name(): string;
        canStartWork(e: lt.Controls.InteractiveEventArgs): boolean;
        private _dragStartedHandler;
        private _dragDeltaHandler;
        private _dragCompletedHandler;
        private _tapHandler;
        private _doubleTapHandler;
        private _moveHandler;
        start(imageViewer: lt.Controls.ImageViewer): void;
        stop(imageViewer: lt.Controls.ImageViewer): void;
        private _lastNativeEvent;
        private static convertPointerEventArgs;
        private interactiveService_DragStarted;
        private interactiveService_DragDelta;
        private interactiveService_DragCompleted;
        private interactiveService_Tap;
        private interactiveService_DoubleTap;
        private interactiveService_Move;
    }
}
declare module lt.Demos.Annotations {
    interface DocumentPackDialogUI<T> {
        objects: T;
        hide: T;
    }
    class DocumentPackDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: DocumentPackDialogUI<JQuery>;
        private _objectID;
        onHide: (objectID: number) => void;
        constructor(root: JQuery, selectors: DocumentPackDialogUI<string>);
        readonly objectID: number;
        show(): void;
        private _onHideClicked;
        private _documentObjectBtns_BtnClicked;
    }
}
declare module lt.Demos.Annotations {
    class CanvasDataProvider extends lt.Annotations.Engine.AnnDataProvider {
        private _acitveCanvas;
        private _orginalImageData;
        constructor(acitveCanvas: HTMLCanvasElement);
        private applyEncryptDecrypt;
        decrypt(container: lt.Annotations.Engine.AnnContainer, bounds: LeadRectD, key: number): void;
        encrypt(container: lt.Annotations.Engine.AnnContainer, bounds: LeadRectD, key: number): void;
        fill(container: lt.Annotations.Engine.AnnContainer, bounds: lt.LeadRectD, color: string): void;
        getImageData(container: lt.Annotations.Engine.AnnContainer, bounds: lt.LeadRectD): number[];
        setImageData(container: lt.Annotations.Engine.AnnContainer, bounds: lt.LeadRectD, data: any): void;
    }
}
declare module lt.Demos.Annotations {
    enum AutomationControlMultiContainerMode {
        SinglePage = 0,
        MultiPage = 1
    }
    class ImageViewerAutomationControl implements lt.Annotations.Engine.IAnnAutomationControl {
        constructor();
        private _multiContainerMode;
        multiContainerMode: AutomationControlMultiContainerMode;
        dispose(): void;
        private _imageViewer;
        imageViewer: lt.Controls.ImageViewer;
        private handleGotFocus;
        private hook;
        private unHook;
        automationObject: lt.Annotations.Automation.AnnAutomation;
        get_automationObject(): lt.Annotations.Automation.AnnAutomation;
        set_automationObject(value: lt.Annotations.Automation.AnnAutomation): void;
        automationPointerDown: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerDown(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationPointerMove: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerMove(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationPointerUp: lt.Annotations.Engine.AnnPointerEventType;
        add_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationPointerUp(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        automationDoubleClick: lt.Annotations.Engine.AnnPointerEventType;
        add_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        remove_automationDoubleClick(value: lt.Annotations.Engine.AnnPointerEventHandler): void;
        onAutomationPointerDown(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationPointerMove(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationPointerUp(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        onAutomationDoubleClick(args: lt.Annotations.Engine.AnnPointerEventArgs): void;
        automationDpiX: number;
        automationDpiY: number;
        get_automationDpiX(): number;
        get_automationDpiY(): number;
        automationEnabled: boolean;
        get_automationEnabled(): boolean;
        automationEnabledChanged: lt.LeadEventType;
        add_automationEnabledChanged(value: lt.LeadEventHandler): void;
        remove_automationEnabledChanged(value: lt.LeadEventHandler): void;
        onEnabledChanged(e: lt.LeadEventArgs): void;
        automationLostFocus: lt.LeadEventType;
        add_automationLostFocus(value: lt.LeadEventHandler): void;
        remove_automationLostFocus(value: lt.LeadEventHandler): void;
        automationGotFocus: lt.LeadEventType;
        add_automationGotFocus(value: lt.LeadEventHandler): void;
        remove_automationGotFocus(value: lt.LeadEventHandler): void;
        automationSizeChanged: lt.LeadEventType;
        add_automationSizeChanged(value: lt.LeadEventHandler): void;
        remove_automationSizeChanged(value: lt.LeadEventHandler): void;
        private imageViewer_ItemChanged;
        private imageViewer_ActiveItemChanged;
        private automationObject_ActiveContainerChanged;
        private syncActiveItemContainer;
        private getItemForCurrentContainer;
        private getCurrentContainer;
        automationTransform: lt.LeadMatrix;
        get_automationTransform(): lt.LeadMatrix;
        automationTransformChanged: lt.LeadEventType;
        add_automationTransformChanged(value: lt.LeadEventHandler): void;
        remove_automationTransformChanged(value: lt.LeadEventHandler): void;
        private imageViewer_TransformChanged;
        automationUseDpi: boolean;
        get_automationUseDpi(): boolean;
        automationUseDpiChanged: lt.LeadEventType;
        add_automationUseDpiChanged(value: lt.LeadEventHandler): void;
        remove_automationUseDpiChanged(value: lt.LeadEventHandler): void;
        imageViewer_PropertyChanged: (sender: any, e: Controls.PropertyChangedEventArgs) => void;
        automationXResolution: number;
        automationYResolution: number;
        get_automationXResolution(): number;
        get_automationYResolution(): number;
        automationInvalidate(rc: lt.LeadRectD): void;
        automationAntiAlias: boolean;
        get_automationAntiAlias(): boolean;
        set_automationAntiAlias(value: boolean): void;
        renderingEngine: lt.Annotations.Engine.AnnRenderingEngine;
        get_renderingEngine(): lt.Annotations.Engine.AnnRenderingEngine;
        set_renderingEngine(value: lt.Annotations.Engine.AnnRenderingEngine): void;
        private imageViewer_PostRender;
        private static renderContainer;
        automationGetContainersCallback: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
        get_automationGetContainersCallback(): lt.Annotations.Engine.AnnAutomationControlGetContainersCallback;
        set_automationGetContainersCallback(value: lt.Annotations.Engine.AnnAutomationControlGetContainersCallback): void;
        automationContainerIndex: number;
        get_automationContainerIndex(): number;
        set_automationContainerIndex(value: number): void;
        _container: lt.Annotations.Engine.AnnContainer;
        automationAttach(container: lt.Annotations.Engine.AnnContainer): void;
        automationDetach(): void;
        automationDataProvider: lt.Annotations.Engine.AnnDataProvider;
        get_automationDataProvider(): lt.Annotations.Engine.AnnDataProvider;
        set_automationDataProvider(value: lt.Annotations.Engine.AnnDataProvider): void;
        automationScrollOffset: lt.LeadPointD;
        get_automationScrollOffset(): lt.LeadPointD;
        automationRotateAngle: number;
        get_automationRotateAngle(): number;
        automationScaleFactor: number;
        get_automationScaleFactor(): number;
        isAutomationEventsHooked: boolean;
        get_isAutomationEventsHooked(): boolean;
        set_isAutomationEventsHooked(value: boolean): void;
    }
}
declare module lt.Demos.Annotations {
    interface MedicalPackDialogUI<T> {
        objects: T;
        hide: T;
    }
    class MedicalPackDialog {
        inner: lt.Demos.Dialogs.InnerDialog;
        el: MedicalPackDialogUI<JQuery>;
        private _objectID;
        onHide: (objectID: number) => void;
        constructor(root: JQuery, selectors: MedicalPackDialogUI<string>);
        readonly objectID: number;
        show(): void;
        private _onHideClicked;
        private _medicalObjectBtns_BtnClicked;
    }
}
declare module lt.Demos.Annotations {
    class AutomationContextInteractiveMode extends lt.Demos.Viewer.ContextInteractiveMode {
        constructor();
        protected static _name: string;
        readonly name: string;
        get_name(): string;
        toString(): string;
        protected static _id: number;
        readonly id: number;
        get_id(): number;
        _automation: lt.Annotations.Automation.AnnAutomation;
        automation: lt.Annotations.Automation.AnnAutomation;
        protected _invokeContext(args: lt.Demos.Viewer.ContextEventArgs): void;
    }
}
