import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';
import {
  Component,
  LOCALE_ID,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import {
  Constants,
  IdentityProviderEnum,
  TaskTypeEnum,
  UserRoleEnum,
} from '@app/contracts';
import { Subject, Subscription } from 'rxjs';
import { AuthSignal } from '../auth/auth.signal';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
})
export class BaseComponent implements OnDestroy {
  AuthSignal = AuthSignal;
  UserRoleEnum = UserRoleEnum;
  IdentityProviderEnum = IdentityProviderEnum;
  TaskTypeEnum = TaskTypeEnum;

  isNaN = isNaN;
  Constants = Constants;

  public readonly fullDateFormat = 'dd.MM.yyyy HH:mm:ss';
  public readonly inputDateTimeFormat = 'yyyy-MM-ddTHH:mm';
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly ngUnsubscribe = new Subject<void>();
  public readonly dataLoaded = signal(true);
  public componentsLoaded = false;
  public subscriptions: Subscription[] = [];
  public locale: string;
  protected breakpointObserver = inject(BreakpointObserver);

  protected readonly navigator: Navigator = navigator;

  public defaultPrimaryColor = '#cd7c9e';
  // public defaultSecondaryColor = '#0a0f43';
  public readonly defaultSecondaryColor = signal(
    'linear-gradient(90deg, rgba(1,1,47,1) 0%, rgba(52,0,103,1) 100%)'
  );

  private defaultLocale = inject(LOCALE_ID);
  readonly environment = inject(EnvironmentService);

  public constructor() {
    this.locale = this.getUsersLocale();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subscriptions?.forEach?.((s) => {
      s.unsubscribe();
    });
  }

  private handsetMatches = toSignal(
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.Small,
    ]),
    {
      initialValue: {
        matches: false,
        breakpoints: {
          [Breakpoints.HandsetPortrait]: false,
          [Breakpoints.HandsetLandscape]: false,
          [Breakpoints.Small]: false,
        },
      },
    }
  );

  readonly isMobile = computed(() => this.handsetMatches().matches);

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

  get window() {
    return window as any;
  }

  get isFirefox() {
    // @ts-ignore
    return typeof InstallTrigger !== 'undefined';
  }

  get isSafari() {
    const ua = this.window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    const desktopSafari =
      /constructor/i.test(this.window.HTMLElement) ||
      (function (p) {
        return p.toString() === '[object SafariRemoteNotification]';
        // @ts-ignore
      })(!this.window.safari || safari.pushNotification);

    return iOSSafari || desktopSafari;
  }

  private getUsersLocale(): string {
    if (
      typeof this.window === 'undefined' ||
      typeof this.window.navigator === 'undefined'
    ) {
      return this.defaultLocale;
    }
    const wn = this.window.navigator;
    let lang = wn.languages ? wn.languages[0] : this.defaultLocale;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }

  protected toDateInputFormat(date?: Date | string): string {
    let local = new Date();
    if (date) {
      local = new Date(date);
    }

    return formatDate(local, this.inputDateTimeFormat, 'en');
  }

  protected toTimeInputFormat(date?: Date | string): string {
    let local = new Date();
    if (date) {
      local = new Date(date);
    }

    return formatDate(local, 'HH:mm', 'en');
  }

  protected copyToClipboard(value: string) {
    void this.navigator.clipboard.writeText(value || '');
  }

  downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type: type });

    if (this.window.navigator.msSaveOrOpenBlob) {
      this.window.navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  promiseWithTimeout<T>(
    promise: Promise<T>,
    ms: number,
    timeoutError = new Error('Promise timed out')
  ): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(timeoutError);
      }, ms);
    });

    // returns a race between timeout and the passed promise
    return Promise.race<T>([promise, timeout]);
  }
}
