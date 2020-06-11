
import { Component, OnInit,NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPopoverModule, DxTemplateModule } from 'devextreme-angular';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DevExtremeModule } from "devextreme-angular";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@Component({
  selector: 'app-hot-keys',
  templateUrl: './hot-keys.component.html',
  styleUrls: ['./hot-keys.component.scss']
})
export class HotKeysComponent{

show:boolean=false;
  showHotKeys(){
  this.show = true;  
  }
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule,
    DxPopoverModule,
        DxTemplateModule,
        PerfectScrollbarModule,
        DevExtremeModule
  ],
  declarations: [ HotKeysComponent ],
  exports: [ HotKeysComponent ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
})
export class HotKeysModule { }
