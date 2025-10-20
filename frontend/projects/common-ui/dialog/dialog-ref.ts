import { Observable, Subject } from 'rxjs';

export class DialogRef {
  close(result?: any): void {
    this._beforeClosed.next(result);
    this._afterClosed.next(result);
  }

  private readonly _afterClosed = new Subject<any>();
  private readonly _beforeClosed = new Subject<any>();

  afterClosed: Observable<any> = this._afterClosed.asObservable();
  beforeClosed: Observable<any> = this._beforeClosed.asObservable();
}
