import {
  CreateUserCommand,
  GetUsersQuery,
  PagedListDto,
  UserDto,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
} from '@app/contracts';
import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
  public get(query: GetUsersQuery): Observable<PagedListDto<UserDto>> {
    return this.http.get<PagedListDto<UserDto>>(`${this.env.apiUrl}/users`, {
      params: this.queryToParams(query),
    });
  }

  public create(command: CreateUserCommand): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.env.apiUrl}/users`, command);
  }

  public updateBasicData(
    userId: string,
    command: UpdateUserDataCommand
  ): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${this.env.apiUrl}/users/${userId}`,
      command
    );
  }

  public getById(userId: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.env.apiUrl}/users/${userId}`);
  }

  public delete(id: string): Observable<UserDto> {
    return this.http.delete<UserDto>(`${this.env.apiUrl}/users/${id}`);
  }

  public changePassword(
    userId: string,
    command: UpdateUserPasswordCommand
  ): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${this.env.apiUrl}/users/${userId}/password`,
      command
    );
  }

  public uploadAvatar(userId: string, file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.put(
      `${this.env.apiUrl}/users/${userId}/avatar`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
