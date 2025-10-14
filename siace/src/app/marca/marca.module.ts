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

import { MarcaListComponent } from './marca-list/marca-list.component';
import { MarcaEditComponent } from './marca-edit/marca-edit.component';
import { MarcaService } from './marca.service';
import { MarcaRoutingModule } from './marca.routing.module';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';


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
    MarcaRoutingModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule
  ],
  declarations: [
    MarcaListComponent,
    MarcaEditComponent
  ],
  providers: [MarcaService],
  exports: []
})
export class MarcaModule { }
