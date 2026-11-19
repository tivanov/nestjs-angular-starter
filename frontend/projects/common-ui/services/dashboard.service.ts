import { Injectable } from '@angular/core';
import { LoginRecordsSummaryDto, UsersTilesDto } from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  public getUsersTiles(): Observable<UsersTilesDto> {
    return this.http.get<UsersTilesDto>(
      `${this.env.apiUrl}/dashboard/users-tiles`,
    );
  }

  public getLoginRecordsByDevice(): Observable<LoginRecordsSummaryDto[]> {
    return this.http.get<LoginRecordsSummaryDto[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-device`,
    );
  }

  public getLoginRecordsByCountry(): Observable<LoginRecordsSummaryDto[]> {
    return this.http.get<LoginRecordsSummaryDto[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-country`,
    );
  }
}
