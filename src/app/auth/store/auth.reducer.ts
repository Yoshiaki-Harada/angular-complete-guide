import { User } from '../user.model';
import { Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { sample } from 'rxjs/operators';

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState = {
    user: null,
    authError: null,
    loading: false
};

export const authReducer = (state: State = initialState, action: AuthActions.AuthActions): State => {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        case AuthActions.AUATHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false,
            };
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };
        default:
            return state;
    }
};
