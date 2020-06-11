
import { formatDate } from '@angular/common';
import { Inject, OnInit, Component } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { DataService } from 'src/app/data.service';
import { Authorize } from 'src/app/models/authorize.module';

@Component({
  selector: 'app-componentbase',
  templateUrl: './componentbase.component.html',
  styleUrls: ['./componentbase.component.scss']
})
export class ComponentbaseComponent implements OnInit {

  Authorize: Authorize;
  namePattern: any = /^[a-zA-Z\s]+$/;
  phonePattern: any = /^(?!0+$)\d{10,12}$/;
  roleWiseModuleName: string;

  constructor(@Inject('') pageHeading: string, @Inject('') claimName: string, _message: MessageService, _service: DataService, @Inject('') serviceBaseUrl: string) {
    // Added the if-else check for the manual handling screen - to modify the heading depending on role
    if (pageHeading == "Manual Handling") {
      _message.setPageHeading(this.setModuleNameHeading());
    }
    else {
      _message.setPageHeading(pageHeading);
    }
  
    _service.baseUrl = serviceBaseUrl;
    if (claimName == "Manualintervantions") {
      this.Authorize = this.getClaims(this.setClaimNameForManualQCVetoScreen());
    }
    else {
      this.Authorize = this.getClaims(claimName);
    }
    //this.Authorize = this.getClaims(claimName);
  }
  getClaims(moduleName) {
  
    var accessRights: Authorize = { toAdd: false, toUpdate: false, toView: false, toDelete: false };
    if (localStorage.getItem('userclaims') !== null) {
      var userClaims = JSON.parse(window.atob(localStorage.getItem('userclaims')));
      if (userClaims != null) {
        userClaims.forEach(a => {
          if (a.ModuleName === moduleName) {
            accessRights.toAdd = a.CanAdd;
            accessRights.toDelete = a.CanDelete;
            accessRights.toView = a.CanView;
            accessRights.toUpdate = a.CanUpdate;
          }
        });
      }
    }
    return accessRights;

  }

  lastUpdatedDate(data) {
    return formatDate(data.modifiedDate, 'dd MMM yyyy', 'en-US');
  }

  ngOnInit() {
  }

  // Method to set module heading as per the current logged in role for Manual Handling screen - Manual handling/QC/Veto
  setModuleNameHeading() {
    let moduleName: string = '';
    let manualhandlingStartIndex = window.location.toString().indexOf("manualhandling");
    let qualitycheckStartIndex = window.location.toString().indexOf("qualitycheck");
    let vetoStartIndex = window.location.toString().indexOf("veto");
    if (manualhandlingStartIndex >= 0) {
      moduleName = "Manual Handling";
    } else if (qualitycheckStartIndex >= 0) {
      moduleName = "Quality Check";
    } else if (vetoStartIndex >= 0) {
      moduleName = "Veto";
    }
    return moduleName;
  }

  // Method to set claim name to fetch the permissions for the current module for Manual Handling screen - Manual handling/QC/Veto
  setClaimNameForManualQCVetoScreen() {
    let currentClaimName: string = '';
    let manualhandlingStartIndex = window.location.toString().indexOf("manualhandling");
    let qualitycheckStartIndex = window.location.toString().indexOf("qualitycheck");
    let vetoStartIndex = window.location.toString().indexOf("veto");
    if (manualhandlingStartIndex >= 0) {
      currentClaimName = "Manualintervantions";
    } else if (qualitycheckStartIndex >= 0) {
      currentClaimName = "Qualitycheck";
    } else if (vetoStartIndex >= 0) {
      currentClaimName = "Veto";
    }
    return currentClaimName;
  }
}
