// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
var HTML5Demos;
(function (HTML5Demos) {
    var Dialogs;
    (function (Dialogs) {
        var DocumentRedactionOptionsDlg = /** @class */ (function () {
            function DocumentRedactionOptionsDlg() {
                var _this = this;
                this.inner = null;
                this.el = null;
                this.onApply = function () {
                    _this.redactionOptions.viewOptions.mode = $(_this.el.viewOptions.redactionModeSelect).prop("selectedIndex");
                    _this.redactionOptions.viewOptions.replaceCharacter = _this.getReplaceCharacter(_this.el.viewOptions.replaceCharacterInput);
                    _this.redactionOptions.convertOptions.mode = $(_this.el.convertOptions.redactionModeSelect).prop("selectedIndex");
                    _this.redactionOptions.convertOptions.replaceCharacter = _this.getReplaceCharacter(_this.el.convertOptions.replaceCharacterInput);
                    _this.onHide();
                    _this.onApplyOptions();
                };
                this.onHide = function () {
                    _this.inner.hide();
                };
                var root = $("#dlgRedactionOptions");
                this.el = {
                    viewOptions: {
                        redactionModeSelect: "#dlgViewRedaction_Mode",
                        replaceCharacterInput: "#dlgViewRedaction_ReplaceCharacter"
                    },
                    convertOptions: {
                        redactionModeSelect: "#dlgConvertRedaction_Mode",
                        replaceCharacterInput: "#dlgConvertRedaction_ReplaceCharacter"
                    },
                    applyButton: "#dlgRedactionOptions_Apply",
                    hideButton: "#dlgRedactionOptions .dlg-close"
                };
                $(this.el.viewOptions.redactionModeSelect).on("change", function (e) {
                    var selectedIndex = parseInt($(e.currentTarget).val());
                    $(_this.el.viewOptions.replaceCharacterInput).prop("disabled", (selectedIndex) == lt.Document.DocumentRedactionMode.none);
                });
                $(this.el.convertOptions.redactionModeSelect).on("change", function (e) {
                    var selectedIndex = parseInt($(e.currentTarget).val());
                    $(_this.el.convertOptions.replaceCharacterInput).prop("disabled", (selectedIndex) == lt.Document.DocumentRedactionMode.none);
                });
                this.inner = new lt.Demos.Dialogs.InnerDialog(root);
                this.inner.onRootClick = this.onHide;
                $(this.el.hideButton).on("click", this.onHide);
                $(this.el.applyButton).on("click", this.onApply);
            }
            DocumentRedactionOptionsDlg.prototype.dispose = function () {
                $(this.el.applyButton).off("click", this.onApply);
                this.onHide = null;
                this.inner.onRootClick = null;
                this.inner.dispose();
                this.inner = null;
                this.el = null;
            };
            DocumentRedactionOptionsDlg.prototype.getReplaceCharacter = function (input) {
                var replaceCharacter = $(input).val();
                return replaceCharacter && replaceCharacter.length > 0 ? replaceCharacter : '\0';
            };
            DocumentRedactionOptionsDlg.prototype.show = function (options) {
                this.redactionOptions = options;
                $(this.el.viewOptions.redactionModeSelect).prop("selectedIndex", (options.viewOptions.mode));
                $(this.el.viewOptions.replaceCharacterInput).val(options.viewOptions.replaceCharacter == '\0' ? '' : options.viewOptions.replaceCharacter);
                $(this.el.viewOptions.replaceCharacterInput).prop("disabled", options.viewOptions.mode == lt.Document.DocumentRedactionMode.none);
                $(this.el.convertOptions.redactionModeSelect).prop("selectedIndex", (options.convertOptions.mode));
                $(this.el.convertOptions.replaceCharacterInput).val(options.convertOptions.replaceCharacter == '\0' ? '' : options.convertOptions.replaceCharacter);
                $(this.el.convertOptions.replaceCharacterInput).prop("disabled", options.convertOptions.mode == lt.Document.DocumentRedactionMode.none);
                this.inner.show();
            };
            DocumentRedactionOptionsDlg.prototype.onApplyOptions = function () {
            };
            return DocumentRedactionOptionsDlg;
        }());
        Dialogs.DocumentRedactionOptionsDlg = DocumentRedactionOptionsDlg;
    })(Dialogs = HTML5Demos.Dialogs || (HTML5Demos.Dialogs = {}));
})(HTML5Demos || (HTML5Demos = {}));
