declare module lt.Ccow {
    class Subject {
        private _Name;
        name: string;
        private _ExistInContext;
        existInContext: boolean;
        private _Items;
        items: LeadCollection;
        items_CollectionChanged(sender: any, e: NotifyLeadCollectionChangedEventArgs): void;
        subject(): void;
        toItemNameArray(): string[];
        toItemValueArray(): Object[];
        hasItem(itemName: string): boolean;
        getItem(itemName: string): ContextItem;
        isEmpty(): boolean;
    }
}
declare module lt.Ccow {
    class ContextItem {
        private _SubjectDescriptor;
        subjectDescriptor: string;
        private _Subject;
        subject: string;
        private _Role;
        role: string;
        private _NameDescriptor;
        nameDescriptor: string;
        private _Name;
        name: string;
        private _Suffix;
        suffix: string;
        private _Value;
        value: Object;
        constructor(item: string);
        toString(): string;
        equals(obj: Object): boolean;
        isEmpty(): boolean;
    }
}
declare module lt.Ccow {
    class Constants {
        static webPassCodeNames: string[];
        static webPassCodeValues: string[];
    }
}
declare module lt.Ccow {
    class CcowBase {
        private _ccowService;
        constructor(serviceLocator: ICcowServiceLocator);
        send(data: string): JQueryAjaxSettings;
    }
}
declare module lt.Ccow {
    class SecureBinding extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        initializeBinding(bindeeCoupon: number, propertyNames: string[], propertyValues: Object[]): JQueryPromise<BindingData>;
        finalizeBinding(bindeeCoupon: number, bindeePublicKey: string, mac: string): JQueryPromise<string[]>;
    }
}
declare module lt.Ccow {
    class SecureContextData extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        getItemNames(contextCoupon: number): JQueryPromise<string[]>;
        setItemValues(participantCoupon: number, itemNames: string[], itemValues: Object[], contextCoupon: number, appSignature: string): JQueryPromise<void>;
        getItemValues(participantCoupon: number, itemNames: string[], onlyChanges: boolean, contextCoupon: number, appSignature: string): JQueryPromise<SecureItemValues>;
    }
}
declare module lt.Ccow {
    class ListenerRegistrar extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        register(url: string, participantCoupon: number): JQueryPromise<number>;
        unregister(url: string): JQueryPromise<void>;
    }
}
declare module lt.Ccow {
    class InterfaceInformation extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        interrogate(interfaceName: string): JQueryPromise<boolean>;
    }
}
declare module lt.Ccow {
    class ImplementationInformation extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        componentName: JQueryPromise<string>;
        revMajorNum: JQueryPromise<string>;
        revMinorNum: JQueryPromise<string>;
        partNumber: JQueryPromise<string>;
        manufacturer: JQueryPromise<string>;
        targetOS: JQueryPromise<string>;
        targetOSRev: JQueryPromise<string>;
        whenInstalled: JQueryPromise<string>;
    }
}
declare module lt.Ccow {
    interface ICcowServiceLocator {
        send(data: string): string;
    }
    class ContextManagementRegistryLocator implements ICcowServiceLocator {
        private _url;
        send(data: string): string;
        onSendData(url: string, data: string): string;
    }
}
declare module lt.Ccow {
    class ContextEventArgs extends lt.LeadEventArgs {
        private _contextCoupon;
        constructor(contextCoupon: number);
        contextCoupon: number;
    }
    class ContextErrorEventArgs extends lt.LeadEventArgs {
        private _exception;
        error: Error;
        constructor(error: Error);
    }
}
interface String {
    format(...args: any[]): string;
}
declare module lt.Ccow {
    class Utils {
        static getBoolValue(dictionary: {
            [key: string]: string;
        }, name: string): boolean;
        static getNumberValue(dictionary: {
            [key: string]: string;
        }, name: string): number;
        static getStringValue(dictionary: {
            [key: string]: string;
        }, name: string): string;
        static getStringArrayValue(dictionary: {
            [key: string]: string;
        }, name: string): string[];
        static arrayToString(data: any[]): string;
        static stringToDictionary(str: string): {
            [key: string]: string;
        };
        static isNullOrEmptyString(str: string): boolean;
        static removeFromString(str: string, pos: number): string;
        static removeFromString(pos1: number, pos2: number, str: string): string;
    }
}
declare module lt.Ccow {
    class LocateData {
        private _componentUrl;
        private _componentParameters;
        private _site;
        constructor(componentUrl: string, componentParameters: string, site: string);
        componentUrl: string;
        componentParameters: string;
        site: string;
    }
    class AuthenticationData {
        private _userData;
        private _repositorySignature;
        constructor(userData: string, repositorySignature: string);
        userData: string;
        repositorySignature: string;
    }
    class ContextChangesData {
        private _noContinue;
        private _responses;
        constructor(responses: string[], noContinue: boolean);
        noContinue: boolean;
        responses: string[];
    }
    class ContextActionData {
        private _actionCoupon;
        private _outputNames;
        private _outputValues;
        private _managerSignature;
        constructor(actionCoupon: number, outputNames: string[], outputValues: string[], managerSignature: string);
        actionCoupon: number;
        outputNames: string[];
        outputValues: string[];
        managerSignature: string;
    }
    class BindingData {
        private _binderPublicKey;
        private _mac;
        constructor(binderPublicKey: string, mac: string);
        binderPublicKey: string;
        mac: string;
    }
    class SecureItemValues {
        private _itemValues;
        private _managerSignature;
        constructor(itemValues: Object[], managerSignature: string);
        itemValues: Object[];
        managerSignature: string;
    }
    class WebSocketInfo {
        private _portNumer;
        private _address;
        constructor(address: string, portNumber: number);
        portNumber: number;
        address: string;
    }
}
declare module lt.Ccow {
    class ContextSession extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        create(): JQueryPromise<string>;
        activate(participantCoupon: number, cmToActivate: string, nonce: string, appSignature: string): JQueryPromise<void>;
    }
}
declare module lt.Ccow {
    class ContextManager extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        getMostRecentContextCoupon(): JQueryPromise<number>;
        joinCommonContext(applicationName: string, contextParticipant: string, survey: boolean, wait: boolean): JQueryPromise<number>;
        leaveCommonContext(participantCoupon: number): JQueryPromise<void>;
        startContextChanges(participantCoupon: number): JQueryPromise<number>;
        endContextChanges(contextCoupon: number): JQueryPromise<ContextChangesData>;
        undoContextChanges(contextCoupon: number): JQueryPromise<void>;
        publishChangesDecision(contextCoupon: number, decision: string): JQueryPromise<string[]>;
        suspendParticipation(participantCoupon: number): JQueryPromise<void>;
        resumeParticipation(participantCoupon: number, wait: boolean): JQueryPromise<void>;
    }
}
declare module lt.Ccow {
    class ContextManagementRegistry extends lt.Ccow.CcowBase {
        constructor(locator: ContextManagementRegistryLocator);
        locate(componentName: string, version: string, descriptiveData: string, contextParticipant: string): JQueryPromise<LocateData>;
    }
}
declare module lt.Ccow {
    class ContextFilter extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        setSubjectsOfInterest(participantCoupon: number, subjectNames: string[]): JQueryPromise<string[]>;
        getSubjectsOfInterest(participantCoupon: number): JQueryPromise<string[]>;
        clearFilter(participantCoupon: number): JQueryPromise<void>;
    }
}
declare module lt.Ccow {
    class ContextData extends lt.Ccow.CcowBase {
        private _serviceUserData;
        serviceUserData: any;
        constructor(serviceLocator: ICcowServiceLocator);
        getItemNames(contextCoupon: number): JQueryPromise<string[]>;
        setItemValues(participantCoupon: number, itemNames: string[], itemValues: Object[], contextCoupon: number): JQueryPromise<void>;
        getItemValues(itemNames: string[], onlyChanges: boolean, contextCoupon: number): JQueryPromise<string[]>;
    }
}
declare module lt.Ccow {
    class ContextAction extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        perform(cpCallBackURL: string, cpErrorURL: string, participantCoupon: number, inputNames: string[], inputValues: string[], appSignature: string): JQueryPromise<ContextActionData>;
    }
}
declare module lt.Ccow {
    class ClientUtils extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        getEncodedHashKey(hashString: string): JQueryPromise<string>;
        getEncodedPublicKey(applicationName: string): JQueryPromise<string>;
        getEncodedSignKey(applicationName: string, messageDigest: string): JQueryPromise<string>;
        getWebSocketInfo(): JQueryPromise<WebSocketInfo>;
        ping(): JQueryPromise<boolean>;
    }
}
declare module lt.Ccow {
    class ClientContext extends lt.Ccow.CcowBase {
        private _clientUtils;
        private _id;
        private _webSocket;
        constructor(serviceLocator: ICcowServiceLocator, id: string);
        dispose(): void;
        error: {
            (sender: any, contextErrorEventArgs: ContextErrorEventArgs): void;
        };
        contextChangesPending: {
            (sender: any, contextEventArgs: ContextEventArgs): void;
        };
        contextChangesAccepted: {
            (sender: any, contextEventArgs: ContextEventArgs): void;
        };
        contextChangesCanceled: {
            (sender: any, contextEventArgs: ContextEventArgs): void;
        };
        commonContextTerminated: {
            (sender: any, eventArgs: LeadEventArgs): void;
        };
        ping: {
            (sender: any, eventArgs: LeadEventArgs): void;
        };
        private onError(e);
        private onMessage(message);
    }
}
declare module lt.Ccow {
    class AuthenticationRepository extends lt.Ccow.CcowBase {
        constructor(serviceLocator: ICcowServiceLocator);
        connect(applicationName: string): JQueryPromise<number>;
        disconnect(bindingCoupon: number): JQueryPromise<void>;
        setAuthenticationData(coupon: number, logonName: string, dataFormat: string, userData: string, appSignature: string): JQueryPromise<void>;
        deleteAuthenticationData(coupon: number, logonName: string, dataFormat: string, appSignature: string): JQueryPromise<void>;
        getAuthenticationData(coupon: number, logonName: string, dataFormat: string, appSignature: string): JQueryPromise<AuthenticationData>;
    }
}
declare module lt.Ccow {
    class CcowException {
        constructor(exception: string, exceptionMessage: string);
    }
}
