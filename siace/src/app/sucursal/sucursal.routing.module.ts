import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalListComponent } from './sucursal-list/sucursal-list.component';
import { SucursalEditComponent } from './sucursal-edit/sucursal-edit.component';

export const SUCURSAL_ROUTES: Routes = [
  {
    path: '',
    component: SucursalListComponent
  },
  {
    path: ':id',
    component: SucursalEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SUCURSAL_ROUTES)],
   exports: [RouterModule]
})
export class SucursalRoutingModule { }