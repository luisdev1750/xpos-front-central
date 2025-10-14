import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ComboService } from './combo.service';
import { BancoRoutingModule } from './combo.routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ComboListComponent } from './combo-list/combo-list.component';
import { ComboEditComponent } from './combo-edit/combo-edit.component';
import { SucursalService } from '../sucursal/sucursal.service';
import { ListaPrecioService } from '../lista-precio/lista-precio.service';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { ProductoService } from '../producto/producto.service';
import { MatTooltipModule } from '@angular/material/tooltip';
/*
  MatOption,
    ReactiveFormsModule,
    MatAutocomplete, 
    MatAutocompleteModule,
    MatSelect
*/

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
    BancoRoutingModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocomplete,
    MatAutocompleteModule,
    MatSelect,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  declarations: [ComboListComponent, ComboEditComponent],
  providers: [
    ComboService,
    SucursalService,
    ListaPrecioService,
    ProductoService,
    SucursalService,
  ],
  exports: [],
})
export class ComboModule {}
