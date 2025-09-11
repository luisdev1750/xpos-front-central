import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncuestasListComponent } from './encuestas-list/buscar-encuestas.component'; 

const routes: Routes = [ {path: '', component: EncuestasListComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncuestasRoutingModule { }
