import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetLoginRecordsQuery,
  LoginRecordDto,
  PagedListDto,
} from '@app/contracts';
import { EnvironmentService } from './environment.service';
import { BaseService } from '../base/base.service';

@Injectable({ providedIn: 'root' })
export class LoginRecordsService extends BaseService {
  public get(
    query: GetLoginRecordsQuery
  ): Observable<PagedListDto<LoginRecordDto>> {
    return this.http.get<PagedListDto<LoginRecordDto>>(
      `${this.env.apiUrl}/login-records`,
      { params: this.queryToParams(query) }
    );
  }
}
