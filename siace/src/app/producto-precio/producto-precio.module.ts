import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { ProductoPrecioListComponent } from './producto-precio-list/producto-precio-list.component';
import { ProductoPrecioEditComponent } from './producto-precio-edit/producto-precio-edit.component';
import { ProductoPrecioService } from './producto-precio.service';
import { ProductoPrecioRoutingModule } from './producto-precio.routing.module';
import { ListaPrecioService } from '../lista-precio/lista-precio.service';
import { MatSelect } from '@angular/material/select';
import { ProductoPrecioBusquedaComponent } from './producto-precio-busqueda/producto-precio-busqueda.component';
import { ProductoService } from '../producto/producto.service';
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
    ProductoPrecioRoutingModule,
    MatSelect,
    MatOption,
    MatTooltipModule,
  ],
  declarations: [
    ProductoPrecioListComponent,
    ProductoPrecioEditComponent,
    ProductoPrecioBusquedaComponent,
  ],
  providers: [ProductoPrecioService, ListaPrecioService, ProductoService],
  exports: [],
})
export class ProductoPrecioModule {}
