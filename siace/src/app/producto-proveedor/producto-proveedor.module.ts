import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { ProductoProveedorListComponent } from './producto-proveedor-list/producto-proveedor-list.component';
import { ProductoProveedorEditComponent } from './producto-proveedor-edit/producto-proveedor-edit.component';
import { ProductoProveedorService } from './producto-proveedor.service';
import { ProductoProveedorRoutingModule } from './producto-proveedor.routing.module';
import { ProveedorService } from '../proveedor/proveedor.service';
import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductoService } from '../producto/producto.service';

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
    MatSelect,
    MatOption,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteModule,

  ],
  declarations: [
    ProductoProveedorListComponent,
    ProductoProveedorEditComponent
  ],
  providers: [ProductoProveedorService, ProveedorService, ProductoService],
  exports: []
})
export class ProductoProveedorModule { }
