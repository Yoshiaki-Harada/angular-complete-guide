import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { asyncScheduler, of, pipe, scheduled } from 'rxjs';
import { catchError, map, mergeMap, single, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}
const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
        redirect: true,
    });
};

const handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = 'An unkown error occurred';
    console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    };
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSinup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        mergeMap((signupActions: AuthActions.SignupStart) =>
            this.http
                .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                    {
                        email: signupActions.payload.email,
                        password: signupActions.payload.password,
                        returnSecurityToken: true
                    })
                .pipe(
                    tap(
                        (resData: AuthResponseData) => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }
                    ),
                    map((resData: AuthResponseData) => handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken)
                    ),
                    catchError((errorRes: HttpErrorResponse) => handleError(errorRes)))
        )
    );
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) =>
            this.http
                .post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    map((resData: AuthResponseData) => handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken)
                    ),
                    catchError((errorRes: HttpErrorResponse) => handleError(errorRes)))
        ));
    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessActions: AuthActions.AuthenticateSuccess) => {
            if (authSuccessActions.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                tokenData: string;
                tokenExpirationDateData: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            };
            const loadedUser = new User(userData.email, userData.id, userData.tokenData, new Date(userData.tokenExpirationDateData));
            if (loadedUser.token) {
                const expirationDuration = new Date(userData.tokenExpirationDateData).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData.tokenExpirationDateData),
                    redirect: false,
                });
            }
            return { type: 'DUMMY' };
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            console.log('logout');
            this.router.navigate(['/auth']);
        }));

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
