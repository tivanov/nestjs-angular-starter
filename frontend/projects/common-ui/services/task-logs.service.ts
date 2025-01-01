import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetTaskLogsQuery, PagedListDto, TaskLogDto } from '@app/contracts';
import { BaseService } from '../base/base.service';

@Injectable({ providedIn: 'root' })
export class TaskLogsService extends BaseService {
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
