import { Actions } from '@ngrx/effects';
import { createReducer, on } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.action';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

const reducer = createReducer(
    initialState,
    on(RecipesActions.setRecipes, (state, action) => ({
        ...state,
        recipes:[...action.recipes]
    })),
    on(RecipesActions.addRecipe, (state, action) => ({
        ...state,
        recipes: [...state.recipes, action.recipe]
    }))
)

export const recipeReducer = (state: State = initialState, action: RecipesActions.RecipesActions) => {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };
            const updateRecipes = [...state.recipes];
            updateRecipes[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updateRecipes
            };
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => index !== action.payload)
            };
        default:
            return state;
    }
};

