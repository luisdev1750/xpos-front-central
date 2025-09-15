import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaBancariaListComponent } from './cuenta-bancaria-list/cuenta-bancaria-list.component';
import { CuentaBancariaEditComponent } from './cuenta-bancaria-edit/cuenta-bancaria-edit.component';

export const CUENTA_BANCARIA_ROUTES: Routes = [
  {
    path: '',
    component: CuentaBancariaListComponent
  },
  {
    path: ':id',
    component: CuentaBancariaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(CUENTA_BANCARIA_ROUTES)],
   exports: [RouterModule]
})
export class CuentaBancariaRoutingModule { }