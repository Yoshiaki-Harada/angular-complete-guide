import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Recipe } from './recipes/recipe.model';
import * as fromApp from './store/app.reducer';
import * as RecipeActions from './recipes/store/recipe.action';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]>{
    constructor(private store: Store<fromApp.AppState>, private actions$: Actions) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        // return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => recipesState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
                } else {
                    return of(recipes);
                }
            })
        );
    }
}
