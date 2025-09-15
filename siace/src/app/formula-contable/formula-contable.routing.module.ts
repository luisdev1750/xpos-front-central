import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormulaContableListComponent } from './formula-contable-list/formula-contable-list.component';
import { FormulaContableEditComponent } from './formula-contable-edit/formula-contable-edit.component';

export const FORMULA_CONTABLE_ROUTES: Routes = [
  {
    path: '',
    component: FormulaContableListComponent
  },
  {
    path: ':id',
    component: FormulaContableEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(FORMULA_CONTABLE_ROUTES)],
   exports: [RouterModule]
})
export class FormulaContableRoutingModule { }