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

import { ProductoSugeridoListComponent } from './producto-sugerido-list/producto-sugerido-list.component';
import { ProductoSugeridoEditComponent } from './producto-sugerido-edit/producto-sugerido-edit.component';
import { ProductoSugeridoService } from './producto-sugerido.service';
import { BancoRoutingModule } from './producto-sugerido.routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SucursalService } from '../sucursal/sucursal.service';

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
    MatTooltipModule,
    MatPaginator,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  declarations: [ProductoSugeridoListComponent, ProductoSugeridoEditComponent],
  providers: [ProductoSugeridoService, SucursalService],
  exports: [],
})
export class ProductoSugeridoModule {}
