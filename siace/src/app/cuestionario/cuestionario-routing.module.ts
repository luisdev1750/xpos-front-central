import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreguntasListComponent } from './preguntas-list/preguntas-list.component';
import { ResultsComponent } from './results/results.component';
import { BuscarContestacionesComponent } from '../monitor/monitor.component';
import { RegistroEmprendedorComponent } from '../emprendedor/registro-emprendedor/registro-emprendedor.component';

export const routes: Routes = [
  { path: '', component: BuscarContestacionesComponent},
  { path: ':id', component: PreguntasListComponent },
  { path: ':id/result', component: ResultsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuestionarioRoutingModule { }  
