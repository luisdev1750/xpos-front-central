import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoImagenListComponent } from './producto-imagen-list/producto-imagen-list.component';
import { ProductoImagenEditComponent } from './producto-imagen-edit/producto-imagen-edit.component';

export const PRODUCTO_IMAGEN_ROUTES: Routes = [
  {
    path: '',
    component: ProductoImagenListComponent
  },
  {
    path: ':id',
    component: ProductoImagenEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PRODUCTO_IMAGEN_ROUTES)],
   exports: [RouterModule]
})
export class ProductoImagenRoutingModule { }