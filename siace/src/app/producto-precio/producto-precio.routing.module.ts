import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoPrecioListComponent } from './producto-precio-list/producto-precio-list.component';
import { ProductoPrecioEditComponent } from './producto-precio-edit/producto-precio-edit.component';

export const PRODUCTO_PRECIO_ROUTES: Routes = [
  {
    path: '',
    component: ProductoPrecioListComponent
  },
  {
    path: ':id',
    component: ProductoPrecioEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PRODUCTO_PRECIO_ROUTES)],
   exports: [RouterModule]
})
export class ProductoPrecioRoutingModule { }