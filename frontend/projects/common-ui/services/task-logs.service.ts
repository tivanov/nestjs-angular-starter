import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetTaskLogsQuery, PagedListDto, TaskLogDto } from '@app/contracts';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class TaskLogsService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

  public get(query: GetTaskLogsQuery): Observable<PagedListDto<TaskLogDto>> {
    let params = new HttpParams();
    for (const key in query) {
      if (query[key]) {
        params = params.set(key, query[key]);
      }
    }

    return this.http.get<PagedListDto<TaskLogDto>>(
      `${this.env.apiUrl}/task-logs`,
      { params }
    );
  }

  public getById(id: string): Observable<TaskLogDto> {
    return this.http.get<TaskLogDto>(`${this.env.apiUrl}/task-logs/${id}`);
  }
}
