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

import { PromocionDetalleListComponent } from './promocion-detalle-list/promocion-detalle-list.component';
import { PromocionDetalleEditComponent } from './promocion-detalle-edit/promocion-detalle-edit.component';
import { PromocionDetalleService } from './promocion-detalle.service';
import { PromocionDetalleRoutingModule } from './promocion-detalle.routing.module';
import { TipoPromocionService } from '../tipo-promocion/tipo-promocion.service';
import { ProductoService } from '../producto/producto.service';
import { FamiliaService } from '../familia/familia.service';

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
    PromocionDetalleRoutingModule,
  ],
  declarations: [PromocionDetalleListComponent, PromocionDetalleEditComponent],
  providers: [
    PromocionDetalleService,
    TipoPromocionService,
    ProductoService,
    FamiliaService,
  ],
  exports: [],
})
export class PromocionDetalleModule {}
