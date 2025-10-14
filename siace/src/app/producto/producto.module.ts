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

import { ProductoListComponent } from './producto-list/producto-list.component';
import { ProductoEditComponent } from './producto-edit/producto-edit.component';
import { ProductoService } from './producto.service';
import { ProductoRoutingModule } from './producto.routing.module';
import { PresentacionService } from '../presentacion/presentacion.service';
import { FamiliaService } from '../familia/familia.service';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    ProductoRoutingModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  declarations: [
    ProductoListComponent,
    ProductoEditComponent
  ],
  providers: [ProductoService, PresentacionService, FamiliaService],
  exports: []
})
export class ProductoModule { }
