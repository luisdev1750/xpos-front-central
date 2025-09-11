import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalConfigListComponent } from './sucursal-config-list/sucursal-config-list.component';
import { SucursalConfigEditComponent } from './sucursal-config-edit/sucursal-config-edit.component';

export const SUCURSAL_CONFIG_ROUTES: Routes = [
  {
    path: '',
    component: SucursalConfigListComponent
  },
  {
    path: ':id',
    component: SucursalConfigEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SUCURSAL_CONFIG_ROUTES)],
   exports: [RouterModule]
})
export class SucursalConfigRoutingModule { }