import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import {
  EvidenciaEditComponent,
} from './evidencia-edit/evidencia-edit.component';
import {
  EvidenciaListComponent,
} from './evidencia-list/evidencia-list.component';


export const EVIDENCIA_ROUTES: Routes = [
  {
    path: '',
    component: EvidenciaListComponent
  },
  {
    path: ':id',
    component: EvidenciaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(EVIDENCIA_ROUTES)],
   exports: [RouterModule]
})
export class EvidenciaRoutingModule { }