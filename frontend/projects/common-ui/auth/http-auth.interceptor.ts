import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { EnvironmentService } from '../services/environment.service';
import { AuthSignal, logOut, updateAuth } from './auth.signal';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (request.url.includes('auth/refresh')) {
    request = injectRefreshToken(request);
    return next(request);
  }

  const token = AuthSignal().token;

  if (!token) {
    return next(request);
  }

  const environment = inject(EnvironmentService);

  const url = request.url;
  const isApiUrl = url.startsWith(environment.apiUrl);

  if (!isApiUrl) {
    return next(request);
  }

  request = injectToken(request);

  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // TODO: code should be TOKEN_EXPIRED, check before running the refresh token
        const refreshToken = AuthSignal().refreshToken;

        if (!refreshToken) {
          return next(request);
        }

        return authService.refresh().pipe(
          switchMap((data) => {
            const token = data.token;
            const oldVal = AuthSignal();
            oldVal.token = token;
            updateAuth(oldVal);
            return next(injectToken(request));
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              logOut();
              void router.navigate(['/auth/login']);
            }
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

const injectToken = (request: HttpRequest<any>): HttpRequest<any> => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${AuthSignal().token}`,
    },
  });
};

const injectRefreshToken = (request: HttpRequest<any>): HttpRequest<any> => {
  return request.clone({
    setHeaders: {
      'X-Auth-Refresh-Token': `${AuthSignal().refreshToken}`,
    },
  });
};
