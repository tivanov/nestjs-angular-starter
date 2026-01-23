import { UserDto } from '@app/contracts';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';

export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface ISignInResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private env: EnvironmentService) {
  }

  login(credentials: ILoginCredentials): Observable<ISignInResponse> {
    return this.http.post<ISignInResponse>(`${this.env.apiUrl}/auth/login`, credentials);
  }

  refresh(): Observable<ISignInResponse> {
    return this.http.post<ISignInResponse>(`${this.env.apiUrl}/auth/refresh`, null);
  }
}
