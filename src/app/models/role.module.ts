import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



export class Role {
  Id: number; Name: string;  IsActive:boolean; RoleTypeId : number; LastUpdateDate:string; permissions: Permission[] = []; lastUpdateBy:number;
  
  constructor(Id, Name,  IsActive: boolean,LastUpdateDate,RoleTypId,permissions,lastUpdateBy) {
      this.Id = Id;
      this.Name = Name;
      this.IsActive = IsActive;
      this.RoleTypeId=RoleTypId;
      this.LastUpdateDate = LastUpdateDate
      this.permissions = permissions;
      this.lastUpdateBy=lastUpdateBy;
  }
}

export class Permission {
  Id; Name; add; update; delete; view;DisplayName;
  constructor(Id, Name, _add, _update, _delete, _view,_displayName) {
      this.Id = Id;
      this.Name = Name;
      this.add = _add;
      this.update = _update;
      this.delete = _delete;
      this.view = _view;
      this.DisplayName=_displayName;
  }
}
