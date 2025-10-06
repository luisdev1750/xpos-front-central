import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerListComponent } from './banner-list/banner-list.component';
import { BannerEditComponent } from './banner-edit/banner-edit.component';

const routes: Routes = [
  { path: '', component: BannerListComponent }, // 👈 ruta base de Banner
  { path: ':id', component: BannerEditComponent }, // 👈 ruta para listar Banner s
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannerRoutingModule {}
