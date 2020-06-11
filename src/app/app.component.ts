import { Component, HostBinding, NgModule, ViewChild } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { Service, List } from './app.service';
import { BrowserModule } from '@angular/platform-browser';
import { DxDrawerModule, DxListModule, DxRadioGroupModule, DxToolbarModule, DxDrawerComponent } from 'devextreme-angular';
import { NavigationStart } from '@angular/router';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
  }

  // Overlap side bar menu starts
  @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;

  navigation: List[] = [];
  allowedNavigations: List[] = [];
  showSubmenuModes: string[] = ['slide', 'expand'];
  positionModes: string[] = ['top', 'bottom'];
  showModes: string[] = ['push', 'shrink', 'overlap'];
  selectedOpenMode: string = 'overlap';
  selectedPosition: string = 'top';
  selectedRevealMode: string = 'expand';
  text: string;
  elementAttr: any;
  wrapperCss = 'fixedWrapper';
  showHeader = false;
  showError = false;
  HeaderName: any[] = ['Setup', 'Create', 'Execute', 'Analyse', 'Analyse1', 'Setup1'];
  DisplyName: any[] = [];
  ModelsArray: any[];
  TempLinks: List;
  id: number;

  constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService, service: Service, private router: Router) {
    this.feedNavigation();
    var token = localStorage.getItem('token');
    if (token != undefined && token != '' && token != null && token !== 'undefined') {

      this.navigation = this.getMenuPermissions();
      //this.navigation=service.getNavigationList();
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event['url'].indexOf('/resetpassword') >= 0) {
            this.wrapperCss = 'fluidWrapper';
            this.showHeader = false;
          }
          else if (event['url'] == '/login' || event['url'] == '/') {
            this.showHeader = false;
            this.wrapperCss = 'fixedWrapper';
          }
          else if (event['url'] == '/default-error' || event['url'] == '/conflict-error' || event['url'] == '/confirm-usersession' || event['url'] == '/') {
            this.showHeader = false;
            this.showError = true;
            this.wrapperCss = 'fixedWrapper';

          } else {
            this.showHeader = true;
            this.wrapperCss = 'fixedWrapper';
            this.showError = false;
          }
        }
      });
    }
  }


  toggleMenu() {
    this.drawer.instance.toggle()
  }

  toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      onClick: () => this.drawer.instance.toggle()
    }
  }];
  // Overlap side bar menu ends

  isAutorized() {
    return this.authService.isLoggedIn;
  }



  getMenuPermissions() {
    var token = localStorage.getItem('token');
    if (token != undefined) {
      var md = localStorage.getItem('Md');
      if (md !== undefined && md !== 'undefined' && md !== '') {

        var modules = window.atob(md).split(',');

        this.navigation.forEach(a => {
          this.TempLinks = a;
          let tempbindlinks = a.links.map(val => val);

          tempbindlinks.forEach(b => {
            let spliceindex = this.TempLinks.links.indexOf(b);
            b.canAccess = (b.text == "Users" && modules.filter(x => x == "UsersandRoles").length > 0) //(this.DisplyName.filter(x => x == b.text).length > 0);
              || (b.text == "Allocationn" && modules.filter(x => x == "Allocation").length > 0)
              || (b.text == "Settings" && modules.filter(x => x == "Applicationsettings").length > 0)
              || (b.text == "Logs" && modules.filter(x => x == "Audit").length > 0)
              || (b.text == "Industry" && modules.filter(x => x == "CategoryMaster").length > 0)
              || (b.text == "Document / Ontology" && modules.filter(x => x == "Creatordashboard").length > 0)
              || (b.text == "Function" && modules.filter(x => x == "DocumentType").length > 0)
              || ((b.text == "I/O Location") && modules.filter(x => x == "IOsources").length > 0)
              //|| ((b.text ==  "Export") && modules.filter(x => x == "IOsources").length > 0)
              || (b.text == "User Productivityy" && modules.filter(x => x == "loadproductivity").length > 0)
              || (b.text == "Manual Processs" && modules.filter(x => x == "Manualintervantions").length > 0)
              || (b.text == "Operations Dashboard" && modules.filter(x => x == "Operationsdashboard").length > 0)
              || (b.text == "Quality Checkk" && modules.filter(x => x == "Qualitycheck").length > 0)
              || (b.text == "Queues" && modules.filter(x => x == "Queues").length > 0)
              || (b.text == "Mailss" && modules.filter(x => x == "SMTPsettings").length > 0)
              || (b.text == "Split Mergee" && modules.filter(x => x == "SplitterMerge").length > 0)
              || (b.text == "Super Userr" && modules.filter(x => x == "Veto").length > 0)
              || (b.text == "Create Table" && modules.filter(x => x == "CreateTable").length > 0)

            if (!b.canAccess) {
              this.TempLinks.links.splice(spliceindex, 1);
            }
          });

          if (this.TempLinks.links.length > 0) {
            this.allowedNavigations.push(this.TempLinks);
          }
        });
      }
    }
    return this.allowedNavigations;
  }



  feedNavigation() {
    this.navigation.push({ id: 1, text: 'Setup Application', links: [{ text: 'Users', link: '/users', canAccess: true }, { text: 'I/O Location', link: '/input-source', canAccess: true }, { text: 'Queues', link: '/queues', canAccess: true }, { text: 'Mails', link: '/smtp', canAccess: false }, { text: 'Settings', link: '/appsetting', canAccess: true }] });
    this.navigation.push({ id: 2, text: 'Define Documents', links: [{ text: 'Industry', link: '/category-master', canAccess: true }, { text: 'Function', link: '/documenttype-master', canAccess: true }, { text: 'Document / Ontology', link: '/dashboard', canAccess: true },{ text: 'Create Table', link: '/create-table', canAccess: true }] });
    this.navigation.push({ id: 3, text: 'Process Documents', links: [{ text: 'Split Merge', link: '/executor-splitter', canAccess: true }, { text: 'Manual Process', link: '/manualhandling', canAccess: true }, { text: 'Quality Check', link: '/qualitycheck', canAccess: true }, { text: 'Super User', link: '/veto', canAccess: true }, { text: 'Export', link: '/export', canAccess: true }] });
    this.navigation.push({ id: 4, text: 'Monitor', links: [{ text: 'Operations Dashboard', link: '/operational-manager', canAccess: true }, { text: 'Allocation', link: '/user-allocation', canAccess: true }, { text: 'Logs', link: '/audit', canAccess: true }, { text: 'User Productivity', link: '/user-load-productivity', canAccess: true }] });
  }

  loadView(e) {

    if (e.addedItems[0].text == 'Ontology') {
      location.href = "\sme";
    }
    else if (e.addedItems[0].text == 'User Manager') {
      location.href = "\\users";
    }
    else if (e.addedItems[0].text == 'SMTP Setting') {
      location.href = "\smtp";
    }
    else if (e.addedItems[0].text == 'Queue Manager') {
      location.href = "\queues";
    }
    else if (e.addedItems[0].text == 'Input-Output Source') {
      location.href = "\input-source";
    }
    else if (e.addedItems[0].text == 'executor-splitter') {
      location.href = "\executor-splitter";
    }
    else if (e.addedItems[0].text == 'Manual Handling') {
      location.href = "\manualhandling";
    }
    else if (e.addedItems[0].text == 'Quality Check') {
      location.href = "\qualitycheck";
    }

    else if (e.addedItems[0].text == 'Veto') {
      location.href = "\\veto";
    }
    else if (e.addedItems[0].text == 'Operational Manager Dashboard') {
      location.href = "\\operational-manager";
    }

    else if (e.addedItems[0].text == 'Application Settings') {
      location.href = "\appsetting";
    }
    else if (e.addedItems[0].text == 'User Productivity') {
      location.href = "\\userproductivity";
    }
    else {
      location.href = "\dashboard";
    }
  }

}

@NgModule({
  imports: [
    BrowserModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule
  ]
})

export class AppModule { }
export class Menu {
  id: number;
  text: string;
  icon: string;
  routeLink: string;
  canAccess: boolean;
}
