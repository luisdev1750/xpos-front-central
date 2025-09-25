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

import { PromocionObsequioListComponent } from './promocion-obsequio-list/promocion-obsequio-list.component';
import { PromocionObsequioEditComponent } from './promocion-obsequio-edit/promocion-obsequio-edit.component';
import { PromocionObsequioService } from './promocion-obsequio.service';
import { PromocionObsequioRoutingModule } from './promocion-obsequio.routing.module';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductoService } from '../producto/producto.service';

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
    MatAutocomplete,
    MatOption,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  declarations: [
    PromocionObsequioListComponent,
    PromocionObsequioEditComponent
  ],
  providers: [PromocionObsequioService, ProductoService],
  exports: []
})
export class PromocionObsequioModule { }
