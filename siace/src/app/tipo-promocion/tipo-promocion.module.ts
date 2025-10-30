import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { TipoPromocionListComponent } from './tipo-promocion-list/tipo-promocion-list.component';
import { TipoPromocionEditComponent } from './tipo-promocion-edit/tipo-promocion-edit.component';
import { TipoPromocionService } from './tipo-promocion.service';
import { TipoPromocionRoutingModule } from './tipo-promocion.routing.module';
import { MatSelectModule } from '@angular/material/select';
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
    TipoPromocionRoutingModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatPaginator
  ],
  declarations: [TipoPromocionListComponent, TipoPromocionEditComponent],
  providers: [TipoPromocionService],
  exports: [],
})
export class TipoPromocionModule {}
