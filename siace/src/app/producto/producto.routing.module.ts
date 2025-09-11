import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoListComponent } from './producto-list/producto-list.component';
import { ProductoEditComponent } from './producto-edit/producto-edit.component';

export const PRODUCTO_ROUTES: Routes = [
  {
    path: '',
    component: ProductoListComponent
  },
  {
    path: ':id',
    component: ProductoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PRODUCTO_ROUTES)],
   exports: [RouterModule]
})
export class ProductoRoutingModule { }