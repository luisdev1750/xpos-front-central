import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { BannerListComponent } from './banner-list/banner-list.component';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerService } from './banner.service';
import { SucursalService } from '../sucursal/sucursal.service';
import { BannerRoutingModule } from './banner-routing.module';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { ImagePreviewComponent } from './banner-edit/image-preview/image-preview.component';
import { MatPaginator } from '@angular/material/paginator';
import { BannerCopyDialogComponent } from './banner-copy/banner-copy-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    BannerRoutingModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginator
  ],
  declarations: [
    BannerListComponent,
    BannerEditComponent,
    ImagePreviewComponent,
    BannerCopyDialogComponent
  ],
  providers: [BannerService, SucursalService],
  exports: [],
})
export class BannerModule {}
