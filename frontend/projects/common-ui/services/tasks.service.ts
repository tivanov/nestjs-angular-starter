import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import {
  CreateTaskCommand,
  GetTasksQuery,
  TaskDto,
  UpdateTaskCommand,
} from '@app/contracts';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {}

  get(query: GetTasksQuery): Observable<TaskDto[]> {
    const params = {};

    for (const name in query) {
      if (
        query[name] !== undefined &&
        query[name] !== null &&
        query[name] !== ''
      ) {
        params[name] = query[name];
      }
    }

    return this.http.get<TaskDto[]>(`${this.env.apiUrl}/tasks`, { params });
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
}
