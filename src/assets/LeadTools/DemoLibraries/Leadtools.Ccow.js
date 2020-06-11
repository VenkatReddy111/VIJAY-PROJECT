var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var Subject = (function () {
            function Subject() {
                this._Name = "";
                this._ExistInContext = false;
                this._Items = new lt.LeadCollection();
            }
            Object.defineProperty(Subject.prototype, "name", {
                get: function () {
                    return this._Name;
                },
                set: function (value) {
                    this._Name = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Subject.prototype, "existInContext", {
                get: function () {
                    return this._ExistInContext;
                },
                set: function (value) {
                    this._ExistInContext = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Subject.prototype, "items", {
                get: function () {
                    return this._Items;
                },
                enumerable: true,
                configurable: true
            });
            Subject.prototype.items_CollectionChanged = function (sender, e) {
                if (e.action == lt.NotifyLeadCollectionChangedAction.add) {
                    var item = e.newItems[0];
                    if (Ccow.Utils.isNullOrEmptyString(this._Name)) {
                        this._Name = item.subject;
                    }
                    else {
                        if (item.subject.toLowerCase() != this._Name.toLowerCase()) {
                            throw new Error("Item subject doesn't match subject definition");
                        }
                    }
                }
            };
            Subject.prototype.subject = function () {
                var _this = this;
                this._Items.collectionChanged.add(function (sender, e) { return _this.items_CollectionChanged(sender, e); });
            };
            Subject.prototype.toItemNameArray = function () {
                var names = new Array(this._Items.get_count());
                for (var i = 0; i < this._Items.get_count(); i++) {
                    names[i] = this._Items.item(i).toString();
                }
                return names;
            };
            Subject.prototype.toItemValueArray = function () {
                var values = new Array(this._Items.get_count());
                for (var i = 0; i < this._Items.get_count(); i++) {
                    var item = this._Items.item(i);
                    values[i] = item.value;
                }
                return values;
            };
            Subject.prototype.hasItem = function (itemName) {
                var item = new Ccow.ContextItem(itemName);
                for (var i in this._Items) {
                    if (item.equals(i))
                        return true;
                }
                return false;
            };
            Subject.prototype.getItem = function (itemName) {
                var item = new Ccow.ContextItem(itemName);
                for (var i = 0; i < this._Items.get_count(); i++) {
                    var itemNew = this._Items.item(i);
                    if (item.equals(itemNew))
                        return itemNew;
                }
                return null;
            };
            Subject.prototype.isEmpty = function () {
                for (var i = 0; i < this._Items.get_count(); i++) {
                    var item = this._Items.item(i);
                    if (!item.isEmpty())
                        return false;
                }
                return true;
            };
            return Subject;
        }());
        Ccow.Subject = Subject;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextItem = (function () {
            function ContextItem(item) {
                this._SubjectDescriptor = "";
                this._Subject = "";
                this._Role = "";
                this._NameDescriptor = "";
                this._Name = "";
                this._Suffix = "";
                this._Value = "";
                var parts;
                var index = -1;
                if (item == null)
                    throw new Error("item is Empty");
                index = item.indexOf("]");
                while (index != -1) {
                    var left = item.indexOf("[");
                    if (Ccow.Utils.isNullOrEmptyString(this._SubjectDescriptor))
                        this._SubjectDescriptor = item.substring(left, index - left + 1);
                    else
                        this._NameDescriptor = item.substring(left, index - left + 1);
                    item = Ccow.Utils.removeFromString(left, index - left + 1, item);
                    index = item.indexOf("]");
                }
                parts = item.split('.');
                if (parts.length > 0) {
                    this._Subject = parts[0];
                    if (parts.length > 1)
                        this._Role = parts[1];
                    if (parts.length > 2)
                        this._Name = parts[2];
                    if (parts.length > 3)
                        this._Suffix = parts[3];
                }
            }
            Object.defineProperty(ContextItem.prototype, "subjectDescriptor", {
                get: function () {
                    return this._SubjectDescriptor;
                },
                set: function (value) {
                    this._SubjectDescriptor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "subject", {
                get: function () {
                    return this._Subject;
                },
                set: function (value) {
                    this._Subject = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "role", {
                get: function () {
                    return this._Role;
                },
                set: function (value) {
                    this._Role = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "nameDescriptor", {
                get: function () {
                    return this._NameDescriptor;
                },
                set: function (value) {
                    this._NameDescriptor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "name", {
                get: function () {
                    return this._Name;
                },
                set: function (value) {
                    this._Name = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "suffix", {
                get: function () {
                    return this._Suffix;
                },
                set: function (value) {
                    this._Suffix = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextItem.prototype, "value", {
                get: function () {
                    return this._Value;
                },
                set: function (value) {
                    this._Value = value;
                },
                enumerable: true,
                configurable: true
            });
            /*override*/
            ContextItem.prototype.toString = function () {
                var sb = "";
                sb += (this._SubjectDescriptor);
                sb += (this._Subject);
                sb += (".");
                sb += (this._Role);
                sb += (".");
                sb += (this._NameDescriptor);
                sb += (this._Name);
                sb += (".");
                sb += (this._Suffix);
                if (sb[sb.length - 1] == '.')
                    Ccow.Utils.removeFromString(sb.length - 1, 1, sb);
                return sb.toString();
            };
            ContextItem.prototype.equals = function (obj) {
                if (obj == ContextItem) {
                    var item = obj;
                    return (item.name == this._Name && item.nameDescriptor == this._NameDescriptor && item.role == this._Role &&
                        item.subject == this._Subject && item.subjectDescriptor == this._SubjectDescriptor && item.suffix == this._Suffix);
                }
                return false;
            };
            ContextItem.prototype.isEmpty = function () {
                if (this._Value == null)
                    return true;
                if (this._Value == "string") {
                    if (this._Value.length == 0)
                        return true;
                }
                return false;
            };
            return ContextItem;
        }());
        Ccow.ContextItem = ContextItem;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var Constants = (function () {
            function Constants() {
            }
            Constants.webPassCodeNames = ["Technology", "PubKeyScheme", "PubKeySize", "HashAlgo"];
            Constants.webPassCodeValues = ["Web", "RSA", "512", "MD5"];
            return Constants;
        }());
        Ccow.Constants = Constants;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var CcowBase = (function () {
            function CcowBase(serviceLocator) {
                if (serviceLocator == null)
                    throw new Error("'serviceLocator' cannot be null");
                this._ccowService = serviceLocator;
            }
            CcowBase.prototype.send = function (data) {
                var serviceUrl = this._ccowService.send(data);
                var settings = {
                    url: serviceUrl,
                    'type': "GET",
                    crossDomain: true,
                };
                return settings;
            };
            return CcowBase;
        }());
        Ccow.CcowBase = CcowBase;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var SecureBinding = (function (_super) {
            __extends(SecureBinding, _super);
            function SecureBinding(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            SecureBinding.prototype.initializeBinding = function (bindeeCoupon, propertyNames, propertyValues) {
                var url = "interface=SecureBinding&method=InitializeBinding&bindeeCoupon={0}&propertyNames={1}&propertyValues={2}".format(bindeeCoupon, Ccow.Utils.arrayToString(propertyNames), Ccow.Utils.arrayToString(propertyValues));
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var binderPublicKey = Ccow.Utils.getStringValue(dictionary, "binderPublicKey");
                    var mac = Ccow.Utils.getStringValue(dictionary, "mac");
                    var data = new Ccow.BindingData(binderPublicKey, mac);
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            SecureBinding.prototype.finalizeBinding = function (bindeeCoupon, bindeePublicKey, mac) {
                var url = "interface=SecureBinding&method=FinalizeBinding&bindeeCoupon={0}&bindeePublicKey={1}&mac={2}".format(bindeeCoupon, bindeePublicKey, mac);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "privileges");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return SecureBinding;
        }(lt.Ccow.CcowBase));
        Ccow.SecureBinding = SecureBinding;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var SecureContextData = (function (_super) {
            __extends(SecureContextData, _super);
            function SecureContextData(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            SecureContextData.prototype.getItemNames = function (contextCoupon) {
                var url = "interface=SecureContextData&method=GetItemNames&contextCoupon={0}".format(contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "names");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            SecureContextData.prototype.setItemValues = function (participantCoupon, itemNames, itemValues, contextCoupon, appSignature) {
                var url = "interface=SecureContextData&method=SetItemValues&participantCoupon={0}&itemNames={1}&itemValues={2}&contextCoupon={3}&appSignature={4}".format(participantCoupon, Ccow.Utils.arrayToString(itemNames), Ccow.Utils.arrayToString(itemValues), contextCoupon, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            SecureContextData.prototype.getItemValues = function (participantCoupon, itemNames, onlyChanges, contextCoupon, appSignature) {
                var url = "interface=SecureContextData&method=GetItemValues&participantCoupon={0}&itemNames={1}&onlyChanges={2}&contextCoupon={3}&appSignature={4}".format(participantCoupon, Ccow.Utils.arrayToString(itemNames), onlyChanges, contextCoupon, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var itemValues = Ccow.Utils.getStringArrayValue(dictionary, "itemValues");
                    var managerSignature = Ccow.Utils.getStringValue(dictionary, "managerSignature");
                    var data = new Ccow.SecureItemValues(itemValues, managerSignature);
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return SecureContextData;
        }(lt.Ccow.CcowBase));
        Ccow.SecureContextData = SecureContextData;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ListenerRegistrar = (function (_super) {
            __extends(ListenerRegistrar, _super);
            function ListenerRegistrar(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ListenerRegistrar.prototype.register = function (url, participantCoupon) {
                var url = "interface=ListenerRegistrar&method=Register&url={0}&participantCoupon={1}".format(url, participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getNumberValue(dictionary, "contextCoupon");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ListenerRegistrar.prototype.unregister = function (url) {
                var urlSer = "interface=ListenerRegistrar&method=Unregister&url={0}".format(url);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, urlSer))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            return ListenerRegistrar;
        }(lt.Ccow.CcowBase));
        Ccow.ListenerRegistrar = ListenerRegistrar;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var InterfaceInformation = (function (_super) {
            __extends(InterfaceInformation, _super);
            function InterfaceInformation(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            InterfaceInformation.prototype.interrogate = function (interfaceName) {
                var url = "interface=InterfaceInformation&method=Interrogate&interfaceName={0}".format(interfaceName);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getBoolValue(dictionary, "implemented");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return InterfaceInformation;
        }(lt.Ccow.CcowBase));
        Ccow.InterfaceInformation = InterfaceInformation;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ImplementationInformation = (function (_super) {
            __extends(ImplementationInformation, _super);
            function ImplementationInformation(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            Object.defineProperty(ImplementationInformation.prototype, "componentName", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=ComponentName";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "componentName");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "revMajorNum", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=RevMajorNum";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "revMajorNum");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "revMinorNum", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=RevMinorNum";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "revMinorNum");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "partNumber", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=PartNumber";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "partNumber");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "manufacturer", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=Manufacturer";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "manufacturer");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "targetOS", {
                get: function () {
                    var url = "interface= ImplementationInformation & method=TargetOS";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "targetOS");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "targetOSRev", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=TargetOSRev";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "targetOSRev");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImplementationInformation.prototype, "whenInstalled", {
                get: function () {
                    var url = "interface=ImplementationInformation&method=WhenInstalled";
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = Ccow.Utils.getStringValue(dictionary, "whenInstalled");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                },
                enumerable: true,
                configurable: true
            });
            return ImplementationInformation;
        }(lt.Ccow.CcowBase));
        Ccow.ImplementationInformation = ImplementationInformation;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextManagementRegistryLocator = (function () {
            function ContextManagementRegistryLocator() {
                this._url = "http://localhost:2116/";
            }
            ContextManagementRegistryLocator.prototype.send = function (data) {
                return this.onSendData(this._url, data);
            };
            ContextManagementRegistryLocator.prototype.onSendData = function (url, data) {
                /* Do nothing */
                return "";
            };
            return ContextManagementRegistryLocator;
        }());
        Ccow.ContextManagementRegistryLocator = ContextManagementRegistryLocator;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextEventArgs = (function (_super) {
            __extends(ContextEventArgs, _super);
            function ContextEventArgs(contextCoupon) {
                _super.call(this);
                this._contextCoupon = contextCoupon;
            }
            Object.defineProperty(ContextEventArgs.prototype, "contextCoupon", {
                get: function () {
                    return this._contextCoupon;
                },
                enumerable: true,
                configurable: true
            });
            return ContextEventArgs;
        }(lt.LeadEventArgs));
        Ccow.ContextEventArgs = ContextEventArgs;
        var ContextErrorEventArgs = (function (_super) {
            __extends(ContextErrorEventArgs, _super);
            function ContextErrorEventArgs(error) {
                _super.call(this);
                this._exception = error;
            }
            Object.defineProperty(ContextErrorEventArgs.prototype, "error", {
                get: function () {
                    return this._exception;
                },
                enumerable: true,
                configurable: true
            });
            return ContextErrorEventArgs;
        }(lt.LeadEventArgs));
        Ccow.ContextErrorEventArgs = ContextErrorEventArgs;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.getBoolValue = function (dictionary, name) {
                return Boolean(dictionary[name]);
            };
            Utils.getNumberValue = function (dictionary, name) {
                return parseInt(dictionary[name]);
            };
            Utils.getStringValue = function (dictionary, name) {
                return dictionary[name];
            };
            Utils.getStringArrayValue = function (dictionary, name) {
                var data = this.getStringValue(dictionary, name);
                if (data == null || data.length < 1)
                    return [];
                return data.split('|');
            };
            Utils.arrayToString = function (data) {
                var ret = "";
                if (data.length < 1)
                    return ret;
                ret += data[0].toString();
                for (var i = 1; i < data.length; i++)
                    ret += "|" + data[i].toString();
                return ret;
            };
            Utils.stringToDictionary = function (str) {
                var dictionary = {};
                if (str.indexOf('\"') == 0)
                    str = str.substring(1);
                if (str.lastIndexOf('\"') == str.length)
                    str = this.removeFromString(str, -1);
                var retValues = str.split('&');
                for (var i = 0; i < retValues.length; i++) {
                    var equlaIndex = retValues[i].indexOf('=');
                    var valueIndex = equlaIndex + 1;
                    var parameterName = retValues[i].substring(0, equlaIndex);
                    var parameterValue = retValues[i].substring(valueIndex, retValues[i].length);
                    dictionary[parameterName] = parameterValue;
                }
                if (dictionary["exception"] != null) {
                    var exception = Utils.getStringValue(dictionary, "exception");
                    var exceptionMsg = Utils.getStringValue(dictionary, "exceptionMessage");
                    throw new Ccow.CcowException(exception, exceptionMsg);
                }
                return dictionary;
            };
            Utils.isNullOrEmptyString = function (str) {
                return (str == "" || str == null);
            };
            Utils.removeFromString = function (stringOrNumber, pos2, str) {
                if (stringOrNumber && typeof stringOrNumber == "number") {
                    return str.slice(0, stringOrNumber - 1) + str.slice(stringOrNumber, pos2); //Remove range of characters in string
                }
                else {
                    return stringOrNumber.slice(0, pos2); //Remove all characters after an index
                }
            };
            return Utils;
        }());
        Ccow.Utils = Utils;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        // class LocateContextManagementRegistryData
        var LocateData = (function () {
            function LocateData(componentUrl, componentParameters, site) {
                this._componentUrl = "";
                this._componentParameters = "";
                this._site = "";
                this._componentUrl = componentUrl;
                this._componentParameters = componentParameters;
                this._site = site;
            }
            Object.defineProperty(LocateData.prototype, "componentUrl", {
                get: function () {
                    return this._componentUrl;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocateData.prototype, "componentParameters", {
                get: function () {
                    return this._componentParameters;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocateData.prototype, "site", {
                get: function () {
                    return this._site;
                },
                enumerable: true,
                configurable: true
            });
            return LocateData;
        }());
        Ccow.LocateData = LocateData;
        // class AuthenticationRepositoryData
        var AuthenticationData = (function () {
            function AuthenticationData(userData, repositorySignature) {
                this._userData = "";
                this._repositorySignature = "";
                this._userData = userData;
                this._repositorySignature = repositorySignature;
            }
            Object.defineProperty(AuthenticationData.prototype, "userData", {
                get: function () {
                    return this._userData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AuthenticationData.prototype, "repositorySignature", {
                get: function () {
                    return this._repositorySignature;
                },
                enumerable: true,
                configurable: true
            });
            return AuthenticationData;
        }());
        Ccow.AuthenticationData = AuthenticationData;
        // class EndContextChangesData
        var ContextChangesData = (function () {
            function ContextChangesData(responses, noContinue) {
                this._noContinue = false;
                this._responses = [];
                this._responses = responses;
                this._noContinue = noContinue;
            }
            Object.defineProperty(ContextChangesData.prototype, "noContinue", {
                get: function () {
                    return this._noContinue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextChangesData.prototype, "responses", {
                get: function () {
                    return this._responses;
                },
                enumerable: true,
                configurable: true
            });
            return ContextChangesData;
        }());
        Ccow.ContextChangesData = ContextChangesData;
        // class PerformContextActionData
        var ContextActionData = (function () {
            function ContextActionData(actionCoupon, outputNames, outputValues, managerSignature) {
                this._actionCoupon = 0;
                this._outputNames = [];
                this._outputValues = [];
                this._managerSignature = "";
                this._actionCoupon = actionCoupon;
                this._outputNames = outputNames;
                this._outputValues = outputValues;
                this._managerSignature = managerSignature;
            }
            Object.defineProperty(ContextActionData.prototype, "actionCoupon", {
                get: function () {
                    return this._actionCoupon;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextActionData.prototype, "outputNames", {
                get: function () {
                    return this._outputNames;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextActionData.prototype, "outputValues", {
                get: function () {
                    return this._outputValues;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ContextActionData.prototype, "managerSignature", {
                get: function () {
                    return this._managerSignature;
                },
                enumerable: true,
                configurable: true
            });
            return ContextActionData;
        }());
        Ccow.ContextActionData = ContextActionData;
        // class InitializeBindingData
        var BindingData = (function () {
            function BindingData(binderPublicKey, mac) {
                this._binderPublicKey = "";
                this._mac = "";
                this._binderPublicKey = binderPublicKey;
                this._mac = mac;
            }
            Object.defineProperty(BindingData.prototype, "binderPublicKey", {
                get: function () {
                    return this._binderPublicKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BindingData.prototype, "mac", {
                get: function () {
                    return this._mac;
                },
                enumerable: true,
                configurable: true
            });
            return BindingData;
        }());
        Ccow.BindingData = BindingData;
        // class SecureContextDataItemValues
        var SecureItemValues = (function () {
            function SecureItemValues(itemValues, managerSignature) {
                this._itemValues = [];
                this._managerSignature = "";
                this._itemValues = itemValues;
                this._managerSignature = managerSignature;
            }
            Object.defineProperty(SecureItemValues.prototype, "itemValues", {
                get: function () {
                    return this._itemValues;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SecureItemValues.prototype, "managerSignature", {
                get: function () {
                    return this._managerSignature;
                },
                enumerable: true,
                configurable: true
            });
            return SecureItemValues;
        }());
        Ccow.SecureItemValues = SecureItemValues;
        var WebSocketInfo = (function () {
            function WebSocketInfo(address, portNumber) {
                this._portNumer = 0;
                this._address = "";
                this._portNumer = portNumber;
                this._address = address;
            }
            Object.defineProperty(WebSocketInfo.prototype, "portNumber", {
                get: function () {
                    return this._portNumer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebSocketInfo.prototype, "address", {
                get: function () {
                    return this._address;
                },
                enumerable: true,
                configurable: true
            });
            return WebSocketInfo;
        }());
        Ccow.WebSocketInfo = WebSocketInfo;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextSession = (function (_super) {
            __extends(ContextSession, _super);
            function ContextSession(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ContextSession.prototype.create = function () {
                var url = "interface=ContextSession&method=Create";
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringValue(dictionary, "newContextManager");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextSession.prototype.activate = function (participantCoupon, cmToActivate, nonce, appSignature) {
                var url = "interface=ContextSession&method=Activate&participantCoupon={0}&cmToActivate={1}&nonce={2}&AppSignature={3}".format(participantCoupon, cmToActivate, nonce, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            return ContextSession;
        }(lt.Ccow.CcowBase));
        Ccow.ContextSession = ContextSession;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextManager = (function (_super) {
            __extends(ContextManager, _super);
            function ContextManager(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ContextManager.prototype.getMostRecentContextCoupon = function () {
                var url = "interface=ContextManager&method=GetMostRecentContextCoupon";
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getNumberValue(dictionary, "contextCoupon");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextManager.prototype.joinCommonContext = function (applicationName, contextParticipant, survey, wait) {
                var url = "interface=ContextManager&method=JoinCommonContext&applicationName={0}&contextParticipant={1}&survey={2}&wait={3}".format(applicationName, contextParticipant, survey, wait);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getNumberValue(dictionary, "participantCoupon");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextManager.prototype.leaveCommonContext = function (participantCoupon) {
                var url = "interface=ContextManager&method=LeaveCommonContext&participantCoupon={0}".format(participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            ContextManager.prototype.startContextChanges = function (participantCoupon) {
                var url = "interface=ContextManager&method=StartContextChanges&participantCoupon={0}".format(participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getNumberValue(dictionary, "contextCoupon");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextManager.prototype.endContextChanges = function (contextCoupon) {
                var url = "interface=ContextManager&method=EndContextChanges&contextCoupon={0}".format(contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var noContinue = Ccow.Utils.getBoolValue(dictionary, "noContinue");
                    var responses = Ccow.Utils.getStringArrayValue(dictionary, "responses");
                    var data = new Ccow.ContextChangesData(responses, noContinue);
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextManager.prototype.undoContextChanges = function (contextCoupon) {
                var url = "interface=ContextManager&method=UndoContextChanges&contextCoupon={0}".format(contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            ContextManager.prototype.publishChangesDecision = function (contextCoupon, decision) {
                var url = "interface=ContextManager&method=PublishChangesDecision&contextCoupon={0}&decision={1}".format(contextCoupon, decision);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "listenerURLs");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextManager.prototype.suspendParticipation = function (participantCoupon) {
                var url = "interface=ContextManager&method=SuspendParticipation&participantCoupon={0}".format(participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            ContextManager.prototype.resumeParticipation = function (participantCoupon, wait) {
                var url = "interface=ContextManager&method=ResumeParticipation&participantCoupon={0}&wait={1}".format(participantCoupon, wait);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            return ContextManager;
        }(lt.Ccow.CcowBase));
        Ccow.ContextManager = ContextManager;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextManagementRegistry = (function (_super) {
            __extends(ContextManagementRegistry, _super);
            function ContextManagementRegistry(locator) {
                _super.call(this, locator);
            }
            ContextManagementRegistry.prototype.locate = function (componentName, version, descriptiveData, contextParticipant) {
                try {
                    var url = "interface=ContextManagementRegistry&method=Locate&componentName={0}&version={1}&descriptiveData={2}&contextParticipant={3}".format(componentName, version, descriptiveData, contextParticipant);
                    var d = $.Deferred();
                    $.ajax(_super.prototype.send.call(this, url))
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR, textStatus, errorThrown);
                    })
                        .done(function (result) {
                        var dictionary = Ccow.Utils.stringToDictionary(result);
                        var data = null;
                        if (dictionary["componentUrl"] != null) {
                            var componentUrl = Ccow.Utils.getStringValue(dictionary, "componentUrl");
                            var componentParameters = Ccow.Utils.getStringValue(dictionary, "componentParameters");
                            var site = Ccow.Utils.getStringValue(dictionary, "site");
                            data = new Ccow.LocateData(componentUrl, componentParameters, site);
                        }
                        else
                            throw new Error("The context management registry could not locate the specified component instance");
                        d.resolve((result === 'undefined') ? null : data);
                    });
                    return d.promise();
                }
                catch (Error) {
                    throw new Ccow.CcowException("UnableToLocate", Error.message);
                }
            };
            return ContextManagementRegistry;
        }(lt.Ccow.CcowBase));
        Ccow.ContextManagementRegistry = ContextManagementRegistry;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextFilter = (function (_super) {
            __extends(ContextFilter, _super);
            function ContextFilter(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ContextFilter.prototype.setSubjectsOfInterest = function (participantCoupon, subjectNames) {
                var url = "interface=ContextFilter&method=SetSubjectsOfInterest&participantCoupon={0}&subjectNames={1}".format(participantCoupon, Ccow.Utils.arrayToString(subjectNames));
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "names");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextFilter.prototype.getSubjectsOfInterest = function (participantCoupon) {
                var url = "interface=ContextFilter&method=GetSubjectsOfInterest&participantCoupon={0}".format(participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "subjectNames");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextFilter.prototype.clearFilter = function (participantCoupon) {
                var url = "interface=ContextFilter&method=ClearFilter&participantCoupon={0}".format(participantCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            return ContextFilter;
        }(lt.Ccow.CcowBase));
        Ccow.ContextFilter = ContextFilter;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextData = (function (_super) {
            __extends(ContextData, _super);
            function ContextData(serviceLocator) {
                _super.call(this, serviceLocator);
                this._serviceUserData = null;
            }
            Object.defineProperty(ContextData.prototype, "serviceUserData", {
                get: function () {
                    return this._serviceUserData;
                },
                set: function (value) {
                    this._serviceUserData = value;
                },
                enumerable: true,
                configurable: true
            });
            ContextData.prototype.getItemNames = function (contextCoupon) {
                var url = "interface=ContextData&method=GetItemNames&contextCoupon={0}".format(contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "names");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ContextData.prototype.setItemValues = function (participantCoupon, itemNames, itemValues, contextCoupon) {
                var url = "interface=ContextData&method=SetItemValues&participantCoupon={0}&itemNames={1}&itemValues={2}&contextCoupon={3}".format(participantCoupon, Ccow.Utils.arrayToString(itemNames), Ccow.Utils.arrayToString(itemValues), contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            ContextData.prototype.getItemValues = function (itemNames, onlyChanges, contextCoupon) {
                var url = "interface=ContextData&method=GetItemValues&itemNames={0}&onlyChanges={1}&contextCoupon={2}".format(Ccow.Utils.arrayToString(itemNames), onlyChanges, contextCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringArrayValue(dictionary, "itemValues");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return ContextData;
        }(lt.Ccow.CcowBase));
        Ccow.ContextData = ContextData;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ContextAction = (function (_super) {
            __extends(ContextAction, _super);
            function ContextAction(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ContextAction.prototype.perform = function (cpCallBackURL, cpErrorURL, participantCoupon, inputNames, inputValues, appSignature) {
                var url = "interface=ContextAction&method=Perform&cpCallBackURL={0}&cpErrorURL={1}&partcipantCoupon={2}&inputNames={3}&inputValues={4}&appSignature={5}".format(cpCallBackURL, cpErrorURL, participantCoupon, Ccow.Utils.arrayToString(inputNames), Ccow.Utils.arrayToString(inputValues), appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var actionCoupon = Ccow.Utils.getNumberValue(dictionary, "actionCoupon");
                    var outputNames = Ccow.Utils.getStringArrayValue(dictionary, "outputNames");
                    var outputValues = Ccow.Utils.getStringArrayValue(dictionary, "outputValues");
                    var managerSignature = Ccow.Utils.getStringValue(dictionary, "managerSignature");
                    var data = new Ccow.ContextActionData(actionCoupon, outputNames, outputValues, managerSignature);
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return ContextAction;
        }(lt.Ccow.CcowBase));
        Ccow.ContextAction = ContextAction;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ClientUtils = (function (_super) {
            __extends(ClientUtils, _super);
            function ClientUtils(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            ClientUtils.prototype.getEncodedHashKey = function (hashString) {
                var url = "interface=Utils&method=GetEncodedHashKey&hashString={0}".format(hashString);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringValue(dictionary, "key");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ClientUtils.prototype.getEncodedPublicKey = function (applicationName) {
                var url = "interface=KeyContainer&method=GetEncodedPublicKey&applicationName={0}".format(applicationName);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringValue(dictionary, "key");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ClientUtils.prototype.getEncodedSignKey = function (applicationName, messageDigest) {
                var url = "interface=KeyContainer&method=GetEncodedSignKey&applicationName={0}&messageDigest={1}".format(applicationName, messageDigest);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getStringValue(dictionary, "key");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ClientUtils.prototype.getWebSocketInfo = function () {
                var url = "interface=WebSocket&method=GetInfo";
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = new Ccow.WebSocketInfo(Ccow.Utils.getStringValue(dictionary, "address"), Ccow.Utils.getNumberValue(dictionary, "portNumber"));
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            ClientUtils.prototype.ping = function () {
                var url = "interface=Utils&method=Ping";
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var data;
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    if (dictionary["Status"] != null)
                        data = Ccow.Utils.getStringValue(dictionary, "Status").localeCompare("Success") == 0;
                    else
                        data = false;
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return ClientUtils;
        }(lt.Ccow.CcowBase));
        Ccow.ClientUtils = ClientUtils;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var ClientContext = (function (_super) {
            __extends(ClientContext, _super);
            function ClientContext(serviceLocator, id) {
                var _this = this;
                _super.call(this, serviceLocator);
                this._clientUtils = new Ccow.ClientUtils(serviceLocator);
                this._id = id;
                var info;
                var getWebSocketInfoPromise = this._clientUtils.getWebSocketInfo();
                getWebSocketInfoPromise.done(function (result) {
                    info = result;
                    _this._webSocket = new WebSocket("ws://{0}:{1}/".replace('{0}', info.address).replace('{1}', info.portNumber.toString()));
                    var webSocketOpen = function () {
                        _this._webSocket.send("id=" + _this._id);
                    };
                    var webSocketError = function (err) {
                        _this.onError(new Error("WebSocket general error."));
                    };
                    var webSocketMessage = function (msg) {
                        _this.onMessage(msg.data);
                    };
                    _this._webSocket.onopen = webSocketOpen;
                    _this._webSocket.onmessage = webSocketMessage;
                });
                getWebSocketInfoPromise.fail(function (jqXHR, statusText, errorThrown) {
                });
            }
            ClientContext.prototype.dispose = function () {
                this._webSocket.close();
            };
            ClientContext.prototype.onError = function (e) {
                if (this.error != null)
                    this.error(this, new Ccow.ContextErrorEventArgs(e));
            };
            ClientContext.prototype.onMessage = function (message) {
                var dictionary = Ccow.Utils.stringToDictionary(message);
                var methodName = Ccow.Utils.getStringValue(dictionary, "method");
                if (!Ccow.Utils.isNullOrEmptyString(methodName)) {
                    var contextCoupon = -1000;
                    if (dictionary["contextCoupon"] != null)
                        contextCoupon = Ccow.Utils.getNumberValue(dictionary, "contextCoupon");
                    if (this.contextChangesPending != null && methodName.localeCompare("ContextChangesPending") == 0) {
                        this.contextChangesPending(this, new Ccow.ContextEventArgs(contextCoupon));
                    }
                    else if (this.contextChangesAccepted != null && methodName.localeCompare("ContextChangesAccepted") == 0) {
                        this.contextChangesAccepted(this, new Ccow.ContextEventArgs(contextCoupon));
                    }
                    else if (this.contextChangesCanceled != null && methodName.localeCompare("ContextChangesCanceled") == 0) {
                        this.contextChangesCanceled(this, new Ccow.ContextEventArgs(contextCoupon));
                    }
                    else if (this.commonContextTerminated != null && methodName.localeCompare("CommonContextTerminated") == 0) {
                        this.commonContextTerminated(this, lt.LeadEventArgs.empty);
                    }
                    else if (this.ping != null && methodName.localeCompare("Ping") == 0) {
                        this.ping(this, lt.LeadEventArgs.empty);
                    }
                }
            };
            return ClientContext;
        }(lt.Ccow.CcowBase));
        Ccow.ClientContext = ClientContext;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./CcowBase.ts" />
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var AuthenticationRepository = (function (_super) {
            __extends(AuthenticationRepository, _super);
            function AuthenticationRepository(serviceLocator) {
                _super.call(this, serviceLocator);
            }
            AuthenticationRepository.prototype.connect = function (applicationName) {
                var url = "interface=AuthenticationRepository&method=Connect&applicationName={0}".format(applicationName);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var data = Ccow.Utils.getNumberValue(dictionary, "bindingCoupon");
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            AuthenticationRepository.prototype.disconnect = function (bindingCoupon) {
                var url = "interface=AuthenticationRepository&method=Disconnect&bindingCoupon={0}".format(bindingCoupon);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            AuthenticationRepository.prototype.setAuthenticationData = function (coupon, logonName, dataFormat, userData, appSignature) {
                var url = "interface=AuthenticationRepository&method=SetAuthenticationData&coupon={0}&logonName={1}&dataFormat={2}&userData={3}&appSignature={4}".format(coupon, logonName, dataFormat, userData, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            AuthenticationRepository.prototype.deleteAuthenticationData = function (coupon, logonName, dataFormat, appSignature) {
                var url = "interface=AuthenticationRepository&method=DeleteAuthenticationData&coupon={0}&logonName={1}&dataFormat={2}&appSignature={3}".format(coupon, logonName, dataFormat, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    d.resolve((result === 'undefined') ? null : result);
                });
                return d.promise();
            };
            AuthenticationRepository.prototype.getAuthenticationData = function (coupon, logonName, dataFormat, appSignature) {
                var url = "interface=AuthenticationRepository&method=GetAuthenticationData&coupon={0}&logonName={1}&dataFormat={2}&appSignature={3}".format(coupon, logonName, dataFormat, appSignature);
                var d = $.Deferred();
                $.ajax(_super.prototype.send.call(this, url))
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    d.reject(jqXHR, textStatus, errorThrown);
                })
                    .done(function (result) {
                    var dictionary = Ccow.Utils.stringToDictionary(result);
                    var repositorySignature = Ccow.Utils.getStringValue(dictionary, "repositorySignature");
                    var userData = Ccow.Utils.getStringValue(dictionary, "userData");
                    var data = new Ccow.AuthenticationData(userData, repositorySignature);
                    d.resolve((result === 'undefined') ? null : data);
                });
                return d.promise();
            };
            return AuthenticationRepository;
        }(lt.Ccow.CcowBase));
        Ccow.AuthenticationRepository = AuthenticationRepository;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
var lt;
(function (lt) {
    var Ccow;
    (function (Ccow) {
        var CcowException = (function () {
            function CcowException(exception, exceptionMessage) {
                throw new Error(exception + "\nException Message: " + exceptionMessage);
            }
            return CcowException;
        }());
        Ccow.CcowException = CcowException;
    })(Ccow = lt.Ccow || (lt.Ccow = {}));
})(lt || (lt = {}));
/// <reference path="./../../../../../Bin/JS/ThirdParty/jquery/jquery.d.ts" />
/// <reference path="./../../../../../Bin/JS/Leadtools.d.ts" />
//# sourceMappingURL=Leadtools.Ccow.js.map