import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedListDto } from '@app/contracts';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

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
