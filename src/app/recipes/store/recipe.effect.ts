import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as RecipesActions from './recipe.action';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.action$.pipe(
        ofType(RecipesActions.FECTH_RECIPES),
        switchMap(
            () => this.http.get<Recipe[]>('https://ng-cource-recipe-book-5a0c4.firebaseio.com/recipes.json')
        ),
        map(recipes => recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }))),
        map(recipes => new RecipesActions.SetRecipes(recipes))
    );

    @Effect()
    storeRecipes = this.action$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => this.http.put(
            'https://ng-cource-recipe-book-5a0c4.firebaseio.com/recipes.json',
            recipesState.recipes
        ))
    );
    constructor(private action$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}
