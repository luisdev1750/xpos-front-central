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

import { SucursalProdStockListComponent } from './sucursal-prod-stock-list/sucursal-prod-stock-list.component';
import { SucursalProdStockEditComponent } from './sucursal-prod-stock-edit/sucursal-prod-stock-edit.component';
import { SucursalProdStockService } from './sucursal-prod-stock.service';
import { SucursalProdStockRoutingModule } from './sucursal-prod-stock.routing.module';
import { SucursalService } from '../sucursal/sucursal.service';
import { ProductoService } from '../producto/producto.service';
import { MatSelect } from '@angular/material/select';

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
    SucursalProdStockRoutingModule,
    MatSelect,
    MatOption
  ],
  declarations: [
    SucursalProdStockListComponent,
    SucursalProdStockEditComponent,
  ],
  providers: [SucursalProdStockService, SucursalService, ProductoService],
  exports: [],
})
export class SucursalProdStockModule {}
