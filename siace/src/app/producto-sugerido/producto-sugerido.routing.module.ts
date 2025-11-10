import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoSugeridoListComponent } from './producto-sugerido-list/producto-sugerido-list.component';

import { ProductoEditComponent } from '../producto/producto-edit/producto-edit.component';

export const BANCO_ROUTES: Routes = [
  {
    path: '',
    component: ProductoSugeridoListComponent
  },
  {
    path: ':id',
    component: ProductoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(BANCO_ROUTES)],
   exports: [RouterModule]
})
export class BancoRoutingModule { }