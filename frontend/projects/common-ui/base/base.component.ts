import { Component, OnDestroy, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
    template: '',
    standalone: true
})
export class BaseComponent implements OnDestroy {
  public fullDateFormat = 'dd.MM.yyyy HH:mm:ss';

  public ngUnsubscribe = new Subject<void>();
  public dataLoaded: boolean;
  public componentsLoaded: boolean;
  public subscriptions: Subscription[];

  public constructor() {
    this.dataLoaded = false;
    this.componentsLoaded = false;
    this.subscriptions = [];
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subscriptions?.forEach(s => s.unsubscribe());
  }

  private extractErrorMessage(error) {
    var msg = '';
    if (error.error && error.error.message) {
      msg = error.error.message;
    } else if (error.status && error.status === 404) {
      msg = error.statusText;
    } else if (error.message) {
      msg = error.message;
    } else {
      msg = 'An unknown error has occured.';
    }
    return msg;
  }
}
