import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoAspectoListComponent } from './tipo-aspecto-list/tipo-aspecto-list.component';
import { TipoAspectoEditComponent } from './tipo-aspecto-edit/tipo-aspecto-edit.component';

export const TIPO_ASPECTO_ROUTES: Routes = [
  {
    path: '',
    component: TipoAspectoListComponent
  },
  {
    path: ':id',
    component: TipoAspectoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(TIPO_ASPECTO_ROUTES)],
   exports: [RouterModule]
})
export class TipoAspectoRoutingModule { }