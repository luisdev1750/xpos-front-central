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

import { ProductoProveedorListComponent } from './producto-proveedor-list/producto-proveedor-list.component';
import { ProductoProveedorEditComponent } from './producto-proveedor-edit/producto-proveedor-edit.component';
import { ProductoProveedorService } from './producto-proveedor.service';
import { ProductoProveedorRoutingModule } from './producto-proveedor.routing.module';

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
    ProductoProveedorRoutingModule,
  ],
  declarations: [
    ProductoProveedorListComponent,
    ProductoProveedorEditComponent
  ],
  providers: [ProductoProveedorService],
  exports: []
})
export class ProductoProveedorModule { }
