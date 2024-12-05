import { Component, LOCALE_ID, OnDestroy, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthSignal } from '../auth/auth.signal';
import { Constants, UserRoleEnum, IdentityProviderEnum } from '@app/contracts';
import { formatDate } from '@angular/common';

@Component({
  template: '',
  standalone: true,
})
export class BaseComponent implements OnDestroy {
  AuthSignal = AuthSignal;
  UserRoleEnum = UserRoleEnum;
  IdentityProviderEnum = IdentityProviderEnum;
  Constants = Constants;

  public readonly fullDateFormat = 'dd.MM.yyyy HH:mm:ss';
  public readonly inputDateTimeFormat = 'yyyy-MM-ddTHH:mm';
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ngUnsubscribe = new Subject<void>();
  public dataLoaded: boolean = false;
  public componentsLoaded: boolean = false;
  public subscriptions: Subscription[] = [];
  public locale: string;

  protected readonly navigator: Navigator = navigator;

  private defaultLocale = inject(LOCALE_ID);

  public constructor() {
    this.locale = this.getUsersLocale();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subscriptions?.forEach((s) => s.unsubscribe());
  }

  protected extractErrorMessage(error) {
    var msg = '';
    if (error.error && error.error.message) {
      if (Array.isArray(error.error.message)) {
        msg = error.error.message.join(', ');
      } else {
        msg = error.error.message;
      }
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

  get isFirefox() {
    // @ts-ignore
    return typeof InstallTrigger !== 'undefined';
  }

  get isSafari() {
    return (
      /constructor/i.test(this.window.HTMLElement) ||
      (function (p) {
        return p.toString() === '[object SafariRemoteNotification]';
        // @ts-ignore
      })(!this.window['safari'] || safari.pushNotification)
    );
  }

  private getUsersLocale(): string {
    if (
      typeof this.window === 'undefined' ||
      typeof this.window.navigator === 'undefined'
    ) {
      return this.defaultLocale;
    }
    const wn = this.window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : this.defaultLocale;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }

  protected round(num: number, fractionDigits: number = 2): number {
    return Number(num.toFixed(fractionDigits));
  }

  protected toDateInputFormat(date?: Date | string): string {
    let local = new Date();
    if (date) {
      local = new Date(date);
    }

    return formatDate(local, this.inputDateTimeFormat, 'en');
  }

  protected copyToClipboard(value: string) {
    this.navigator.clipboard.writeText(value || '');
  }

  protected toTitleCase(str: string) {
    return (
      str
        ?.toLowerCase()
        .split(' ')
        .map((word: any) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ') || ''
    );
  }
}
