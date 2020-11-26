import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShopplingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShopplingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    console.log('call onSubmit');
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      // this.slServie.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(
        new ShopplingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.slServie.addIngredient(newIngredient)
      this.store.dispatch(new ShopplingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShopplingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShopplingListActions.DeleteIngredient());
    this.onClear();
  }
}
