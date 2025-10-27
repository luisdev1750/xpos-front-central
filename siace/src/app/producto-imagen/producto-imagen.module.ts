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

import { ProductoImagenListComponent } from './producto-imagen-list/producto-imagen-list.component';
import { ProductoImagenEditComponent } from './producto-imagen-edit/producto-imagen-edit.component';
import { ProductoImagenService } from './producto-imagen.service';
import { ProductoImagenRoutingModule } from './producto-imagen.routing.module';
import { ProductoService } from '../producto/producto.service';
import { ProductoImagenBusquedaComponent } from './producto-imagen-busqueda/producto-imagen-busqueda.component';
import { MatSelect } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

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
    MatSelect, 
    MatOption,
    MatAutocompleteModule,
     ReactiveFormsModule,
     MatTooltipModule,
     MatChipsModule
     
  ],
  declarations: [
    ProductoImagenListComponent,
    ProductoImagenEditComponent,
    ProductoImagenBusquedaComponent
  ],
  providers: [ProductoImagenService, ProductoService],
  exports: []
})
export class ProductoImagenModule { }
