import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as fromAuth from './store/auth.reducer';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
            take(1),
            map((authState: fromAuth.State) => authState.user),
            exhaustMap((user: User) => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
                return next.handle(modifiedReq);
            })
        );
    }
}
