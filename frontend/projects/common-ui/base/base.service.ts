import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';

export class BaseService {
  protected readonly http = inject(HttpClient);
  protected readonly env = inject(EnvironmentService);

  protected queryToParams(query: any): HttpParams {
    let params = new HttpParams();

    for (const name in query) {
      const val = query[name];

      if (val === undefined || val === null || val === '') {
        continue;
      }

      if (Array.isArray(val)) {
        for (const item of val) {
          if (item !== undefined && item !== null && item !== '') {
            params = params.append(`${name}[]`, item);
          }
        }
      } else {
        params = params.set(name, val);
      }
    }

    return params;
  }
}
