import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmarcaListComponent } from './submarca-list/submarca-list.component';
import { SubmarcaEditComponent } from './submarca-edit/submarca-edit.component';
import { FamiliaService } from '../familia/familia.service';

export const SUBMARCA_ROUTES: Routes = [
  {
    path: '',
    component: SubmarcaListComponent
  },
  {
    path: ':id',
    component: SubmarcaEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SUBMARCA_ROUTES)],
   exports: [RouterModule],
   providers: [FamiliaService]
})
export class SubmarcaRoutingModule { }