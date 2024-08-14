import { UserRoleEnum } from '@app/contracts';
import { AuthSignal } from './../auth/auth.signal';
import { Component, LOCALE_ID, OnDestroy, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
  template: '',
  standalone: true,
})
export class BaseComponent implements OnDestroy {
  AuthSignal = AuthSignal;

  UserRoleEnum = UserRoleEnum;

  public fullDateFormat = 'dd.MM.yyyy HH:mm:ss';
  public inputDateTimeFormat = 'yyyy-MM-ddTHH:mm';

  public ngUnsubscribe = new Subject<void>();
  public dataLoaded = false;
  public componentsLoaded = false;
  public subscriptions: Subscription[] = [];
  public locale: string;

  private defaultLocale = inject(LOCALE_ID);

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subscriptions?.forEach((s) => s.unsubscribe());
  }

  protected extractErrorMessage(error) {
    var msg = '';
    if (error.error && error.error.message) {
      msg = error.error.message;
    } else if (error.error && error.error.code) {
      msg = error.error.code;
    } else if (error.status && error.status === 404) {
      msg = error.statusText;
    } else if (error.message) {
      msg = error.message;
    } else {
      msg = 'An unknown error has occured.';
    }
    return msg;
  }

  get window() {
    return window as any;
  }

  private getUsersLocale(): string {
    if (
      typeof window === 'undefined' ||
      typeof window.navigator === 'undefined'
    ) {
      return this.defaultLocale;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : this.defaultLocale;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }
}
