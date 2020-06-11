import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SingleCardModule } from './layouts';
import { LoginFormModule, HeaderModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';

import { DevExtremeModule } from "devextreme-angular";
import { Service } from './app.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OntologyDashboardComponent } from './pages/dashboard/ontology-dashboard/ontology-dashboard.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SMEDashboardComponent } from './pages/smedashboard/smedashboard.component';
import { ExecutorComponent } from './pages/executor/executor.component';
import { ExecutorDashboardComponent } from './pages/executor/executor-dashboard/executor-dashboard.component';
import { QualityCheckComponent } from './pages/executor/quality-check/quality-check.component';
import { ExecutorSplitterComponent } from './pages/executor/executor-splitter/executor-splitter.component';
import { OperationalManagerComponent } from './pages/operational-manager/operational-manager.component';
import { AllocationComponent } from './pages/operational-manager/allocation/allocation.component';
import { AuditComponent } from './pages/operational-manager/audit/audit.component';
import { UserloadProductivityComponent } from './pages/operational-manager/userload-productivity/userload-productivity.component';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AlertsComponent } from './pages/operational-manager/alerts/alerts.component';
import { HttpConfigInterceptor } from './shared/interceptor/interceptor';

import { NgxGalleryModule } from 'ngx-gallery';
import 'hammerjs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { DataService } from './data.service';
import {
  DxSelectBoxModule, DxCheckBoxModule, DxTextBoxModule, DxNumberBoxModule, DxTextAreaModule,
  DxFileUploaderModule, DxDateBoxModule, DxValidatorModule, DxFormModule,
  DxValidationSummaryModule, DxAutocompleteModule, DxLoadPanelModule, DxChartModule
  , DxDrawerModule, DxListModule, DxToolbarModule,
  DxDataGridModule, DxTemplateModule, DxPopupModule, DxButtonModule, DxValidationGroupModule,
  DxSchedulerModule, DxRadioGroupModule, DxSwitchModule, DxTabPanelModule
} from 'devextreme-angular';

import { AdminComponent } from './pages/admin/admin.component';
import { InputSourcComponent } from './pages/admin/input-source/input-source.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { QueuesComponent } from './pages/admin/queues/queues.component';
import { SMTPComponent } from './pages/admin/smtp/smtp.component';
import { ApplicationSettingsComponent } from './pages/admin/application-settings/application-settings.component';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DocumentMonitorComponent } from './pages/operational-manager/document-monitor/document-monitor.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { OperationalManagerDashboardComponent } from './pages/operational-manager/operational-manager-dashboard/operational-manager-dashboard.component';
import { ComponentbaseComponent } from './shared/components/componentbase/componentbase.component';
import { CategoryMasterComponent } from './pages/admin/category-master/category-master.component';
import { DocumentTypeMasterComponent } from './pages/admin/documenttype-master/documenttype-master.component';
import { ConfirmUsersessionComponent } from './shared/components/confirm-usersession/confirm-usersession.component';
import { PagenotfoundComponent } from './shared/error/pagenotfound/pagenotfound.component'; 
import{ CreateTableComponent} from  './pages/admin/createtable/create-table.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    OntologyDashboardComponent,
    SMEDashboardComponent,
    ExecutorComponent,
    ExecutorDashboardComponent,
    QualityCheckComponent,
    ExecutorSplitterComponent,
    OperationalManagerComponent,
    AllocationComponent,
    AuditComponent,
    UserloadProductivityComponent,
    AlertsComponent,
    AdminComponent,
    InputSourcComponent,
    UsersComponent,
    QueuesComponent,
    SMTPComponent,
    ApplicationSettingsComponent,
    DocumentMonitorComponent,
    ProfileSettingsComponent,
    OperationalManagerDashboardComponent,
    ComponentbaseComponent,
    CategoryMasterComponent,
    DocumentTypeMasterComponent,
    ConfirmUsersessionComponent,
    PagenotfoundComponent,
    CreateTableComponent,
 

  ],
  imports: [
    BrowserModule,
    SingleCardModule,
    HeaderModule,
    LoginFormModule,
    AppRoutingModule,
    DevExtremeModule,
    AngularMultiSelectModule,
    PerfectScrollbarModule, FormsModule,
    NgxDaterangepickerMd.forRoot(),
    NgxGalleryModule,

    HttpClientModule,
    FormsModule,
    DxDataGridModule,
    DxTemplateModule,
    DxPopupModule,
    DxButtonModule,
    DxValidationGroupModule,
    DxSchedulerModule,
    DxRadioGroupModule,
    DxSwitchModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxFileUploaderModule,
    DxDateBoxModule,
    DxValidatorModule,
    DxFormModule,
    DxValidationSummaryModule,
    DxAutocompleteModule,
    DxLoadPanelModule,
    DxChartModule,
    DxDrawerModule,
    DxListModule,
    DxToolbarModule,
    DevExtremeModule,
    DxTabPanelModule,
    PerfectScrollbarModule,



  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    Service,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
