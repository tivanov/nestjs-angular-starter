import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  public getUsersTiles() {
    let params = new HttpParams();
    return this.http.get<any>(`${this.env.apiUrl}/dashboard/users-tiles`, {
      params,
    });
  }

  public getLoginRecordsByDevice() {
    let params = new HttpParams();
    return this.http.get<any[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-device`,
      {
        params,
      }
    );
  }

  public getLoginRecordsByCountry() {
    let params = new HttpParams();
    return this.http.get<any[]>(
      `${this.env.apiUrl}/dashboard/login-records-by-country`,
      {
        params,
      }
    );
  }
}
