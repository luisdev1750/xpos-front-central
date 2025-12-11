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

import { PromocionListComponent} from './promocion-list/promocion-list.component';
import { PromocionEditComponent } from './promocion-edit/promocion-edit.component';


import { PromocionService } from './promocion.service';
import { PromocionObsequioRoutingModule } from './promocion.routing.module';
import { SucursalService } from '../sucursal/sucursal.service';
import { TipoPromocionService } from '../tipo-promocion/tipo-promocion.service';
import { TipoPagoService } from '../tipo-pago/tipo-pago.service';
import { TipoSubpagoService } from '../tipo-subpago/tipo-subpago.service';
import { MatSelect } from '@angular/material/select';
import { PromocionDetalleService } from '../promocion-detalle/promocion-detalle.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BancoService } from '../banco/banco.service';
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
    PromocionObsequioRoutingModule,
    MatSelect,
    MatOption,
    MatTooltipModule,
    MatPaginatorModule
  ],
  declarations: [      
    PromocionListComponent,
    PromocionEditComponent
  ],
  providers: [PromocionService, SucursalService, TipoPromocionService, TipoPagoService, TipoSubpagoService, PromocionDetalleService, BancoService],
  exports: []
})
export class PromocionModule { }
