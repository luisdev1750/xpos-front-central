import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuloListComponent } from './modulo-list/module-list.component';
import { ModuloEditComponent } from './modulo-edit/modulo-edit.component';

export const MODULE_ROUTES: Routes = [
  {
    path: '',
    component: ModuloListComponent
  },
  {
    path: ':id',
    component: ModuloEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(MODULE_ROUTES)],
   exports: [RouterModule]
})
export class ModuloRoutingModule { }