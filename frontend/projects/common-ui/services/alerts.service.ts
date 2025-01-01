import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertDto, GetAlertsQuery, PagedListDto } from '@app/contracts';
import { EnvironmentService } from './environment.service';
import { BaseService } from '../base/base.service';

@Injectable({ providedIn: 'root' })
export class AlertsService extends BaseService {
  public get(query: GetAlertsQuery): Observable<PagedListDto<AlertDto>> {
    return this.http.get<PagedListDto<AlertDto>>(`${this.env.apiUrl}/alerts`, {
      params: this.queryToParams(query),
    });
  }

  public dismiss(id: string): Observable<AlertDto> {
    return this.http.patch<AlertDto>(
      `${this.env.apiUrl}/alerts/${id}/dismiss`,
      {}
    );
  }
}
