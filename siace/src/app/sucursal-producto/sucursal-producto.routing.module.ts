import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalProductoListComponent } from './sucursal-producto-list/sucursal-producto-list.component';
import { SucursalProductoEditComponent } from './sucursal-producto-edit/sucursal-producto-edit.component';

export const SUCURSAL_PRODUCTO_ROUTES: Routes = [
  {
    path: '',
    component: SucursalProductoListComponent
  },
  {
    path: ':id',
    component: SucursalProductoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SUCURSAL_PRODUCTO_ROUTES)],
   exports: [RouterModule]
})
export class SucursalProductoRoutingModule { }