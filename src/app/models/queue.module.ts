import { NgModule } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
 



export class Server {
  queueHeaderID: number;
  serverName: string;
  domain: string;
  userName: string;
  password: string;
  queuename: string;
  publisherName :string;
  ModuleID:number;
  isDefault: boolean;
  isActive: boolean;
 
  
  constructor(id, serverName, domain, userName, password,queuename,publisherName, ModuleID,isDefault,isActive) {
  
    this.queueHeaderID =id;
    this.serverName = serverName;
    this.domain = domain;
    this.userName = userName; 
    this.password = password;
    this.queuename = queuename;
    this.publisherName = publisherName;
    this.ModuleID=ModuleID,
    this.isDefault = isDefault;
    this.isActive = isActive; 


  }
}
 
export class QueueModel {
  queueHeaderID :number
  queueName: number;
  publisherSubscriberName: number; 
  publisherID: number;
  subscriberID: number;
  queueDetailID: number;
  

  constructor(queueHeaderID,queueName,publisherSubscriberName, publisherID,
    subscriberID,queueDetailID) {

      this.queueHeaderID =queueHeaderID;
    this.queueName = queueName;
    this.publisherSubscriberName=publisherSubscriberName;
    this.publisherID = publisherID;
    this.subscriberID = subscriberID;
    this.queueDetailID = queueDetailID;
    
   
  }
}


export class Queue {
  serverName: string;
  userName:string;
  password:string;
  queueNameFeild:any[];
  queueconnection:any[];
  id:number;
  isDefault: boolean;
  isActive: boolean;

  
  constructor(serverName,userName,password,queueNameFeild,queueconnection,id,isDefault,isActive) {
    this.serverName = serverName;
    this.userName = userName;
    this.password = password;
    this.queueNameFeild=queueNameFeild;
    this.queueconnection=queueconnection;
    this.id=id;
    this.isDefault = isDefault;
    this.isActive = isActive; 

  }
}
 

