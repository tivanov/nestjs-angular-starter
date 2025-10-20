import { Injectable } from '@angular/core';
import {
  ContactRequestDto,
  GetContactRequestQuery,
  PagedListDto,
} from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class ContactRequestsService extends BaseApiService {
  public get(
    query: GetContactRequestQuery,
  ): Observable<PagedListDto<ContactRequestDto>> {
    return this.http.get<PagedListDto<ContactRequestDto>>(
      `${this.env.apiUrl}/contact-request`,
      {
        params: this.queryToParams(query),
      },
    );
  }

  getOne(id: string): Observable<ContactRequestDto> {
    return this.http.get<ContactRequestDto>(
      `${this.env.apiUrl}/contact-request/${id}`,
    );
  }

  markAsRead(id: string): Observable<ContactRequestDto> {
    return this.http.patch<ContactRequestDto>(
      `${this.env.apiUrl}/contact-request/${id}/mark-as-read`,
      {},
    );
  }
}
