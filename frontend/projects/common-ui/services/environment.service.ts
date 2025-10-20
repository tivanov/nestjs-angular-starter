import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  public apiUrl = '';
  public environment = '';

  constructor() {}
}
