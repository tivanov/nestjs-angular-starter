import { Injectable } from '@angular/core';
import {
  CreateTaskCommand,
  GetTasksQuery,
  PagedListDto,
  TaskDto,
  UpdateTaskCommand,
} from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends BaseApiService {
  get(query: GetTasksQuery): Observable<PagedListDto<TaskDto>> {
    return this.http.get<PagedListDto<TaskDto>>(`${this.env.apiUrl}/tasks`, {
      params: this.queryToParams(query),
    });
  }

  getOne(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.env.apiUrl}/tasks/${id}`);
  }

  start(id: string): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/tasks/${id}/start`, {});
  }

  stop(id: string): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/tasks/${id}/stop`, {});
  }

  create(command: CreateTaskCommand): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${this.env.apiUrl}/tasks`, command);
  }

  update(id: string, command: UpdateTaskCommand): Observable<TaskDto> {
    return this.http.patch<TaskDto>(`${this.env.apiUrl}/tasks/${id}`, command);
  }

  delete(id: string): Observable<TaskDto> {
    return this.http.delete<TaskDto>(`${this.env.apiUrl}/tasks/${id}`);
  }

  getStatus(id: string): Observable<{ isFinished: boolean }> {
    return this.http.get<{ isFinished: boolean }>(
      `${this.env.apiUrl}/tasks/${id}/status`
    );
  }
}
