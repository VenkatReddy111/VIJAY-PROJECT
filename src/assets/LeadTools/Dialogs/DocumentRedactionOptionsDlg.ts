// *************************************************************
// Copyright (c) 1991-2019 LEAD Technologies, Inc.
// All Rights Reserved.
// *************************************************************
module HTML5Demos {
   export module Dialogs {

      interface DocumentRedactionOptionsDlgUI<T> {
         viewOptions: {
            redactionModeSelect: T,
            replaceCharacterInput: T
         },
         convertOptions: {
            redactionModeSelect: T,
            replaceCharacterInput: T
         },
         applyButton: T,
         hideButton: T
      }

      export class DocumentRedactionOptionsDlg implements lt.Demos.Dialogs.Dialog {

         public inner: lt.Demos.Dialogs.InnerDialog = null;
         private el: DocumentRedactionOptionsDlgUI<string> = null;

         public redactionOptions: lt.Document.DocumentRedactionOptions;

         constructor() {
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


             $(this.el.viewOptions.redactionModeSelect).on("change", (e: JQueryEventObject) => {
                var selectedIndex: number = parseInt($(e.currentTarget).val());
                $(this.el.viewOptions.replaceCharacterInput).prop("disabled", <lt.Document.DocumentRedactionMode>(selectedIndex) == lt.Document.DocumentRedactionMode.none);
             });
             $(this.el.convertOptions.redactionModeSelect).on("change", (e: JQueryEventObject) => {
                var selectedIndex: number = parseInt($(e.currentTarget).val());
                $(this.el.convertOptions.replaceCharacterInput).prop("disabled", <lt.Document.DocumentRedactionMode>(selectedIndex) == lt.Document.DocumentRedactionMode.none);
             });

            this.inner = new lt.Demos.Dialogs.InnerDialog(root);

            this.inner.onRootClick = this.onHide;
            $(this.el.hideButton).on("click", this.onHide);
            $(this.el.applyButton).on("click", this.onApply);
         }

         private onApply = () => {
            this.redactionOptions.viewOptions.mode = <lt.Document.DocumentRedactionMode>$(this.el.viewOptions.redactionModeSelect).prop("selectedIndex");
            this.redactionOptions.viewOptions.replaceCharacter = this.getReplaceCharacter(this.el.viewOptions.replaceCharacterInput);
            this.redactionOptions.convertOptions.mode = <lt.Document.DocumentRedactionMode>$(this.el.convertOptions.redactionModeSelect).prop("selectedIndex");
            this.redactionOptions.convertOptions.replaceCharacter = this.getReplaceCharacter(this.el.convertOptions.replaceCharacterInput);

            this.onHide();
            this.onApplyOptions();
         }

         private onHide = () => {
            this.inner.hide();
         }

         public dispose(): void {
            $(this.el.applyButton).off("click", this.onApply);
            this.onHide = null;

            this.inner.onRootClick = null;
            this.inner.dispose();
            this.inner = null;
            this.el = null;
         }

         private getReplaceCharacter(input: string): string {
            var replaceCharacter: string = $(input).val();
            return replaceCharacter && replaceCharacter.length > 0 ? replaceCharacter : '\0';
         }

         public show(options: lt.Document.DocumentRedactionOptions): void {
            this.redactionOptions = options;

            $(this.el.viewOptions.redactionModeSelect).prop("selectedIndex", <number>(options.viewOptions.mode));
            $(this.el.viewOptions.replaceCharacterInput).val(options.viewOptions.replaceCharacter == '\0' ? '' : options.viewOptions.replaceCharacter);
            $(this.el.viewOptions.replaceCharacterInput).prop("disabled", options.viewOptions.mode == lt.Document.DocumentRedactionMode.none);
            $(this.el.convertOptions.redactionModeSelect).prop("selectedIndex", <number>(options.convertOptions.mode));
            $(this.el.convertOptions.replaceCharacterInput).val(options.convertOptions.replaceCharacter == '\0' ? '' : options.convertOptions.replaceCharacter);
            $(this.el.convertOptions.replaceCharacterInput).prop("disabled", options.convertOptions.mode == lt.Document.DocumentRedactionMode.none);

            this.inner.show();
         }

         public onApplyOptions(): void {
         }
      }
   }
}