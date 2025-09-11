import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import {
  TableroConsultoresComponent,
} from './tablero-consultores/tablero-consultores.component';


const routes: Routes = [
  {path: '',component:TableroConsultoresComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }
