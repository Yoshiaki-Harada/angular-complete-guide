import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as shoppingListActioins from './store/shopping-list.action';
import * as fromAppState from '../store/app.reducer';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private igChangeSub: Subscription
  constructor(
    private store: Store<fromAppState.AppState>
  ) { }
  ngOnDestroy(): void {
    // this.igChangeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new shoppingListActioins.StartEdit(index));
  }
}
