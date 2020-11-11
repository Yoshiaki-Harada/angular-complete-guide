import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiredIn: string;
    localId: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }
    sinUp(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(' https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBfr-E9RYND56BjO7rQq2P5O3Ukk7SZFPY',
            {
                email,
                password,
                returnSecureToken: true
            });
    }
}