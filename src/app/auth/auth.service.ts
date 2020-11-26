import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from './user.model';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private store: Store<fromApp.AppState>) { }

    logout(): void {
        this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
