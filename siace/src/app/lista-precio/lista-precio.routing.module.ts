import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPrecioListComponent } from './lista-precio-list/lista-precio-list.component';
import { ListaPrecioEditComponent } from './lista-precio-edit/lista-precio-edit.component';

export const LISTA_PRECIO_ROUTES: Routes = [
  {
    path: '',
    component: ListaPrecioListComponent
  },
  {
    path: ':id',
    component: ListaPrecioEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(LISTA_PRECIO_ROUTES)],
   exports: [RouterModule]
})
export class ListaPrecioRoutingModule { }