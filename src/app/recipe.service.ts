import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipes/recipe.model';
import { Ingredient } from './shared/ingredient.model';
import { ShoppingListService } from './shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>()
  recipeSelected = new Subject<Recipe>()
  // private recipes : Recipe[] =[
  //   new Recipe("Test Recipe", "This is a simple Recipe", "https://www.fukuya.com/upload/save_image/i0911_1.jpg", [
  //     new Ingredient('Meet', 1),
  //     new Ingredient('French Fires', 20)
  //   ]),
  //   new Recipe("Test another Recipe", "This is a simple Recipe", "https://www.fukuya.com/upload/save_image/i0911_1.jpg", [
  //     new Ingredient('Pork', 1),
  //     new Ingredient('Tomato', 5)
  //   ]),
  // ]
  private recipes: Recipe[] =[];

  constructor(private slService: ShoppingListService) {}
  getRecipes() {
      return this.recipes.slice()
  }

  getRecipe(id: number) {
    return this.recipes[id]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients)
    this.recipesChanged.next(this.recipes.slice());
  }

  addRecpie(newRecpie: Recipe) {
    console.log('add recipe');
    this.recipes.push(newRecpie);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}