import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelEstudioListComponent } from './nivel-estudio-list/nivel-estudio-list.component';
import { NivelEstudioEditComponent } from './nivel-estudio-edit/nivel-estudio-edit.component';

export const NIVEL_ESTUDIO_ROUTES: Routes = [
  {
    path: '',
    component: NivelEstudioListComponent
  },
  {
    path: ':id',
    component: NivelEstudioEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(NIVEL_ESTUDIO_ROUTES)],
   exports: [RouterModule]
})
export class NivelEstudioRoutingModule { }