import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetLoginRecordsQuery,
  LoginRecordDto,
  PagedListDto,
} from '@app/contracts';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class LoginRecordsService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

  public get(
    query: GetLoginRecordsQuery
  ): Observable<PagedListDto<LoginRecordDto>> {
    const params = {};
    const queryKeys = Object.keys(query);
    queryKeys.forEach((key) => {
      if (query[key]) {
        params[key] = query[key];
      }
    });
    return this.http.get<PagedListDto<LoginRecordDto>>(
      `${this.env.apiUrl}/login-records`,
      { params }
    );
  }
}
