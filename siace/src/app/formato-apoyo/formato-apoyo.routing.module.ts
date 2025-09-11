import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormatoApoyoListComponent } from './formato-apoyo-list/formato-apoyo-list.component';
import { FormatoApoyoEditComponent } from './formato-apoyo-edit/formato-apoyo-edit.component';

export const FORMATO_APOYO_ROUTES: Routes = [
  {
    path: '',
    component: FormatoApoyoListComponent
  },
  {
    path: ':id',
    component: FormatoApoyoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(FORMATO_APOYO_ROUTES)],
   exports: [RouterModule]
})
export class FormatoApoyoRoutingModule { }