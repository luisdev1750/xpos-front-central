import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalProdStockListComponent } from './sucursal-prod-stock-list/sucursal-prod-stock-list.component';
import { SucursalProdStockEditComponent } from './sucursal-prod-stock-edit/sucursal-prod-stock-edit.component';

export const SUCURSAL_PROD_STOCK_ROUTES: Routes = [
  {
    path: '',
    component: SucursalProdStockListComponent
  },
  {
    path: ':id',
    component: SucursalProdStockEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SUCURSAL_PROD_STOCK_ROUTES)],
   exports: [RouterModule]
})
export class SucursalProdStockRoutingModule { }