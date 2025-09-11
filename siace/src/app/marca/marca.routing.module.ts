import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcaListComponent } from './marca-list/marca-list.component';
import { MarcaEditComponent } from './marca-edit/marca-edit.component';

export const MARCA_ROUTES: Routes = [
  {
    path: '',
    component: MarcaListComponent
  },
  {
    path: ':id',
    component: MarcaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(MARCA_ROUTES)],
   exports: [RouterModule]
})
export class MarcaRoutingModule { }