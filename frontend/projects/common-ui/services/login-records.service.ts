import { Injectable } from '@angular/core';
import {
  GetLoginRecordsQuery,
  LoginRecordDto,
  PagedListDto,
} from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class LoginRecordsService extends BaseApiService {
  public get(
    query: GetLoginRecordsQuery
  ): Observable<PagedListDto<LoginRecordDto>> {
    return this.http.get<PagedListDto<LoginRecordDto>>(
      `${this.env.apiUrl}/login-records`,
      { params: this.queryToParams(query) }
    );
  }
}
