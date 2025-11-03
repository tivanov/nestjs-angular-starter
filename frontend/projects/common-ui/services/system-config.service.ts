import { Injectable } from '@angular/core';
import { BaseApiService } from '../base/base-api.service';
import { SystemConfigDto } from '@app/contracts';

@Injectable({ providedIn: 'root' })
export class SystemConfigService extends BaseApiService {
  get() {
    return this.http.get<SystemConfigDto>(`${this.env.apiUrl}/system-config`);
  }
}
