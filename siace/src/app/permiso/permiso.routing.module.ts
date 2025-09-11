import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoListComponent } from './permiso-list/permiso-list.component';

export const GRANT_ROUTES: Routes = [
   {
      path: '',
      component: PermisoListComponent
   }
];


@NgModule({
   imports: [RouterModule.forChild(GRANT_ROUTES)],
   exports: [RouterModule]
})
export class PermisoRoutingModule { } 
