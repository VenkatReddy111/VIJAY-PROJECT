import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { DxDataGridComponent, DxPopupComponent, DxValidationGroupComponent, DxFormComponent, DevExtremeModule, DxTreeMapModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store'
import notify from 'devextreme/ui/notify';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.module';
import { DataService } from 'src/app/data.service';
import { MessageService } from 'src/app/message.service';
import { map } from 'rxjs/operators';
import { Role, Permission } from 'src/app/models/role.module';
import { environment } from 'src/environments/environment';
import { ComponentbaseComponent } from 'src/app/shared/components/componentbase/componentbase.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent extends ComponentbaseComponent implements OnInit {
  @ViewChild('valGroup', { static: false }) valGroup: DxValidationGroupComponent;
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent
  @ViewChild('valGroups', { static: false }) valGroups: DxValidationGroupComponent;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGrids', { static: false }) dataGrids: DxDataGridComponent;

  users: any[] = [];
  roles = [];
  rol = [];
  roleStore: any[];
  openEditorPopup = false;
  openEditorPopUp = false;
  unsavedRow: User;
  unsavedRows: Role;
  isAdUser = false;
  loggedinUserCode: any;
  model: User;
  models: Role;
  loggedinusercode: any;
  rolePersmission: any = [];
  permission = [];
  permissions = [];
  addAll = false; modifyAll = false; deleteAll = false; viewAll = false;
  namePattern: any = /^[a-zA-Z\\s]+$/;
  phonePattern: any = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  selectedItemKeys: any[] = [];
  tempDeleteArray: ArrayStore;
  deleteBtn: boolean = false;
  editBtn: boolean = false;
  addInputSourcePopop: boolean = false;
  addInputSourcePopops: boolean = false;
  editPopupVisible = false;
  getRowIndex: number = 0;
  duplicatePopupVisible = false;
  dropdownList = [];
  selectedItems: Map<string, Array<any>>;
  dropdownSettings = {};
  searchResult: LDAPUsers[];
  varuser = '';
  userfield: Object;
  userrole: any;
  addBtn: boolean = true;
  userroles: any = [];
  status: boolean;
  deleteModal: boolean = false;
  deleteModals: boolean = false;
  usertext: string;
  roletext: string;
  userstatus: string;
  userstatuss: string;

  constructor(private route: ActivatedRoute, private service: DataService, private message: MessageService) {
    super('Users', 'UsersandRoles', message, service, environment.apiBaseUrl);
    this.unsavedRow = this.initModel();
    this.unsavedRows = this.initModels();
    this.model = this.initModel();
    this.models = this.initModels();
    this.loggedinUserCode = localStorage.getItem('UserCode');
    this.userroles = localStorage.getItem('userrole');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.model.firstChange && this.models.Name.trim() === '') {
      this.resetCheckAll();
    }
  }

  initModel() {
    return new User(0, '', '', '', '', "", true, false, '', new Date(), new Date(), null, 0, '', '', false);
  }

  initModels() {
    return new Role(0, '', true, '', 0, this.permission, 0);
  }

  ngOnInit() {
    this.roles$().subscribe(resp => this.roles = resp);
    this.rol$().subscribe(resp => this.rol = resp);
    this.users$().subscribe(resp => this.users = resp);
    this.rolePersmission = this.permissions$().subscribe();
    this.selectedItems = new Map<string, Array<any>>();
    this.permissions$().subscribe(resp => this.permissions = resp);
  }

  rolePermissions$(roleId) {
    return this.service.getAll('roleapi/GetPermissionByRole?id=' + roleId).pipe(map((data: any[]) => data.map((item: any) => {
      const permissions = [];
      item.Permissions.map(x => {
        permissions.push(new Permission(x.Id, x.Name, x.add, x.update, x.delete, x.view, x.DisplayName));
      });
      return new Role(item.Id, item.Name, item.IsActive, item.LastUpdateDate, item.roleTypeId, permissions, item.LastUpdateBy);
    })));
  }

  permissions$() {
    return this.service.getAll('roleapi/GetPermission').pipe(map((data: any[]) => data.map((item: any) => {
      return new Permission(item.Id, item.Name, item.add, item.update, item.delete, item.view, item.DisplayName);
    })),
      map(x => this.permission = x)
    );
  }

  save($event) {
    this.model.IsAduser = this.isAdUser;
    if (this.model.Id === 0) {
      const x = this.formDtoU(this.model);
      const post$ = this.service.postAll('Account/AddUser', x);
      post$.subscribe(
        data => {
          this.addInputSourcePopop = false;
          this.model = this.initModel();
          this.varuser = '';
          const notifydata = data;
          this.valGroup.instance.reset();
          this.users$().pipe(map(x => { this.users = x; }));
          notify(notifydata);
          this.roles$().subscribe();
          this.users$().subscribe();
        }, err => {
          notify('Error');
          this.model = this.initModel();
          this.roles$().subscribe();
          this.users$().subscribe();
        }
      );
    } else {
      const put$ = this.service.put('Account/UpdateUser', this.formDtoU(this.model));
      put$.subscribe(
        data => {
          this.addInputSourcePopop = false;
          this.model = this.initModel();
          this.varuser = '';
          const notifydata = data;
          this.users$().pipe(map(x => { this.users = x; }));
          notify(notifydata);
          this.valGroup.instance.reset();
          this.roles$().subscribe();
          this.users$().subscribe();

        }, err => {
          notify('Error');
          this.roles$().subscribe();
          this.users$().subscribe();
        }
      );
    }
  }

  formDtoU(row: User) {
    return {
      'Id': row.Id,
      'Name': row.Name,
      'Password': (row.IsAduser) ? '' : row.Password,
      'FullName': row.FullName,
      'EmailId': row.EmailId,
      'MobileNo': row.MobileNo,
      'IsEnabled': row.IsEnabled,
      'IsExpired': row.IsExpired,
      'LastLogin': row.LastLogin,
      'MUserType': row.UserType,
      'DutyFrom': row.DutyFrom,
      'DutyTo': row.DutyTo,
      'ProfileImage': row.ProfileImage,
      'RoleIds': this.fetchRoleNamesOnIds(row),
      'LastUpdateBy': window.localStorage.getItem('UserCode'),
      'IsAduser': (row.Password == '') ? row.IsAduser : false
    };
  }

  fetchRoleNamesOnIds(row: User) {
    const roleIds = [];
    row.SelectedRoles.forEach(item =>
      roleIds.push(this.roles.filter(x => x.Name === item)[0].Id)
    );
    return roleIds;
  }

  SelectedRoles(roleIds) {
    const newRoles = [];
    if (roleIds != null) {
      roleIds.forEach(element => {
        newRoles.push(this.roles.filter(x => x.Id === element)[0]);
      });
    }
    return newRoles;
  }

  saverole($event) {
    const alen = this.permissions.filter(a => a.add === true).length;
    const ulen = this.permissions.filter(a => a.update === true).length;
    const dlen = this.permissions.filter(a => a.delete === true).length;
    const vlen = this.permissions.filter(a => a.view === true).length;

    if (alen === 0 && ulen === 0 && dlen === 0 && vlen === 0) {
      notify("Please select the Role permission.");
      return;
    }
    else {
      const x = this.formDto(this.models);
      const post$ = this.service.postAll('RoleApi/UpdatePermission', x);
      post$.subscribe(
        data => {
          this.openEditorPopUp = false;
          this.models = this.initModels();
          this.roles$().subscribe();
          this.rol$().subscribe(resp => this.rol = resp);
          this.resetCheckAll();
          this.valGroups.instance.reset();
          if (data === '') {
            notify('Role saved successfully..');
            this.rol$().subscribe(resp => this.rol = resp);
          } else {
            notify(data.toString());
          }
          this.roles$().subscribe();
          this.rolePersmission = this.permissions$().subscribe();
        }, err => {
          this.openEditorPopUp = false;
          notify(err.error.toString());
          this.resetCheckAll();
          this.models = this.initModels();
          this.roles$().subscribe();
          this.rolePersmission = this.permissions$().subscribe();
        }
      );
      this.resetCheckAll();
    }
  }

  formDto(row: Role) {
    return {
      'Id': row.Id,
      'Name': row.Name,
      'IsActive': row.IsActive,
      'Permissions': this.formPermissionDto(this.permissions),
      'LastUpdateBy': window.localStorage.getItem('UserCode')
    };
  }

  formPermissionDto(permissions: Permission[]) {
    return permissions.map(x => {
      return {
        'Id': x.Id,
        'Name': x.Name,
        'add': x.add,
        'delete': x.delete,
        'view': x.view,
        'update': x.update
      };
    });
  }

  handleAddAll(models) {
    this.addAll = !this.addAll;
    // this.viewAll = !this.viewAll;
    this.permissions.forEach(p => {
      p.add = this.addAll;
      p.view = true;
    });
    this.checkAll();
  }

  handleModifyAll(models) {
    this.modifyAll = !this.modifyAll;
    // this.viewAll = !this.viewAll;
    this.permissions.forEach(p => {
      p.update = this.modifyAll;
      p.view = true;
    });
    this.checkAll();
  }

  handleDeleteAll(models) {
    this.deleteAll = !this.deleteAll;
    // this.viewAll = !this.viewAll;
    this.permissions.forEach(p => {
      p.delete = this.deleteAll;
      p.view = true;
    });
    this.checkAll();
  }

  handleViewAll(models, i, event) {
    this.viewAll = !this.viewAll;
    if (!event.target.checked && event.target.name === 'viewAll') {
      this.permissions.forEach(p => {
        p.add = false;
        p.update = false;
        p.delete = false;
      });
    }
    this.permissions.forEach(p => {
      p.view = this.viewAll;
    });
    this.checkAll();
  }

  checkPermission(permission, index, event) {
    if (permission.add || permission.update || permission.delete || permission.view) {
      permission.view = true;
    }
    if (!event.target.checked && event.target.name === 'view') {
      permission.add = permission.update = permission.delete = permission.view = false;
    }
    this.checkAll();
  }

  checkAll() {
    this.addAll = this.modifyAll = this.deleteAll = this.viewAll = false;
    this.addAll = this.permissions.filter(a => a.add === true).length === this.permissions.length;
    this.modifyAll = this.permissions.filter(a => a.update === true).length === this.permissions.length;
    this.deleteAll = this.permissions.filter(a => a.delete === true).length === this.permissions.length;
    this.viewAll = this.permissions.filter(a => a.view === true).length === this.permissions.length;
  }

  resetCheckAll() {
    this.addAll = false;
    this.modifyAll = false;
    this.viewAll = false;
    this.deleteAll = false;

    this.permissions.forEach(p => {
      p.add = this.addAll;
    });

    this.permissions.forEach(p => {
      p.update = this.modifyAll;
    });

    this.permissions.forEach(p => {
      p.delete = this.deleteAll;
    });

    this.permissions.forEach(p => {
      p.view = this.viewAll;
    });
  }

  smeTabs = [
    'Users', 'Roles'
  ]

  showTabContent: string = this.smeTabs[0];
  activateTabContent(data) {
    this.showTabContent = data;
  }

  customAddpopup() {
    this.addInputSourcePopop = true;
    this.valGroup.instance.reset();
  }

  customAddPopup() {
    this.openEditorPopUp = true;
  }

  users$() {
    return this.service.getAll('account/GetAllUsersWithRole').pipe(map((data: any[]) => data.map((item: any) => {
      const user = new User(item.Id, item.Name, item.Password, item.FullName, item.EmailId, item.MobileNo, item.IsEnabled,
        item.IsExpired, item.LastLogin, item.DutyFrom, item.DutyTo, item.ProfileImage, item.RoleIds, item.RoleName,
        item.UserType, item.IsAdUser);
      if (user.RoleName == null || user.RoleName == undefined) {
        user.RoleName = this.SelectedRoles(item.RoleIds).map(x => x.Name).join(', ');
      } else {
        user.RoleName = '';
      }
      return user;
    })),
      map(x => this.users = x));
  }

  roles$() {
    return this.service.getAll('RoleApi/GetRoleList').pipe(map((data: any[]) => data.map((item: any) => {
      return new Role(item.Id, item.Name, item.IsActive, item.LastUpdateDate, item.roleTypeId, [], item.LastUpdateBy);
    })),
      map(x => this.roles = x));
  }

  rol$() {
    return this.service.getAll('RoleApi/GetActiveRoleList').pipe(map((data: any[]) => data.map((item: any) => {
      return new Role(item.Id, item.Name, item.IsActive, item.LastUpdateDate, item.roleTypeId, [], item.LastUpdateBy);
    })),
      map(x => this.rol = x));
  }

  fieldTab = [{
    "ID": 1,
    "FieldName": "Permissions",
  },
  ];

  UpdateSingleStatus(status, user) {
    var b = this.users.filter(x => x.Id == this.loggedinUserCode && x.RoleName.includes('Admin'));
    if (this.loggedinUserCode == 1 || b.length > 0) {
      user.IsEnabled = status ? false : true;
      this.service.postAll('Account/UpdateUserStatus', this.formDtoU(user)).subscribe(
        data => {
          notify('Status changed successfully.');
          this.users$().subscribe(resp => this.users = resp);
        }
      );
    }
    else {
      notify("Logged in user does not have permission to update status.");
      this.users$().subscribe(resp => this.users = resp);
      return true;
    }
  }

  UpdateSinglestatus(status, role) {
    var b = this.users.filter(x => x.Id == this.loggedinUserCode && x.RoleName.includes('Admin'));
    if (this.loggedinUserCode == 1 || b.length > 0) {
      if (status == true) {
        var a = this.users.filter(x => x.IsEnabled == true && x.RoleIds.includes(role.Id));
        if (a.length > 0) {
          notify("Role cannot be deactivated as it is assigned to active user.");
          this.roles$().subscribe(resp => this.roles = resp);
          return true;
        }

        else {
          role.IsActive = status ? false : true;
          const post$ = this.service.put('RoleApi', this.formDto(role)).subscribe(
            data => {
              this.rol$().subscribe(resp => this.rol = resp);
              this.roles$().subscribe(resp => this.roles = resp);
              if (data === '') {
                notify('Status changed successfully.');
                this.users$().subscribe(resp => this.users = resp);
              } else {
                notify(data.toString());
              }
            }, err => { notify(err.error.toString()); }
          );
          this.rol$().subscribe(resp => this.rol = resp);
          this.users$().subscribe(resp => this.users = resp);
          this.deleteModals = false;
          return true;
        }
      }

      else {
        role.IsActive = status ? false : true;
        const post$ = this.service.put('RoleApi', this.formDto(role)).subscribe(
          data => {
            this.rol$().subscribe(resp => this.rol = resp);
            this.roles$().subscribe(resp => this.roles = resp);
            if (data === '') {
              notify('Status changed successfully.');
              this.users$().subscribe(resp => this.users = resp);
            } else {
              notify(data.toString());
            }
          }, err => { notify(err.error.toString()); }
        );
        this.rol$().subscribe(resp => this.rol = resp);
        this.users$().subscribe(resp => this.users = resp);
        this.deleteModals = false;
        return true;
      }
    }

    else {
      notify("Logged in user does not have permission to update status.");
      this.roles$().subscribe(resp => this.roles = resp);
      return true;
    }

  }

  resetPermission() {
    return this.rolePersmission.map(x => {
      x.add = false;
      x.edit = false;
      x.view = false;
      x.delete = false;
    });
  }

  SelectedRoleItem(roleIds) {
    const newRoles = [];
    if (roleIds != null) {
      roleIds.forEach(element => {
        newRoles.push(this.roles.filter(x => x.Id === element)[0]);
      });
    }
    return newRoles;
  }

  deleteRecords() {
    this.deleteModal = true;
  }

  deletedrole() {
    this.deleteModals = true;
  }

  delete() {
    var a = this.selectedItemKeys.length;
    for (var i = 0; i < a; i++) {
      this.model = this.selectedItemKeys[i];
      this.UpdateSingleStatus(this.model.IsEnabled, this.model);
    }
    this.deleteModal = false;
    this.dataGrid.instance.clearSelection();
  }

  deleterole() {
    var a = this.selectedItemKeys.length;
    for (var i = 0; i < a; i++) {
      if (this.selectedItemKeys[i].Id != 1) {
        this.models = this.selectedItemKeys[i];
        this.UpdateSinglestatus(this.models.IsActive, this.models);
      }
      else {
        this.roles$().subscribe();
      }
    }
    this.deleteModals = false;
    this.dataGrids.instance.clearSelection();
  }

  Edit() {
    this.rolePermissions$(this.selectedItemKeys[0].Id).subscribe(data => {
      this.models = <any>data[0];
      this.permissions = data[0].permissions;
      this.checkAll();
    });
  }

  edit() {
    this.model = this.selectedItemKeys[0];
    this.model.SelectedRoles = this.SelectedRoles(this.selectedItemKeys[0].RoleIds).map(x => x.Name);
  }

  search($event) {
    const ser = $event.value;
    if ($event.value == null) {
      this.isAdUser = false;
      this.model = this.initModel();
      this.valGroup.instance.reset();
    } else {
      if ($event.value.length > 3) {
        this.isAdUser = true;
      } else {
        this.isAdUser = false;
      }
    }

    if (ser && ser.length >= 3) {
      this.service.getAll('Account/ADSearch', '?Search=' + ser).subscribe(
        data => {
          const response = <any>data;
          this.searchResult = response;
        },
        err => {
        }
      );
    }
  }

  onItemClick($event) {
    this.model.FullName = $event.itemData.firstName + ' ' + $event.itemData.lastName;
    this.model.Name = $event.itemData.userid;
  }

  cancel() {
    this.model.SelectedRoles = [];
    this.addInputSourcePopop = false;
    this.model = this.initModel();
    this.valGroup.instance.reset();
    this.varuser = '';
    this.isAdUser = false;
    this.searchResult = null;
    this.users$().subscribe(resp => this.users = resp);
  }

  Cancel() {
    this.valGroups.instance.reset();
    this.openEditorPopUp = false;
    this.models = this.initModels();
    this.resetCheckAll();
    this.roles$().subscribe(resp => this.roles = resp);
  }

  onSelectionChanged(event) {
    this.selectedItemKeys = event.selectedRowKeys;
    if (event.selectedRowsData.length > 0) {
      if (this.selectedItemKeys[0].Id == 1) {
        if (this.loggedinUserCode == 1) {
          this.deleteBtn = false;
          this.editBtn = true;
          this.addBtn = false;
        }
        else {
          this.deleteBtn = false;
          this.editBtn = false;
          this.addBtn = false;
        }
      }
      else {
        this.deleteBtn = false;
        this.editBtn = true;
        this.addBtn = false;
      }
    }
    else {
      this.deleteBtn = false;
      this.editBtn = false;
      this.addBtn = true;
    }
    if (event.selectedRowsData.length > 1) {
      var b = event.selectedRowsData.filter(x => x.Id == 1);
      if (b.length == 0) {
        var a = this.selectedItemKeys.length;
        for (var i = 0; i < a - 1; i++) {
          if ((this.selectedItemKeys[i].IsActive) != (this.selectedItemKeys[i + 1].IsActive)) {
            this.deleteBtn = false;
            this.editBtn = false;
            this.addBtn = false;
            return;
          }
          else {
            this.deleteBtn = true;
            this.editBtn = false;
            this.addBtn = false;
            if (this.selectedItemKeys[0].IsActive == true) {
              this.roletext = "Deactivate";
              this.userstatus = "Deactivate Role";
              this.userstatuss = "Do you want to deactivate selected Roles?";
            }
            else {
              this.roletext = "Activate";
              this.userstatus = "Activate Role";
              this.userstatuss = "Do you want to activate selected Roles?";
            }
          }
        }
      }
      else {
        this.deleteBtn = false;
        this.editBtn = false;
        this.addBtn = false;
      }
    }
  }

  onSelectionChangedUser(event) {
    this.selectedItemKeys = event.selectedRowKeys;
    if (event.selectedRowsData.length > 0) {
      if (this.selectedItemKeys[0].Id == 1) {
        this.deleteBtn = false;
        this.editBtn = false;
        this.addBtn = false;
      }
      else if ((this.selectedItemKeys[0].Id != 1) && (this.selectedItemKeys[0].Id == this.loggedinUserCode)) {
        this.deleteBtn = false;
        this.editBtn = false;
        this.addBtn = false;
      }
      else {
        this.deleteBtn = false;
        this.editBtn = true;
        this.addBtn = false;
      }
    }
    else {
      this.deleteBtn = false;
      this.editBtn = false;
      this.addBtn = true;
    }
    if (event.selectedRowsData.length > 1) {
      var b = event.selectedRowsData.filter(x => x.Id == 1 || x.Id == this.loggedinUserCode);
      if (b.length == 0) {
        var a = this.selectedItemKeys.length;
        for (var i = 0; i < a - 1; i++) {
          if ((this.selectedItemKeys[i].IsEnabled) != (this.selectedItemKeys[i + 1].IsEnabled)) {
            this.deleteBtn = false;
            this.editBtn = false;
            this.addBtn = false;
            return;
          }
          else {
            this.deleteBtn = true;
            this.editBtn = false;
            this.addBtn = false;
            if (this.selectedItemKeys[0].IsEnabled == true) {
              this.usertext = "Deactivate";
              this.userstatus = "Deactivate User";
              this.userstatuss = "Do you want to deactivate selected Users?";
            }
            else {
              this.usertext = "Activate";
              this.userstatus = "Activate User";
              this.userstatuss = "Do you want to activate selected Users?";
            }
          }
        }
      }
      else {
        this.deleteBtn = false;
        this.editBtn = false;
        this.addBtn = false;
      }
    }
  }

  isUserActive(isActive: string) {
    if (isActive == 'Active') {
      return true;
    } else {
      return false;
    }
  }

}

export class LDAPUsers {
  firstName: string;
  lastName: string;
  userid: string;
  EmailId: string;
  MobileNo: string;
}
