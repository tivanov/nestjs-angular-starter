import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertDto, GetAlertsQuery, PagedListDto } from '@app/contracts';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

  public get(query: GetAlertsQuery): Observable<PagedListDto<AlertDto>> {
    const params = {};
    const queryKeys = Object.keys(query);
    queryKeys.forEach((key) => {
      if (query[key]) {
        params[key] = query[key];
      }
    });
    return this.http.get<PagedListDto<AlertDto>>(`${this.env.apiUrl}/alerts`, {
      params,
    });
  }

  public dismiss(id: string): Observable<AlertDto> {
    return this.http.patch<AlertDto>(
      `${this.env.apiUrl}/alerts/${id}/dismiss`,
      {}
    );
  }
}
