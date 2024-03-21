import { Injectable, signal } from "@angular/core";
import { User } from "../models/user.model";
import { environment } from "../../environments/environment.development"
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

export interface AuthResponseData {
    token: string,
    refreshToken: string,
    user: User
}

export interface UserLoginCommand {
    userName: string,
    password: string,
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = environment.apiUrl;

    currentUserSig = signal<User | undefined | null>(undefined);

    constructor(private http: HttpClient, private router: Router) { }

    login(command: UserLoginCommand) {
        const loginUrl = `${this.apiUrl}/auth/login`

        return this.http.post<AuthResponseData>(loginUrl, command);
    }

    logout() {
        console.log('logout');
        localStorage.setItem('token', '');
        this.currentUserSig.set(null);
        this.router.navigate(['./auth']);
    }
}


