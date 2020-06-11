import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class SmtpconfigurationModule {
    id: number;
    smtpserver: string;
    port: number;
    isSsl: boolean;
    userName: string;
    password: string;
    isDefault: boolean;
    fileAttachLimit: number;
    alertEmailId: string;
    displayName: string;
    fromMailId: string;
    constructor(id, smtpserver, port, isSsl, userName, password, isDefault, fileAttachLimit, alertEmailId, displayName, fromMailId) {
        this.id = id;
        this.smtpserver = smtpserver,
        this.port = port,
        this.isSsl = isSsl,
        this.userName = userName,
        this.password = password,
        this.isDefault = isDefault,
        this.fileAttachLimit = fileAttachLimit,
        this.alertEmailId = alertEmailId,
        this.displayName = displayName,
        this.fromMailId = fromMailId;
    }

 }
