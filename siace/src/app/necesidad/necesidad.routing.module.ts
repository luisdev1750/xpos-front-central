import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NecesidadListComponent } from './necesidad-list/necesidad-list.component';
import { NecesidadEditComponent } from './necesidad-edit/necesidad-edit.component';

export const NECESIDAD_ROUTES: Routes = [
  {
    path: '',
    component: NecesidadListComponent
  },
  {
    path: ':id',
    component: NecesidadEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(NECESIDAD_ROUTES)],
   exports: [RouterModule]
})
export class NecesidadRoutingModule { }