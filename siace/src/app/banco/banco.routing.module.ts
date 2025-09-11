import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BancoListComponent } from './banco-list/banco-list.component';
import { BancoEditComponent } from './banco-edit/banco-edit.component';

export const BANCO_ROUTES: Routes = [
  {
    path: '',
    component: BancoListComponent
  },
  {
    path: ':id',
    component: BancoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(BANCO_ROUTES)],
   exports: [RouterModule]
})
export class BancoRoutingModule { }