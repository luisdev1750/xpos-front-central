import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentacionListComponent } from './presentacion-list/presentacion-list.component';
import { PresentacionEditComponent } from './presentacion-edit/presentacion-edit.component';

export const PRESENTACION_ROUTES: Routes = [
  {
    path: '',
    component: PresentacionListComponent
  },
  {
    path: ':id',
    component: PresentacionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PRESENTACION_ROUTES)],
   exports: [RouterModule]
})
export class PresentacionRoutingModule { }