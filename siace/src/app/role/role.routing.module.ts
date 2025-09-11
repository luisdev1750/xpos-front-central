import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

const ROLE_ROUTES: Routes = [
   {
      path: '',
      component: RoleListComponent
   },
   {
      path: ':id',
      component: RoleEditComponent
   }
];


@NgModule({
   imports: [RouterModule.forChild(ROLE_ROUTES)],
   exports: [RouterModule]
})
export class RolesRoutingModule { }
