import { NgModule } from '@angular/core';
import { CommonModule, Time } from '@angular/common';

export class User {
  Id;
  Name;
  Password;
  FullName;
  EmailId;
  MobileNo;
  IsEnabled;
  IsExpired;
  LastLogin;
  DutyFrom: Date;
  DutyTo : Date;
  ProfileImage;
  RoleIds;
  RoleName;
  UserType;
  SelectedRoles=[];
  IsAduser;
  constructor(Id, Name, Password, FullName, EmailId, MobileNo, IsEnabled, IsExpired,
      LastLogin, DutyFrom, DutyTo, ProfileImage, RoleIds, RoleName, UserType,IsAduser) {
      this.Id = Id;
      this.Name = Name;
      this.Password = Password,
      this.FullName = FullName;
      this.EmailId= EmailId,
      this.MobileNo= MobileNo,
      this.IsEnabled = IsEnabled,
      this.IsExpired = IsExpired,
      this.LastLogin = LastLogin,
      this.DutyFrom=  DutyFrom,
      this.DutyTo =  DutyTo,
      this.ProfileImage= ProfileImage,
      this.RoleIds=RoleIds,
      this.RoleName= RoleName;
      this.UserType = UserType,
     this.IsAduser=IsAduser
  }

}

