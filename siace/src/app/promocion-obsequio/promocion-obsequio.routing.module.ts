import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionObsequioListComponent } from './promocion-obsequio-list/promocion-obsequio-list.component';
import { PromocionObsequioEditComponent } from './promocion-obsequio-edit/promocion-obsequio-edit.component';

export const PROMOCION_OBSEQUIO_ROUTES: Routes = [
  {
    path: '',
    component: PromocionObsequioListComponent
  },
  {
    path: ':id',
    component: PromocionObsequioListComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PROMOCION_OBSEQUIO_ROUTES)],
   exports: [RouterModule]
})
export class PromocionObsequioRoutingModule { }