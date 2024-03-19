import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';
import { AuthSignal, updateAuth } from './auth.signal';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('auth/refresh')) {
      request = HttpAuthInterceptor.injectRefreshToken(request);
      return next.handle(request);
    }

    let token = AuthSignal().token;

    if (token) {
      request = HttpAuthInterceptor.injectToken(request);
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      }
      return throwError(() => error);
    }));
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = AuthSignal().refreshToken;

    if (!refreshToken) {
      return next.handle(request);
    }

    return this.authService.refresh().pipe(
      switchMap(data => {
        const token = data.token;
        const oldVal = AuthSignal();
        oldVal.token = token;
        updateAuth(oldVal);
        return next.handle(HttpAuthInterceptor.injectToken(request));
      })
    );
  }

  private static injectToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthSignal().token}`
      }
    });
  }

  private static injectRefreshToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'X-Auth-Refresh-Token': `${AuthSignal().refreshToken}`
      }
    });
  }
}
