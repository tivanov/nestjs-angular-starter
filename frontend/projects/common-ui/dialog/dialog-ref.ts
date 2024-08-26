import { Observable, Subject } from 'rxjs';

export class DialogRef {
  close(result?: any): void {
    this._afterClosed.next(result);
  }

  private readonly _afterClosed = new Subject<any>();

  afterClosed: Observable<any> = this._afterClosed.asObservable();
}
