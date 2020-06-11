declare module lt.Demos {
    module Utils {
        /** Choices for how a TransitionToggle instance should react when toggle is called in the middle of a toggle operation. */
        enum TransitionToggleInterruptionAction {
            /** Ignore and finish what we were doing */
            ignore = 0,
            /** Immediately toggle with the new action */
            immediate = 1,
            /** Wait for completion of toggle, then swap */
            wait = 2
        }
        /** Used for updating multiple settings at once. */
        interface TransitionToggleOptions {
            classReady?: string;
            classApply?: string;
            transitionEnabled?: boolean;
            transitionMaxTime?: number;
            transitionEndTargets?: JQuery;
            interruptionAction?: TransitionToggleInterruptionAction;
            interruptionWaitTime?: number;
        }
        /**
        * A generic class for applying a "ready" class and "apply" class to a set of elements and running callbacks after the CSS transitions complete.
        */
        class TransitionToggle {
            private static _transitionEvents;
            private _roots;
            /** The root elements provided in the constructor. */
            readonly roots: JQuery;
            /**
             * Creates a new TransitionToggle instance.
             * @param root The root elements to apply classes to.
             */
            constructor(root: JQuery);
            /**
             * Dispose the toggle and destroy all pending callbacks.
             */
            dispose(): void;
            update(options: TransitionToggleOptions): void;
            /**
            * The "base" class name for initial positioning or display state.
            * Default: "tt-ready"
            */
            private classReady;
            /**
            * The "extension"/"application" class name that handles the real transition.
            * Default: "tt-apply"
            */
            private classApply;
            /**
            * Whether or not transitions are enabled.
            * If false, the toggle callback will be immediate and no transition listeners will be registered.
            * Default: true
            */
            transitionEnabled: boolean;
            /**
            * A safety value, in ms, to force the transition to end with the callback if it has not yet been called.
            * This could occur in cases where the CSS styles change but the JavaScript is not updated.
            * If negative, there is no safety check.
            * How long to wait, in ms, to force the end of a toggle (if transitions happen to be enabled in code but not in styles).
            * Default: 2000
            */
            transitionMaxTime: number;
            /**
            * The action to take if toggle is called during a toggle operation.
            * If the chosen action is "wait", the onWaitTime will be honored also.
            * Default: TransitionToggleInterruptionAction.immediate (1)
            */
            interruptionAction: TransitionToggleInterruptionAction;
            /**
            * In ms, the time to wait in the "on" toggle state before allowing the "off" toggle to take effect
            * if using TransitionToggleInterruptionAction.wait (2) as the interruption action.
            * Default: 0
            */
            interruptionWaitTime: number;
            /**
            * The JQuery object to listen for the transition completion events.
            * A falsy value means to only allow transitions from the root.
            * Default: null
            */
            transitionEndTargets: JQuery;
            private _isTransitioning;
            /** Returns true between the time where the classes are applied and the callback is called. */
            readonly isTransitioning: boolean;
            private _isApplied;
            /** Returns true when the toggle is called to "on". */
            readonly isApplied: boolean;
            private static _no_op;
            private _timeoutId;
            private _transitionCallback;
            private _waitTimeoutId;
            private _onTime;
            private _waitCallback;
            private _waitCallbackToggleOnOff;
            /**
             * Toggles the transition state.
             *
             * @param onOff Optional on / off state. If not present, the opposite of the current state is applied.
             * @param callback Optional callback to be run after the toggle. If the onOff parameter is the same as the given
             * state, the "didToggle" parameter of this callback will be false.
             */
            toggle(onOff?: boolean, callback?: (didToggle: boolean) => void): void;
            private _handleWaitCallback;
            private static matches;
        }
    }
}
declare module lt.Demos {
    module Dialogs {
        interface Dialog {
            inner: InnerDialog;
            dispose(): void;
        }
        /**
         * A class to handle the common aspects of a dialog UI component, replacing Bootstrap's implementation.
         * Used as a property of a wrapper dialog class.
         * Allows a simple show/hide method with a callback for transitions by using a TransitionToggle instance.
         */
        class InnerDialog {
            private _root;
            /** The root of the dialog, which is passed to the transitionToggle. */
            readonly root: JQuery;
            /** The transition toggle to handle CSS animations for this UI component. */
            transitionToggle: Utils.TransitionToggle;
            private _isBackgroundMouseDown;
            constructor(root: JQuery);
            private _onMouseDown;
            private _onMouseUp;
            /**
            * Invoked when a click is made directly on the root.
            * Set the property to call hide() to auto-hide on background click.
            */
            onRootClick: () => void;
            /**
            * Boolean value that, when true, prevents the effect of show() and hide().
            * Any callbacks of show() and hide() are immediately called with false.
            */
            lockState: boolean;
            /** A shortcut for checking if the transition toggle classes are applied. */
            readonly isShowing: boolean;
            /**
             * Show the dialog by invoking the transition toggle.
             * If lockState is true, the callback fires immediately without toggling.
             * @param postTransitionCallback Optional post-toggle callback.
             */
            show(postTransitionCallback?: (didToggle: boolean) => void): void;
            /**
             * Hide the dialog by invoking the transition toggle.
             * If lockState is true, the callback fires immediately without toggling.
             * @param postTransitionCallback Optional post-toggle callback.
             */
            hide(postTransitionCallback?: (didToggle: boolean) => void): void;
            dispose(): void;
        }
    }
}
declare module lt.Demos {
    module Dialogs {
        interface AboutDialogUI<T> {
            title: T;
            hide: T;
        }
        class AboutDialog implements Dialog {
            inner: InnerDialog;
            el: AboutDialogUI<JQuery>;
            constructor(root: JQuery, selectors: AboutDialogUI<string>);
            private _onHideClicked;
            name: string;
            show(postTransitionCallback?: (didToggle: boolean) => void): void;
            dispose(): void;
        }
    }
}
declare module lt.Demos {
    module Dialogs {
        interface LoadingDialogUI<T> {
            title: T;
        }
        class LoadingDialog implements Dialog {
            inner: InnerDialog;
            el: LoadingDialogUI<JQuery>;
            constructor(root: JQuery, selectors: LoadingDialogUI<string>);
            show(title: string, postTransitionCallback?: (didToggle: boolean) => void): void;
            title: string;
            hide(postTransitionCallback?: (didToggle: boolean) => void): void;
            dispose(): void;
        }
    }
}
declare module lt.Demos {
    module Dialogs {
        interface OpenSelectionDialogUI<T> {
            itemSelect: T;
            urlInput: {
                container: T;
                textInput: T;
                acceptButton: T;
            };
            hide: T;
        }
        class OpenFileDialog implements Dialog {
            inner: InnerDialog;
            el: OpenSelectionDialogUI<JQuery>;
            onUrlGoClick: (url: string) => void;
            onIndexSelected: (selectedIndex: number) => void;
            constructor(root: JQuery, selectors: OpenSelectionDialogUI<string>);
            private _onHideClicked;
            private _onSelectChanged;
            private _onAcceptClicked;
            show(postTransitionCallback?: (didToggle: boolean) => void): void;
            dispose(): void;
        }
    }
}
declare module lt.Demos {
    module Dialogs {
        interface TextResultDialogUI<T> {
            title: T;
            textResult: T;
            hide: T;
        }
        class TextResultDialog implements Dialog {
            inner: InnerDialog;
            el: TextResultDialogUI<JQuery>;
            constructor(root: JQuery, selectors: TextResultDialogUI<string>);
            private _onHideClicked;
            update(title: string, text: string): void;
            show(postTransitionCallback?: (didToggle: boolean) => void): void;
            dispose(): void;
        }
    }
}
declare module lt.Demos {
    module Utils {
        /** Function to recursively fill a tree of string selectors with their JQuery objects by searching within the provided root. */
        function findSelectorsInRoot(root: JQuery, selectors: {}): {};
        function byteArrayToArrayBuffer(array: number[]): ArrayBuffer;
        function objectAssign(target: any, ...sources: any[]): any;
        function stringFormat(template: string, ...replacements: any[]): string;
    }
}
declare module lt.Demos {
    module Utils {
        interface StyleBlock {
            rule: string;
            declarations: string[][];
        }
        /**
         * Creates a <style> element to be appended to the page with the given declarations.
         */
        class DynamicStyle {
            constructor(id: string, comment: string, blocks: StyleBlock[]);
            /**
             * Checks if a <style> already exists with the given ID.
             * @param id the ID
             */
            static exists(id: string): boolean;
            private _element;
            /**
             * The <style> element.
             */
            readonly element: HTMLStyleElement;
            /**
             * Removes the <style> element.
             */
            dispose(): void;
            /**
             * Creates a StyleBlock object.
             * @param rule
             * @param declarations
             */
            static createStyleBlock(rule: string, declarations: string[][]): StyleBlock;
            /**
             * Creates a string from the StyleBlock.
             * @param block
             */
            static createStyleBlockString(block: StyleBlock): string;
        }
    }
}
declare module lt.Demos {
    module Utils {
        class Network {
            private static _queryString;
            static readonly queryString: {
                [key: string]: string[];
            };
            static isValidURI(uri: string): boolean;
            static showRequestError(jqueryXHR: JQueryXHR, statusText: string, errorThrown: string): void;
            static addParamsToUrl(url: string, params: {}, encodeUriComponent: boolean): string;
        }
        class ServiceHeartbeatPreRequestEventArgs extends LeadEventArgs {
            serviceHeartbeat: ServiceHeartbeat;
            eventTime: number;
            cancel: boolean;
            static create(serviceHeartbeat: ServiceHeartbeat, eventTime: number): ServiceHeartbeatPreRequestEventArgs;
        }
        class ServiceHeartbeatPostRequestEventArgs extends LeadEventArgs {
            serviceHeartbeat: ServiceHeartbeat;
            eventTime: number;
            requestTime: number;
            responseTime: number;
            jqueryXHR: JQueryXHR;
            isSuccess: boolean;
            isError: boolean;
            static create(serviceHeartbeat: ServiceHeartbeat, eventTime: number, requestTime: number, responseTime: number, jqueryXHR: JQueryXHR, isSuccess: boolean, isError: boolean): ServiceHeartbeatPostRequestEventArgs;
        }
        /** Options to pass in the constructor of the Heartbeat instance. */
        interface ServiceHeartbeatOptions {
            /** The request to execute for the heartbeat. */
            requestSettings: JQueryAjaxSettings;
            /** How long after "start" is called to execute the callback (in ms). */
            startTimeout: number;
            /** How long to wait between each callback execution (in ms). */
            interval: number;
            /** How long after "resume" is called to execute the callback (in ms). */
            resumeTimeout: number;
            /** How long to wait between detected activity events to pause the heartbeat (in ms). */
            autoPauseInteractionTimeout: number;
        }
        /** Makes repeated calls to a server and executes a callback on failure. */
        class ServiceHeartbeat {
            requestSettings: JQueryAjaxSettings;
            autoPauseInteractionTimeout: number;
            private timer;
            startTimeout: number;
            interval: number;
            resumeTimeout: number;
            constructor(options: ServiceHeartbeatOptions);
            preRequest: lt.LeadEvent;
            postRequest: lt.LeadEvent;
            private onTick;
            private _autoPauseTimeoutId;
            private clearAutoPause;
            private restartAutoPauseTimer;
            start(): void;
            readonly isStarted: boolean;
            stop(): void;
            pause(): void;
            readonly isPaused: boolean;
            resume(): void;
            readonly isRequesting: boolean;
            private _isDisposed;
            dispose(): void;
        }
        /** Callback used in a timer on each tick. */
        interface TimerTickAsyncCallback {
            (args: TimerTickArgs, done: () => void): void;
        }
        /** Options provided to the constructor of the Timer. */
        interface TimerOptions {
            /** How long after "start" is called to execute the callback. */
            startTimeout: number;
            /** How long to wait between each callback execution. */
            interval: number;
            /** How long after "resume" is called to execute the callback. */
            resumeTimeout: number;
            /** Callback to execute on tick */
            onTickAsync: TimerTickAsyncCallback;
            /** Optional. Data to attach to the instance. */
            data?: any;
        }
        /** Arguments passed as the first parameter to the onTickAsync callback. */
        interface TimerTickArgs {
            timer: Timer;
            tickTime: number;
        }
        class Timer {
            /** The time (in ms) to wait before the first tick. This value will take affect the next time the timer is stopped. */
            startTimeout: number;
            /** The time (in ms) to wait between subsequent ticks after the first. This value will take affect the next time the timer is stopped. */
            interval: number;
            /** The time (in ms) to wait before the first tick after resuming. This value will take affect the next time the timer is stopped. */
            resumeTimeout: number;
            /** The callback to be run when the timer ticks. The second argument must be called to return control to the timer. */
            onTickAsync: TimerTickAsyncCallback;
            /** Any data to attach to the Timer, optionally set from the options object in the constructor. */
            data: any;
            constructor(options: TimerOptions);
            /**
             * Creates a new instance.
             */
            static create(options: TimerOptions): Timer;
            /** Starts the timer if it is stopped. If it is started, it stops the timer and starts it again. The tick count is reset. */
            start(): void;
            protected _currentTimeoutId: number;
            protected _currentStartTimeout: number;
            /** The current startTimeout. */
            readonly currentStartTimeout: number;
            protected _currentInterval: number;
            /** The current interval. */
            readonly currentInterval: number;
            protected _currentResumeTimeout: number;
            /** The current resumeTimeout. */
            readonly currentResumeTimeout: number;
            protected _tickCount: number;
            /** The number of ticks since the timer was last stopped. */
            readonly tickCount: number;
            protected _isStarted: boolean;
            /** Whether or not the timer is started. */
            readonly isStarted: boolean;
            protected _isPaused: boolean;
            /** Whether or not the timer is started and paused. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
            readonly isPaused: boolean;
            /** Pauses a started timer. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
            pause(): void;
            /** Resumes a paused timer. A timer is paused when the tick callback is running. When resumed, the timer will use the currentResumeTimeout. */
            resume(): void;
            protected _resume(timeout: number, skipPauseCheck: boolean): void;
            protected _internalTickAsyncDone: () => void;
            /** Returns true if the async tick callback is running and the timer is not stopped. */
            readonly isInTickAsync: boolean;
            /** Stops the timer. */
            stop(): void;
            /** Stops the timer and cleans it up. */
            dispose(): void;
            protected tickAsync(): void;
        }
    }
}
declare module lt.Demos {
    module Utils {
        class NotificationGroup {
            private static _id;
            private static _showAllNotifications;
            constructor(root: JQuery);
            private _id;
            readonly id: number;
            private _root;
            private _container;
            private _currentNotifications;
            showGroupNotifications: boolean;
            private _isShowingNotification;
            readonly isShowingNotification: boolean;
            notify(header: string, message: string, opts?: NotificationOpts): void;
            dispose(): void;
            private _toggleAllChange;
            private _toggleGroupChange;
            private _hideNotification;
            static defaultOpts: NotificationOpts;
        }
        interface NotificationOpts {
            seconds?: number;
            useTransitions?: boolean;
            className?: string;
        }
    }
}
declare module lt.Demos {
    module Viewer {
        /**
         * The state of an item in the context menu.
         **/
        enum ContextMenuUpdateState {
            /** Default active state. Can be run. */
            active = 0,
            /** Selected. Can be de-selected. */
            selected = 1,
            /** Generic "Disabled" state. Cannot be run. */
            disabled = 2,
            /** Not visible. Cannot be run. */
            disabledHidden = 3,
            /** "Completed" state. Cannot be run. */
            disabledCompleted = 4,
            /** "Selected" state. Cannot be run. */
            disabledSelected = 5
        }
        /** Arguments passed to each item to determine view state and run action. */
        interface ContextMenuArgs {
            /** The context menu from the interaction. */
            menu: ContextMenu;
            /** The view state. This value should be set in the 'update' function. */
            updateState: ContextMenuUpdateState;
            /** This entry. Useful for modifying name, icon, callbacks, etc. */
            action: ContextMenuActionEntry;
            /** The actual UI element for the entry. */
            actionElement: HTMLElement;
            /** The source event. */
            event: lt.Controls.InteractiveEventArgs;
            /** The source item. */
            item: lt.Controls.ImageViewerItem;
            /** The index of this item in its viewer. */
            itemIndex: number;
        }
        /** The base interface for an entry in the context menu. */
        interface ContextMenuEntry {
            /** The name of the entry, which will show in the UI. */
            name: string;
        }
        /** A Folder entry that holds more menu entries. */
        interface ContextMenuFolderEntry extends ContextMenuEntry {
            /** The entries of the folder, which should show in a separate view. */
            entries: ContextMenuEntry[];
        }
        /** An action entry that a user can click to execute a function. */
        interface ContextMenuActionEntry extends ContextMenuEntry {
            /** A callback run before the context menu becomes visible. The entry UI is updated by changing the ContextMenuArgs.updateState property. */
            update: (args: ContextMenuArgs) => void;
            /** The function run when the action entry is clicked. */
            run: (args: ContextMenuArgs) => void;
            /** An optional icon URL to show beside the entry. */
            icon?: string;
        }
        /** Options for the creation of a context menu. */
        interface ImageViewerContextMenuOptions {
            /** The container of the context menu. */
            containerElement: HTMLElement;
            /** The ImageViewer instance the context menu will attach to. */
            viewer: lt.Controls.ImageViewer;
            /** The root-level entries for the context menu. */
            entries: ContextMenuEntry[];
            /** Optional. any additional data to associate with the context menu instance. */
            data?: any;
            /** Optional. The root element of the context menu. Will be appended to the container element. */
            rootElement?: HTMLElement;
        }
        /**
         * A generic ContextMenu implementation. Hooks to a lt.Controls.ImageViewer via a ContextInteractiveMode to receive Context events.
         * When a context event is received, callbacks are run for each entry to determine the entry state. When an action entry is clicked,
         * a separate callback will run.
         **/
        class ContextMenu {
            /** Class name of the root element of the menu. */
            private static _rootClassName;
            /** Class name of the temp size loader. */
            private static _tempSizeLoaderClassName;
            /** Element used for temporarily holding the root to calculate sizes. */
            private static _tempSizeLoader;
            /** Dynamic style to add CSS for the context menu. */
            private static _dynamicStyle;
            /** Whether or not the static initialization was run. */
            private static _didInit;
            /** Sets up resize events and shared CSS styles. */
            private static _init;
            /** Down event, to know when to hide */
            private static _down;
            /** Resize event, to know when to hide */
            private static _resize;
            /** Whether or not the context menu is currently showing. */
            private _isShowing;
            /** Readonly. Whether or not the context menu is currently showing. */
            readonly isShowing: boolean;
            /** Whether or not the context menu may position itself outside of the ImageViewer in the x-direction. */
            constrainX: boolean;
            /** Whether or not the context menu may position itself outside of the ImageViewer in the y-direction. */
            constrainY: boolean;
            /** Any arbitrary data attached to the instance, passed from the options. */
            data: any;
            /** The ImageViewer associated with this context menu. The context menu receives Context events from this ImageViewer. */
            viewer: lt.Controls.ImageViewer;
            /** The entries of this context menu. */
            entries: ContextMenuEntry[];
            /** The ContextInteractiveMode through which this instance will receive context events from the ImageViewer. */
            contextMenuMode: lt.Demos.Viewer.ContextInteractiveMode;
            /** The root element of the context menu.*/
            protected _rootElement: HTMLElement;
            /** The root element of the context menu.*/
            readonly rootElement: HTMLElement;
            /** The container (parent) element of the context menu.*/
            protected _containerElement: HTMLElement;
            /** The container (parent) element of the context menu.*/
            readonly containerElement: HTMLElement;
            /**
             * Creates a context menu instance from the provided options.
             */
            constructor(options: ImageViewerContextMenuOptions);
            private _onResize;
            private _onDown;
            private _onBadChange;
            private _isDisposed;
            dispose(): void;
            hide(): void;
            private _previousArgs;
            /** The callback for a ContextInteractiveMode. */
            protected onContextMenu: (sender: any, e: ContextEventArgs) => void;
            /** Callback run immediately after the Context event is received. Returns the title of the context menu UI. */
            onUpdate: (args: ContextMenuArgs) => string;
            private _condensed;
            /** Whether or not the context menu is in a condensed state where only icons are shown. */
            condensed: boolean;
            private _showCondenseButton;
            /** Whether or not the context menu contains the UI button to change the condensed state. */
            showCondenseButton: boolean;
            protected updateFromArgs(args: ContextMenuArgs): void;
            private static _isActionEntry;
            private static _isFolderEntry;
            private static _createMenuEntry;
            protected updateMenuLocation(x: number, y: number): void;
            private static _getContextMenuSize;
            private static _fitRect;
        }
    }
}
declare module lt.Demos {
    module Utils.Validation {
        interface PageRangeValidatorArgs {
            input: string;
            minPageNumber: number;
            maxPageNumber: number;
        }
        interface PageRangeValidatorResult {
            invalidError: Error;
            outOfRangePages: number[];
            pages: number[];
        }
        class PageRange {
            private static _pageRangeValidator;
            static validate(args: PageRangeValidatorArgs): PageRangeValidatorResult;
            private static _parseInput;
        }
    }
}
declare module lt.Demos {
    module Utils {
        class UI {
            static normalizeIEText(text: string): string;
            static createThumbnailCanvas(originalCanvas: HTMLCanvasElement, thumbnailCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): void;
            static cloneCanvas(oldCanvas: HTMLCanvasElement): HTMLCanvasElement;
            static toggleChecked(element: JQuery, checkUncheck?: boolean): void;
            static isChecked(element: JQuery): boolean;
            static selectText(textElement: HTMLTextAreaElement, startIndex: number, endIndex: number): void;
            static ensureSafeIEButtons(): void;
            static getPageBounds(element: HTMLElement): lt.LeadRectD;
        }
    }
}
declare module lt.Demos {
    module Utils {
        class Visibility {
            private static _hideElementClass;
            private static _hideElementsClassStyle;
            private static _init;
            static isHidden(element: JQuery): boolean;
            static toggle(elements: JQuery, showOrHide?: boolean): void;
        }
    }
}
declare module lt.Demos {
    module Viewer {
        interface ContextEventArgs {
            eventArgs: lt.Controls.InteractiveEventArgs;
            imageViewer: lt.Controls.ImageViewer;
            item: lt.Controls.ImageViewerItem;
            itemIndex: number;
        }
        class ContextInteractiveMode extends lt.Controls.ImageViewerInteractiveMode {
            constructor();
            protected static _name: string;
            readonly name: string;
            get_name(): string;
            toString(): string;
            protected static _id: number;
            readonly id: number;
            get_id(): number;
            protected _invokeContext(args: ContextEventArgs): void;
            context: lt.LeadEvent;
            start(imageViewer: lt.Controls.ImageViewer): void;
            stop(imageViewer: lt.Controls.ImageViewer): void;
            protected _onContextMenu: (sender: any, e: Controls.InteractiveEventArgs) => void;
        }
    }
}
