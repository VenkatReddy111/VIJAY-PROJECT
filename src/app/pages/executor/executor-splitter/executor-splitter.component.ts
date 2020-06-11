import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { SplitterMerger, Batches } from 'src/app/models/splitter-merger.model';
import { ActivatedRoute } from '@angular/router';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';
import { MessageService } from 'src/app/message.service';
import { environment } from 'src/environments/environment';
import notify from 'devextreme/ui/notify';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
// added by ashwini on 6-Jan-2020 -- start
export enum KEY_CODE {
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    O = 79,
    space = 32,
    M = 77,
    R = 82,
    A = 65,
    S = 83,
    F = 70,
    D = 68,
    Q = 81,
    W = 87,
    E = 69,
    L = 76,
    I = 73,
    T = 84,
    C = 67,
    V = 86,
    HOME_KEY = 36,
    END_KEY = 35,
    LEFT_ARROW = 37,
    RIGHT_ARROW = 39,
    P = 80,
}

// added by ashwini on 6-Jan-2020 -- end
@Component({
    selector: 'app-executor-splitter',
    templateUrl: './executor-splitter.component.html',
    styleUrls: ['./executor-splitter.component.scss']
})
export class ExecutorSplitterComponent extends ComponentbaseComponent implements OnInit, OnDestroy {
    // added by ashwini on 6-Jan-2020 -- start
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        // Ctrl+Alt+D > Discard Button
        if (event.ctrlKey && event.altKey && (event.keyCode == KEY_CODE.D)) {
            this.OnClick_Discard();
            // alert('Discard Button')
        }
        // Alt+S > Save/Merge Button
        if (event.altKey && (event.keyCode == KEY_CODE.S)) {
            this.OnClick_Merge();
            // alert('Save Button')
        }
        // Alt+A > Select All Checkbox
        // if (event.altKey && (event.keyCode ==  KEY_CODE.A)) {
        //   this.OnClick_Merge();
        //   alert('Save Button')
        // }
    }
    // added by ashwini on 6-Jan-2020 -- end
    // tslint:disable-next-line:member-ordering
    isAlive = true;
    fileList = [];
    // tslint:disable-next-line:member-ordering
    selectedFileListSpliter = [];
    ForwordButton : boolean;
    mergeButton = 'Merge';
    mergeButtonFlag : boolean;
    discardButtonFlag : boolean;
    documentDetails = [];
    message = false;
    messageOperation = 'merged';
    fileName: string;
    totalSplittedPages: number;
    numberOfDocCreated: number;
    totalPendingSplitFiles: number;
    showSelectedFlag: boolean;
    noDocMsgFlag: boolean;
    noDocMsg: string;
    IsDiscardBtnVisible: boolean;
    IsSaveBtnVisible: boolean;
    IsCheckAll : boolean;
    IsCheckAllBtnVisible : boolean;
    CheckedCount : number;
    disableFlage : boolean;
    selectedFileSequenceList =  [];

    // tslint:disable-next-line:max-line-length
    constructor(private elementRef: ElementRef, private renderer: Renderer2, private route: ActivatedRoute, private service: DataService, message: MessageService) {
        super('Splitter Merger', 'SplitterMerge', message, service, environment.apiBaseUrl);
       // this.GetNextDocument();
        this.ResetVaribales();
    }

    ngOnInit() {
        this.GetNextDocument();
        this.doMonitoring();
    }
    ngOnDestroy() {
       this.isAlive = false;
      }


    doMonitoring() {
        setTimeout(() => {
            console.log('checking');
            console.log(this.isAlive);
            if (this.fileList.length === 0 && (this.isAlive)) {
            console.log('File list count is 0');
            this.ResetVaribales();
            this.GetNextDocument();
         }
         // better to have one if here for exiting loop!
            this.doMonitoring();
        }, 120000);
       }

    ResetVaribales() {
        this.numberOfDocCreated = 0;
        this.showSelectedFlag = false;
        this.ForwordButton = false;
        this.noDocMsgFlag = true;
        this.IsDiscardBtnVisible = true;
        this.IsSaveBtnVisible = true;
        this.mergeButtonFlag = false;
        this.discardButtonFlag = false;
        this.IsCheckAll = false;
        this.IsCheckAllBtnVisible = true;
        this.IsCheckAll = false;
        this.fileName = '--';
        this.numberOfDocCreated = 0;
        this.totalSplittedPages = 0;
        this.totalPendingSplitFiles = 0;
    }

    GetNextDocument() {
        this.noDocMsgFlag = true;
        this.noDocMsg = 'Fetching Document...';
        // tslint:disable-next-line:no-debugger
        const post$ = this.service.getAll('SplitterMergerApi/GetNextDocument');
        post$.subscribe(
            $data => {
                this.fileList = this.BindDataWithSpliterMergerModel$($data);
                this.BindDocumentDetails(this.fileList);
                this.SortFileList();
            }
        );
    }


    BindDataWithSpliterMergerModel$($data) {
        const fileList$ = $data.map((item: any) => {
            return new SplitterMerger(
                item.documentHeaderID,
                item.inputSourceHeaderId,
                item.dourceFileExtension,
                item.fileName,
                item.filePath,
                item.batchRootPath,
                item.inputSourceFileId,
                '0',
                item.currentStatusId,
                item.inputSourceSplitFileId,
                item.objBatchModel,
                false
            );
        });
        return fileList$;
    }

    BindDocumentDetails(fileList) {
        if (fileList.length <= 0) {
            this.disableFlage = true;
            this.noDocMsgFlag = true;
            this.IsDiscardBtnVisible = false;
            this.IsSaveBtnVisible = false;
            this.noDocMsg = 'No documents for processing.';
            notify('No documents for processing.');
            this.fileName = '--';
            this.numberOfDocCreated = 0;
            this.totalSplittedPages = 0;
            this.totalPendingSplitFiles = 0;
            return;
        } else {
            this.disableFlage = false;
            this.fileName = fileList[0].objDocumentDetail.fileName;
            this.numberOfDocCreated = fileList[0].objDocumentDetail.noOfDocCreated;
            this.totalSplittedPages = fileList[0].objDocumentDetail.totalSplittedPages;
            this.totalPendingSplitFiles = this.fileList.length;
            this.noDocMsgFlag = false;
            this.noDocMsg = '';
        }
    }

    // OnClick_Merge(e) { // code commented by ashwini
    OnClick_Merge() {
        // tslint:disable-next-line:no-debugger
        debugger;
       // const SelectedFile = this.fileList.filter( X => X.isChecked === true);
        this.selectedFileListSpliter = [];
        this.selectedFileListSpliter = this.selectedFileSequenceList;
        this.selectedFileSequenceList = [];
        if (this.selectedFileListSpliter.length > 0) {
            this.mergeButton = 'Merging..';
            this.mergeButtonFlag = true;
            this.MergeSplitedFile(this.selectedFileListSpliter);

        } else {
            notify('Please select the file.');
        }

    }



    public MergeSplitedFile($DataToPost = []) {
        // get the all select document stored in this.selectedFileListSplitter
        const that = this;
        const attribute = this.DataToPostSplitterMerger($DataToPost, 0);
        const post$ = this.service.postAll('SplitterMergerApi/MergeSplittedFile', attribute);
        post$.subscribe(
            data => {
                if (data === true) {
                    that.mergeButton = 'Merge';
                    this.mergeButtonFlag = false;
                    that.messageOperation = 'merged';
                    if (this.selectedFileListSpliter.length === this.fileList.length ) {
                        notify( 'All Pages merged successfully.');
                    } else if (this.selectedFileListSpliter.length === 1) {
                        notify( this.selectedFileListSpliter.length + ' Page merged successfully.');
                    } else {
                        notify( this.selectedFileListSpliter.length + ' Pages merged successfully.');
                    }

                    this.numberOfDocCreated = this.numberOfDocCreated + 1;
                    that.selectedFileListSpliter.forEach(element => {
                        // tslint:disable-next-line:max-line-length
                        const index = that.fileList.map(function (x) { return x.FileName; }).indexOf(element.FileName); // find index in your array
                        that.fileList.splice(index, 1); // remove element from array
                    });
                    this.CheckFileListIsEmpty();
                    this.ShowSuccessMessage();
                } else {
                    that.mergeButton = 'Merge';
                    this.mergeButtonFlag = false;
                    notify( 'Something went wrong please try again.');
                }
            }, err => {
               // console.log('log save' + err.error);
            }
        );
    }

    // OnClick_Discard(e) { // code commented by ashwini
    OnClick_Discard() {
        const SelectedFile = this.fileList.filter( X => X.isChecked === true);
        this.selectedFileListSpliter = [];
        this.selectedFileListSpliter = SelectedFile;
        if (this.selectedFileListSpliter.length > 0) {
            this.DiscardFile(this.selectedFileListSpliter);

        } else {
            notify('Please select the file.');
        }
    }

    public DiscardFile($DataToPost = []) {
        // get the all select document stored in this.selectedFileListSplitter
        this.discardButtonFlag = true;
        const that = this;
        const attribute = this.DataToPostSplitterMerger($DataToPost, 0);
        const post$ = this.service.postAll('SplitterMergerApi/DiscardFiles', attribute);
        post$.subscribe(
            data => {
                if (data === true) {
                    this.messageOperation = 'discard';
                    if (this.selectedFileListSpliter.length === this.fileList.length) {
                        notify( 'All Pages discarded successfully.');
                    } else if ( this.selectedFileListSpliter.length === 1) {
                        notify(this.selectedFileListSpliter.length + ' Page discarded successfully.');
                    }  else {
                        notify( this.selectedFileListSpliter.length + ' Pages discarded successfully.');
                    }
                    that.selectedFileListSpliter.forEach(element => {
                        // tslint:disable-next-line:max-line-length
                        const index = that.fileList.map(function (x) { return x.FileName; }).indexOf(element.FileName); // find index in your array
                        that.fileList.splice(index, 1); // remove element from array
                    });
                    this.CheckFileListIsEmpty();
                    this.ShowSuccessMessage();
                } else {
                    notify( 'Something went wrong please try again.');
                }

            }, err => {
                // console.log('log discard:' + err.error);
            }
        );
    }

    CheckFileListIsEmpty() {
        if (this.fileList.length <= 0) {
            this.numberOfDocCreated = 0;
            this.ForwordButton = true;
            this.fileName = '--';
            this.totalSplittedPages = 0;
            this.totalPendingSplitFiles = 0;
        }
    }

    DataToPostSplitterMerger($data = [], id) {

        const fileList$ = $data.map((item: any) => {
            return new SplitterMerger(
                item.DocumentHeaderID,
                item.InputSourceHeaderId,
                item.SourceFileExtension,
                item.FileName,
                item.FilePath,
                item.BatchRootPath,
                item.InputSourceFileId,
                id,
                item.CurrentStatusId,
                item.InputSourceSplitFileId,
                item.objBatchModel,
                true
            );
        });
        return fileList$;
    }

    checkBox_fileChanged(e, itemData) {
        if (e.currentTarget.checked === true) {

           // this.selectedFileListSpliter.push(itemData);
            this.fileList.forEach( X => {
                if (X.InputSourceSplitFileId ===  itemData.InputSourceSplitFileId) {
                    X.isChecked = true;
                }
            });
            this.selectedFileSequenceList.push(itemData);
        } else {
           // this.selectedFileListSpliter.push(itemData);
            this.fileList.forEach( X => {
                if (X.InputSourceSplitFileId ===  itemData.InputSourceSplitFileId) {
                    X.isChecked = false;
                }
            });
            // tslint:disable-next-line:max-line-length
            const index = this.selectedFileSequenceList.map(function (x) { return x.InputSourceSplitFileId; }).indexOf(itemData.InputSourceSplitFileId); // find index in your array
            this.selectedFileSequenceList.splice(index, 1); // remove element from array
        }
        const SelectedCount = this.fileList.filter(X => X.isChecked === true).length;
        this.CheckedCount = SelectedCount;
        if (this.fileList.length === this.CheckedCount) {
            this.IsCheckAll = true;
        } else {
            this.IsCheckAll = false;
        }
        if (this.showSelectedFlag && this.CheckedCount === 0) {
            this.showSelectedFlag = false;
            this.IsCheckAllBtnVisible = true;
        }
    }

    CheckAllPages(e) {
        if (e.currentTarget.checked === true) {
            this.IsCheckAll = true;
            this.fileList.forEach( x => {
                x.isChecked = true;
            });
        } else {
            this.IsCheckAll = false;
            this.fileList.forEach( x => {
                x.isChecked = false;
            });
        }

    }

    ShowSelectePages(e) {
        // tslint:disable-next-line:no-debugger
        if (e.value === true) {
            this.showSelectedFlag = true;
            this.IsCheckAllBtnVisible = false;
        } else {
            this.showSelectedFlag = false;
            this.IsCheckAllBtnVisible = true;
        }

    }

    SortFileList() {
        this.selectedFileListSpliter.sort((val1, val2) => (val1.InputSourceSplitFileId) - (val2.InputSourceSplitFileId));
        this.fileList.sort((val1, val2) => (val1.InputSourceSplitFileId) - (val2.InputSourceSplitFileId));
    }

    ShowSuccessMessage() {
        this.message = true;
        this.IsCheckAll = false;
        this.showSelectedFlag = false;
        this.discardButtonFlag = false;
        setTimeout(() => {
            this.message = false;
            this.GetNextDocument();
        }, 2000);

    }

    // added on 26-Feb-2020 -- hotkeys start
    HotkeysPopupVisible = false;
    HotkeysPopup() {
        this.HotkeysPopupVisible = true;
        
    }
    // added on 26-Feb-2020 --end 

}
