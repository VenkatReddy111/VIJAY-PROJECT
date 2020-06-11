import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private pageTitle = new BehaviorSubject<string>('App title');
  private pageTitle$ = this.pageTitle.asObservable();

  constructor() { }


  setPageHeading(title: string) {
    setTimeout(() => {
      this.pageTitle.next(title);
    }, 1);
  }

  getPageHeading(): Observable<string> {
    return this.pageTitle$;
  }
}
