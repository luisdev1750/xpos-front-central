import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionDetalleListComponent } from './promocion-detalle-list/promocion-detalle-list.component';
import { PromocionDetalleEditComponent } from './promocion-detalle-edit/promocion-detalle-edit.component';

export const PROMOCION_DETALLE_ROUTES: Routes = [
  {
    path: '',
    component: PromocionDetalleListComponent
  },
  {
    path: ':id',
    component: PromocionDetalleEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PROMOCION_DETALLE_ROUTES)],
   exports: [RouterModule]
})
export class PromocionDetalleRoutingModule { }