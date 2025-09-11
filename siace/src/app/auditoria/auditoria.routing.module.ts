import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriaListComponent } from './auditoria-list/auditoria-list.component';
import { AuditoriaEditComponent } from './auditoria-edit/auditoria-edit.component';

export const AUDITORIA_ROUTES: Routes = [
  {
    path: '',
    component: AuditoriaListComponent
  },
  {
    path: ':id',
    component: AuditoriaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(AUDITORIA_ROUTES)],
   exports: [RouterModule]
})
export class AuditoriaRoutingModule { }