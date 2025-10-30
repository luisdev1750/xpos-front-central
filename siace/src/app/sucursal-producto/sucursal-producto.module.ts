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

import { SucursalProductoListComponent } from './sucursal-producto-list/sucursal-producto-list.component';
import { SucursalProductoEditComponent } from './sucursal-producto-edit/sucursal-producto-edit.component';
import { SucursalProductoService } from './sucursal-producto.service';
import { SucursalProductoRoutingModule } from './sucursal-producto.routing.module';
import { SucursalService } from '../sucursal/sucursal.service';
import { MatSelect } from '@angular/material/select';
import { ListaPrecioService } from '../lista-precio/lista-precio.service';
import { SucursalProductoBusquedaComponent } from './sucursal-producto-busqueda/sucursal-producto-busqueda.component';
import { ProductoService } from '../producto/producto.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
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
    SucursalProductoRoutingModule,
    MatSelect,
    MatOption,
    MatTooltipModule,
    MatPaginator
  ],
  declarations: [
    SucursalProductoListComponent,
    SucursalProductoEditComponent,
    SucursalProductoBusquedaComponent,
  ],
  providers: [
    SucursalProductoService,
    SucursalService,
    ListaPrecioService,
    ProductoService,
  ],
  exports: [],
})
export class SucursalProductoModule {}
