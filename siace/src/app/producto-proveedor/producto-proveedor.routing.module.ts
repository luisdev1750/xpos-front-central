import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoProveedorListComponent } from './producto-proveedor-list/producto-proveedor-list.component';
import { ProductoProveedorEditComponent } from './producto-proveedor-edit/producto-proveedor-edit.component';

export const PRODUCTO_PROVEEDOR_ROUTES: Routes = [
  {
    path: '',
    component: ProductoProveedorListComponent
  },
  {
    path: ':id',
    component: ProductoProveedorEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PRODUCTO_PROVEEDOR_ROUTES)],
   exports: [RouterModule]
})
export class ProductoProveedorRoutingModule { }