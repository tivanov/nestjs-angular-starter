import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';

export interface CreateUsersCommand {
    userName: string,
    password: string,
    role: string
}

export interface CreateUsersResponseData {
    _id: string,
    userName: string,
    role: string,
    creator: string,
    settings: string
}

@Injectable({ providedIn: 'root' })

export class UsersService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(page: number, limit: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users?page=${page}&limit=${limit}`);
    }

    getOne(id: string | null) {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    delete(id: string) {
        return this.http.delete<User>(`${this.apiUrl}/users/${id}`);
    }

    update(userId: string, command: CreateUsersCommand): Observable<CreateUsersResponseData> {
        const updateGamesUrl = `${this.apiUrl}/users/${userId}`;

        return this.http.put<CreateUsersResponseData>(updateGamesUrl, command).pipe();
    }

    create(command: CreateUsersCommand): Observable<CreateUsersResponseData> {
        const createUsersUrl = `${this.apiUrl}/users`

        return this.http.post<CreateUsersResponseData>(createUsersUrl, command);
    }

}