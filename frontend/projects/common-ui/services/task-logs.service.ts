import { Injectable } from '@angular/core';
import { GetTaskLogsQuery, PagedListDto, TaskLogDto } from '@app/contracts';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';

@Injectable({ providedIn: 'root' })
export class TaskLogsService extends BaseApiService {
  public get(query: GetTaskLogsQuery): Observable<PagedListDto<TaskLogDto>> {
    return this.http.get<PagedListDto<TaskLogDto>>(
      `${this.env.apiUrl}/task-logs`,
      { params: this.queryToParams(query) }
    );
  }

  public getById(id: string): Observable<TaskLogDto> {
    return this.http.get<TaskLogDto>(`${this.env.apiUrl}/task-logs/${id}`);
  }
}
