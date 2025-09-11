import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RespuestaA3Component } from './respuesta-a3.component';

export const EVIDENCIA_ROUTES: Routes = [
  {
    path: '',
    component: RespuestaA3Component
  }
];

@NgModule({
   imports: [RouterModule.forChild(EVIDENCIA_ROUTES)],
   exports: [RouterModule]
})
export class RespuestaA3RoutingModule { }
