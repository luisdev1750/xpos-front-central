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

import { TipoAspectoListComponent } from './tipo-aspecto-list/tipo-aspecto-list.component';
import { TipoAspectoEditComponent } from './tipo-aspecto-edit/tipo-aspecto-edit.component';
import { TipoAspectoService } from './tipo-aspecto.service';
import { TipoAspectoRoutingModule } from './tipo-aspecto.routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    TipoAspectoRoutingModule,
    MatPaginatorModule,

  ],
  declarations: [
    TipoAspectoListComponent,
    TipoAspectoEditComponent
  ],
  providers: [TipoAspectoService],
  exports: []
})
export class TipoAspectoModule { }
