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

import { VersionListComponent } from './version-list/version-list.component';
import { VersionEditComponent } from './version-edit/version-edit.component';
import { VersionService } from './version.service';
import { VersionRoutingModule } from './version.routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { ActividadModule } from '../actividad/actividad.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
	  MatDialogModule,
    MatCardModule,
    VersionRoutingModule,
    MatCheckboxModule,
    MatTabsModule,
    ActividadModule,
    MatPaginatorModule
  ],
  declarations: [
    VersionListComponent,
    VersionEditComponent
  ],
  providers: [VersionService],
  exports: []
})
export class VersionModule { }
