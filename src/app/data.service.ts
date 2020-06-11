import { DxValidatorModule } from 'devextreme-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Role } from './models/role.module';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = environment.apiBaseUrl;
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('/', " ");
  route;

  constructor(private http: HttpClient, private _route: Router) {
    this.route = _route;
  }

  get(path: string, params?: string) {
    params = params == undefined ? "" : params;
    return this.mockData(path);
    // return this.http.get(this.url + path + params)
    //.pipe(map(response => response), catchError(this.handleError));
  }

  getSingle(path: string, params?: string) {
    params = params == undefined ? "" : params;
    return this.http.get(this.baseUrl + path + params)
      .pipe(catchError(this.handleError));
  }

  getAll(path: string, params?: string) {
    
    params = params == undefined ? "" : params;
    return this.http.get(this.baseUrl + path + params)
        .pipe(
          map(
            response => {
               var res: any = response; 
               return response;
            }
            
          ) 
        , catchError(error => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error

          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //window.alert(errorMessage);
        this.route.navigate(['/default-error']);
        return throwError(errorMessage);
      }));
  }
  // getAllold(path: string, params?: string) {
    
  //   params = params == undefined ? "" : params;
  //   return this.http.get(this.baseUrl + path + params)
  //     .pipe(map(response => Object.values(response)), catchError(error => {
  //       let errorMessage = '';
  //       if (error.error instanceof ErrorEvent) {
  //         // client-side error
  //         errorMessage = `Error: ${error.error.message}`;
  //       } else {
  //         // server-side error

  //         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //       }
  //       //window.alert(errorMessage);
  //       this.route.navigate(['/default-error']);
  //       return throwError(errorMessage);
  //     }));
  // }

  postAll(path: string, values: any) {
    var url = this.baseUrl + path;
    return this.http.post(url, values)
      .pipe(map(response => response), catchError(this.handleError));
  }
  
  put(path: string, values: any) {
    return this.http.put(this.baseUrl + path, values)
      .pipe(map(response => (response), catchError(this.handleError)));
  }

  delete(path: string, values: any) {
  
    var url = this.baseUrl + path;
    return this.http.delete(url, values)
      .pipe(map(response => response), catchError(this.handleError));
  }
  
  mockData(mockType) {
    
    switch (mockType) {
    case 'inputsourcetype': {
          var p = [];
          p.push({'id': '123', 'customerName': 'Test Fname', 'isMultiDocInPdf': '1',  'fileFilter': 'Test Name',  'parameterName': '123@hai.com',  'parameterValue': '9167779876', isActive: '1'});
          p.push({'id': '124', 'customerName': 'Test Fname1', 'isMultiDocInPdf': '1',  'fileFilter': 'Test Name1',  'parameterName': '1213@hai.com',  'parameterValue': '9167779876', isActive: '1'});
          p.push({'id': '125', 'customerName': 'Test Fname2', 'isMultiDocInPdf': '1',  'fileFilter': 'Test Name2',  'parameterName': '1214@hai.com',  'parameterValue': '9167779876', isActive: '1'});
          return p;
        }
       
        case 'classes': {
          var p = [];
          p.push({'id': '123', 'name': 'Test Fname', 'Description': 'Test Description', 'Attributes':'Att1, Att2, Att3',  isActive: '1'});
          p.push({'id': '124', 'name': 'Test Fname', 'Description': 'Test Description','Attributes':'Att1, Att2, Att3',  isActive: '1'});
          p.push({'id': '125', 'name': 'Test Fname', 'Description': 'Test Description','Attributes':'Att1, Att2, Att3',  isActive: '1'});
          return p;
        }
        case 'attributes': {
          var p = [];
          p.push({'id': '123', 'name': 'Test Fname', 'Description': 'Test Description'});
          p.push({'id': '124', 'name': 'Test Fname', 'Description': 'Test Description'});
          p.push({'id': '125', 'name': 'Test Fname', 'Description': 'Test Description'});
          return p;
        }
        case 'Vendor': {
          var p = [];
          p.push({'VendorID': '1', 'VendorName': 'Vendor1', 'Customer': 'Customer1', 'CustomerID': '1'});
          p.push({'VendorID': '2', 'VendorName': 'Vendor2', 'Customer': 'Customer2', 'CustomerID': '2'});
          p.push({'VendorID': '3', 'VendorName': 'Vendor3', 'Customer': 'Customer3', 'CustomerID': '3'});
          return p;
        }
        case 'Customer': {
          var p = [];
          p.push({'CustomerID': '1', 'CustCode': 'Cust-01', 'Name': 'Customer1', 'Address': 'andheri east', 'Email' : 'customer1@gmail.com', 'MobileNo' : '8978233233'});
          p.push({'CustomerID': '2', 'CustCode': 'Cust-02', 'Name': 'Customer2', 'Address': 'dadar west', 'Email' : 'customer2@gmail.com', 'MobileNo' : '8978233222'});
          p.push({'CustomerID': '3', 'CustCode': 'Cust-03', 'Name': 'Customer3', 'Address': 'andheri west', 'Email' : 'customer3@gmail.com', 'MobileNo' : '8978234433'});
          return p;
        }
        case 'role-permission': {
          var p = [];
          // p.push(new Role(1, 'None', '', true,'',[] ));
          // p.push(new Role(2, 'Admin', '', true,  '',[] ));
          // p.push(new Role(3, 'Business User', '', true, '',[] ));
          return p;
        }
  
        case 'permissions': {
          var p = [];
          p.push({ 'id': '1', 'name': 'Users' });
          p.push({ 'id': '2', 'name': 'Roles' });
          p.push({ 'id': '3', 'name': 'Products' });
          p.push({ 'id': '4', 'name': 'Modules' });
          p.push({ 'id': '5', 'name': 'Customers' });
          p.push({ 'id': '6', 'name': 'CustomerType' });
          p.push({ 'id': '7', 'name': 'ChannelType' });
          p.push({ 'id': '8', 'name': 'Licenses' });
          p.push({ 'id': '9', 'name': 'Publish' });
          p.push({ 'id': '10', 'name': 'License Type' });
          p.push({ 'id': '11', 'name': 'MIS Reports' });
          p.push({ 'id': '12', 'name': 'Configurations', });
          return p;
        }
      

      
    }
  }

  private handleError(error, caught) {
    
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } 
    else if (error.error != undefined){
      // client-side error
      errorMessage = `Error: ${error.error}`;
    } 
    else{
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  
    return throwError(errorMessage);
  }
  

  getTasks() : Task[] {
    return tasks;
}
}


export class AppError {
  constructor(public originalError?: any) { }
}
export class NotFoundError extends AppError { }
export class StatusCodeError extends AppError {
  constructor(public originalError?: any) {
    super(originalError);
  }
}

export class BadInput extends AppError { }


// ******************************************************************
export class Task {
  id: number;
  text: string
}

let tasks: Task[] = [{ id: 1, text: "Prepare 2016 Financial"},
{ id: 2, text: "Prepare 2016 Marketing Plan"},
{ id: 3, text: "Update Personnel Files"},
{ id: 4, text: "Review Health Insurance Options Under the Affordable Care Act"},
{ id: 5, text: "New Brochures"},
{ id: 6, text: "2016 Brochure Designs"},
{ id: 7, text: "Brochure Design Review"},
{ id: 8, text: "Website Re-Design Plan"},
{ id: 9, text: "Rollout of New Website and Marketing Brochures"},
{ id: 10, text: "Create 2012 Sales Report"}
];