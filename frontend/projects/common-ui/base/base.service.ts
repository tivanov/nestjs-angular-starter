import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService implements OnDestroy {
  subscriptions: Subscription[] = [];

  protected extractErrorMessage(error: any): string {
    let msg = '';

    if (error.error?.code) {
      msg = error.error.code;
    } else if (error.error?.message) {
      if (Array.isArray(error.error.message)) {
        msg = error.error.message.join(', ');
      } else {
        msg = error.error.message;
      }
    } else if (error.status && error.status === 404) {
      msg = error.statusText;
    } else if (error.message) {
      msg = error.message;
    } else {
      msg = 'An unknown error has occured.';
    }
    return msg;
  }

  public clearSubscriptions(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
    this.subscriptions.length = 0;
  }

  public ngOnDestroy(): void {
    this.clearSubscriptions();
  }
}
