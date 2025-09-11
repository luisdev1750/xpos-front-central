import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NivelListComponent } from './nivel-list/nivel-list.component';
import { NivelEditComponent } from './nivel-edit/nivel-edit.component';

export const NIVEL_ROUTES: Routes = [
  {
    path: '',
    component: NivelListComponent
  },
  {
    path: ':id',
    component: NivelEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(NIVEL_ROUTES)],
   exports: [RouterModule]
})
export class NivelRoutingModule { }