import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorEditComponent } from './proveedor-edit/proveedor-edit.component';

export const PROVEEDOR_ROUTES: Routes = [
  {
    path: '',
    component: ProveedorListComponent
  },
  {
    path: ':id',
    component: ProveedorEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PROVEEDOR_ROUTES)],
   exports: [RouterModule]
})
export class ProveedorRoutingModule { }