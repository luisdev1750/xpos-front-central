import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionListComponent } from './promocion-list/promocion-list.component';
import { PromocionEditComponent} from './promocion-edit/promocion-edit.component';

export const PROMOCION_OBSEQUIO_ROUTES: Routes = [
  {
    path: '',
    component: PromocionListComponent
  },
  {
    path: ':id',
    component: PromocionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PROMOCION_OBSEQUIO_ROUTES)],
   exports: [RouterModule]
})
export class PromocionObsequioRoutingModule { }