import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliaListComponent } from './familia-list/familia-list.component';
import { FamiliaEditComponent } from './familia-edit/familia-edit.component';

export const FAMILIA_ROUTES: Routes = [
  {
    path: '',
    component: FamiliaListComponent
  },
  {
    path: ':id',
    component: FamiliaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(FAMILIA_ROUTES)],
   exports: [RouterModule]
})
export class FamiliaRoutingModule { }