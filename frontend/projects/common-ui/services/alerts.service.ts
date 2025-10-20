import { Injectable } from '@angular/core';
import { AlertDto, GetAlertsQuery, PagedListDto } from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class AlertsService extends BaseApiService {
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

  public dismissAll(): Observable<undefined> {
    return this.http.patch<undefined>(
      `${this.env.apiUrl}/alerts/dismiss-all`,
      {}
    );
  }
}
