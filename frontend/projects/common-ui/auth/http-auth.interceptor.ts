import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';
import { AuthSignal, updateAuth } from './auth.signal';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    if (request.url.includes('auth/refresh')) {
      request = injectRefreshToken(request);
      return next(request);
    }

    let token = AuthSignal().token;

    if (token) {
      request = injectToken(request);
    }

    return next(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request, next);
      }
      return throwError(() => error);
    }));
  }

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    const refreshToken = AuthSignal().refreshToken;

    if (!refreshToken) {
      return next(request);
    }

    const authService = inject(AuthService);

    return authService.refresh().pipe(
      switchMap(data => {
        const token = data.token;
        const oldVal = AuthSignal();
        oldVal.token = token;
        updateAuth(oldVal);
        return next(injectToken(request));
      })
    );
  }

const injectToken = (request: HttpRequest<any>): HttpRequest<any> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthSignal().token}`
      }
    });
  }

const injectRefreshToken = (request: HttpRequest<any>): HttpRequest<any> => {
    return request.clone({
      setHeaders: {
        'X-Auth-Refresh-Token': `${AuthSignal().refreshToken}`
      }
    });
  }
