import {
  CreateUserCommand,
  GetUsersQuery,
  PagedListDto,
  UserDto,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
} from '@app/contracts';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

  public get(query: GetUsersQuery): Observable<PagedListDto<UserDto>> {
    const params = {};
    const queryKeys = Object.keys(query);
    queryKeys.forEach((key) => {
      if (query[key]) {
        params[key] = query[key];
      }
    });

    return this.http.get<PagedListDto<UserDto>>(`${this.env.apiUrl}/users`, {
      params: params as any,
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
}
