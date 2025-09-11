import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VersionListComponent } from './version-list/version-list.component';
import { VersionEditComponent } from './version-edit/version-edit.component';

export const VERSION_ROUTES: Routes = [
  {
    path: '',
    component: VersionListComponent
  },
  {
    path: ':id',
    component: VersionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(VERSION_ROUTES)],
   exports: [RouterModule]
})
export class VersionRoutingModule { }