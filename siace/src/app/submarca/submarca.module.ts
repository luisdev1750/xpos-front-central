import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { SubmarcaListComponent } from './submarca-list/submarca-list.component';
import { SubmarcaEditComponent } from './submarca-edit/submarca-edit.component';
import { SubmarcaService } from './submarca.service';
import { SubmarcaRoutingModule } from './submarca.routing.module';
import { MarcaService } from '../marca/marca.service';
import { MatSelect } from "@angular/material/select";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
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
    SubmarcaRoutingModule,
    MatSelect,
    MatSelectModule,
    MatOptionModule
],
  declarations: [
    SubmarcaListComponent,
    SubmarcaEditComponent
  ],
  providers: [SubmarcaService, MarcaService],
  exports: []
})
export class SubmarcaModule { }
