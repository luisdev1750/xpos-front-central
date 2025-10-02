import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComboListComponent } from './combo-list/combo-list.component';
import { ComboEditComponent } from './combo-edit/combo-edit.component';

export const BANCO_ROUTES: Routes = [
  {
    path: '',
    component: ComboListComponent
  },
  {
    path: ':id',
    component: ComboEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(BANCO_ROUTES)],
   exports: [RouterModule]
})
export class BancoRoutingModule { }