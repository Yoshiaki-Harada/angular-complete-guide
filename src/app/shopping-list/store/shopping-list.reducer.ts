import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomates', 5),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1,
};

export const shoppintListReducer = (
    state = initialState,
    action: ShoppingListActions.ShoppingListActions): State => {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state, ingredients: [...state.ingredients, (action as ShoppingListActions.AddIngredient).payload
                ]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return { ...state, ingredients: [...state.ingredients, ...action.payload] };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updateIngredient = {
                ...ingredient,
                ...(action as ShoppingListActions.UpdateIngredient).payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updateIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, index) => index !== state.editedIngredientIndex)
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: (action as ShoppingListActions.StartEdit).payload,
                editedIngredient:
                {
                    ...state.ingredients[(action as ShoppingListActions.StartEdit).payload]
                }
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
};
