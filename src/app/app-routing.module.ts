import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './shared/services';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { OntologyDashboardComponent } from './pages/dashboard/ontology-dashboard/ontology-dashboard.component';
import { SMEDashboardComponent } from './pages/smedashboard/smedashboard.component';
import { ExecutorComponent } from './pages/executor/executor.component';
import { QualityCheckComponent } from './pages/executor/quality-check/quality-check.component';
import { ExecutorSplitterComponent } from './pages/executor/executor-splitter/executor-splitter.component';
import { OperationalManagerComponent } from './pages/operational-manager/operational-manager.component';
import { AllocationComponent } from './pages/operational-manager/allocation/allocation.component';
import { AuditComponent } from './pages/operational-manager/audit/audit.component';
import { UserloadProductivityComponent } from './pages/operational-manager/userload-productivity/userload-productivity.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ApplicationSettingsComponent } from './pages/admin/application-settings/application-settings.component';

import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { CategoryMasterComponent } from './pages/admin/category-master/category-master.component';
import { SMTPComponent } from './pages/admin/smtp/smtp.component';
import { InputSourcComponent } from './pages/admin/input-source/input-source.component';

import { QueuesComponent } from './pages/admin/queues/queues.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { LoginFormComponent } from './shared/components/login-form/login-form.component';
import { DocumentMonitorComponent } from './pages/operational-manager/document-monitor/document-monitor.component';
import { DocumentTypeMasterComponent } from './pages/admin/documenttype-master/documenttype-master.component';
import { PagenotfoundComponent } from './shared/error/pagenotfound/pagenotfound.component';
import{ CreateTableComponent} from  './pages/admin/createtable/create-table.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: OntologyDashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'users',
    component: UsersComponent,
    // canActivate: [AuthGuardService]
  }
  ,
  {
    path: 'login-form',
    component: LoginFormComponent,

  },
  {
    path: 'appsetting',
    component: ApplicationSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sme',
    component: SMEDashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sme/:id',
    component: SMEDashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'audit',
    component: AuditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'executor',
    component: ExecutorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'qualitycheck',
    component: QualityCheckComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'smtp',
    component: SMTPComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'executor-splitter',
    component: ExecutorSplitterComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'operational-manager',
    component: OperationalManagerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'category-master',
    component: CategoryMasterComponent,
    canActivate: [AuthGuardService]
  },
  {
  path: 'create-table',
    component: CreateTableComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'documenttype-master',
    component: DocumentTypeMasterComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'input-source',
    component: InputSourcComponent,
    canActivate: [AuthGuardService]
  }
  ,
  {
    path: 'export',
    component: InputSourcComponent,
    canActivate: [AuthGuardService]
  }
  ,
  {
    path: 'queues',
    component: QueuesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'manualhandling',
    component: QualityCheckComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'veto',
    component: QualityCheckComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-allocation',
    component: AllocationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-load-productivity',
    component: UserloadProductivityComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'Document-Monitor',
    component: DocumentMonitorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    component: PagenotfoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  // declarations: [HomeComponent, ProfileComponent, DisplayDataComponent]
})
export class AppRoutingModule { }
