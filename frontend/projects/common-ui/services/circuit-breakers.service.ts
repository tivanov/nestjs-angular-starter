import { Injectable } from '@angular/core';
import {
  CircuitBreakerDto,
  GetCircuitBreakersQuery,
  PagedListDto,
} from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class CircuitBreakersService extends BaseApiService {
  public get(
    query: GetCircuitBreakersQuery,
  ): Observable<PagedListDto<CircuitBreakerDto>> {
    return this.http.get<PagedListDto<CircuitBreakerDto>>(
      `${this.env.apiUrl}/circuit-breakers`,
      {
        params: this.queryToParams(query),
      },
    );
  }

  getOne(id: string): Observable<CircuitBreakerDto> {
    return this.http.get<CircuitBreakerDto>(
      `${this.env.apiUrl}/circuit-breakers/${id}`,
    );
  }

  reset(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.env.apiUrl}/circuit-breakers/${id}/reset`,
      {},
    );
  }

  open(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.env.apiUrl}/circuit-breakers/${id}/open`,
      {},
    );
  }

  setNextAttemptTime(id: string, nextAttemptTime: Date): Observable<void> {
    return this.http.post<void>(
      `${this.env.apiUrl}/circuit-breakers/${id}/set-next-attempt-time`,
      { nextAttemptTime },
    );
  }
}
