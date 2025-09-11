import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthGuardService as AuthGuard } from '../auth/auth-guard';
import {
  EmprendedorEditComponent,
} from './emprendedor-edit/emprendedor-edit.component';
import {
  EmprendedorListComponent,
} from './emprendedor-list/emprendedor-list.component';
import {
  RegistroEmprendedorComponent,
} from './registro-emprendedor/registro-emprendedor.component';


export const EMPRENDEDOR_ROUTES: Routes = [
  {
    path: 'registro',
    component: RegistroEmprendedorComponent
  },
  {
    path: '',
    component: EmprendedorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: EmprendedorEditComponent
  }, 
  
];

@NgModule({
   imports: [RouterModule.forChild(EMPRENDEDOR_ROUTES)],
   exports: [RouterModule]
})
export class EmprendedorRoutingModule { }