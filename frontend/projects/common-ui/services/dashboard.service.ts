import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  public getUsersTiles() {
    const params = new HttpParams();
    return this.http.get<any>(`${this.env.apiUrl}/dashboard/users-tiles`, {
      params,
    });
  }

  public getLoginRecordsByDevice() {
    const params = new HttpParams();
    return this.http.get<any[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-device`,
      {
        params,
      }
    );
  }

  public getLoginRecordsByCountry() {
    const params = new HttpParams();
    return this.http.get<any[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-country`,
      {
        params,
      }
    );
  }
}
