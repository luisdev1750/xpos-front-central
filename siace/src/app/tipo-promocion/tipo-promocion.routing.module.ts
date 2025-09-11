import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoPromocionListComponent } from './tipo-promocion-list/tipo-promocion-list.component';
import { TipoPromocionEditComponent } from './tipo-promocion-edit/tipo-promocion-edit.component';

export const TIPO_PROMOCION_ROUTES: Routes = [
  {
    path: '',
    component: TipoPromocionListComponent
  },
  {
    path: ':id',
    component: TipoPromocionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(TIPO_PROMOCION_ROUTES)],
   exports: [RouterModule]
})
export class TipoPromocionRoutingModule { }