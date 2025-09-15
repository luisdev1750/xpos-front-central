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

import { ProductoImagenListComponent } from './producto-imagen-list/producto-imagen-list.component';
import { ProductoImagenEditComponent } from './producto-imagen-edit/producto-imagen-edit.component';
import { ProductoImagenService } from './producto-imagen.service';
import { ProductoImagenRoutingModule } from './producto-imagen.routing.module';

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
    ProductoImagenRoutingModule,
  ],
  declarations: [
    ProductoImagenListComponent,
    ProductoImagenEditComponent
  ],
  providers: [ProductoImagenService],
  exports: []
})
export class ProductoImagenModule { }
