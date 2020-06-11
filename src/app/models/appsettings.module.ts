import { Injectable } from '@angular/core';
import { CommonModule, Time } from '@angular/common';


export class AppSettings  {
    id: number;
    settingName: string;
    settingValue: string;
    valueType: string;
    settingHeader: string;
    settingLabel: string;
    settingOrder: string;
    lastUpdateBy: number;
    lastUpdateDate: Date;
    

  constructor(id,  SettingName , SettingValue, ValueType,
    SettingHeader, SettingLabel, SettingOrder, LastUpdateBy, LastUpdateDate) {
       
    this.id = id;
    this.settingName = SettingName;
    this.settingValue = SettingValue;

    this.valueType = ValueType;
    this.settingHeader = SettingHeader;
    this.settingLabel = SettingLabel;
    this.settingOrder = SettingOrder;
    this.lastUpdateBy = LastUpdateBy;
    this.lastUpdateDate = LastUpdateDate;

  }
}



export class AppSettingsField  {
  id: number;
  settingName: string;
  settingValue: string;
  valueType: string;
  settingHeader: string;
  settingLabel: string;
  settingOrder: string;
  
  

constructor(id,  SettingName , SettingValue, ValueType,
  SettingHeader, SettingLabel, SettingOrder ) {
     
  this.id = id;
  this.settingName = SettingName;
  this.settingValue = SettingValue;

  this.valueType = ValueType;
  this.settingHeader = SettingHeader;
  this.settingLabel = SettingLabel;
  this.settingOrder = SettingOrder;
   

}
}
