import { Injectable } from '@angular/core';
import { HealthCheckResultDto } from '@app/contracts';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class HealthService extends BaseApiService {
  get() {
    return this.http.get<HealthCheckResultDto>(`${this.env.apiUrl}/health`);
  }
}
