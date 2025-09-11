import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasaCuotaListComponent } from './tasa-cuota-list/tasa-cuota-list.component';
import { TasaCuotaEditComponent } from './tasa-cuota-edit/tasa-cuota-edit.component';

export const TASA_CUOTA_ROUTES: Routes = [
  {
    path: '',
    component: TasaCuotaListComponent
  },
  {
    path: ':id',
    component: TasaCuotaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(TASA_CUOTA_ROUTES)],
   exports: [RouterModule]
})
export class TasaCuotaRoutingModule { }