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

import { CuentaBancariaListComponent } from './cuenta-bancaria-list/cuenta-bancaria-list.component';
import { CuentaBancariaEditComponent } from './cuenta-bancaria-edit/cuenta-bancaria-edit.component';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { CuentaBancariaRoutingModule } from './cuenta-bancaria.routing.module';
import { SucursalService } from '../sucursal/sucursal.service';
import { BancoService } from '../banco/banco.service';
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
    CuentaBancariaRoutingModule,
    MatSelect,
    MatOption
  ],
  declarations: [
    CuentaBancariaListComponent,
    CuentaBancariaEditComponent
  ],
  providers: [CuentaBancariaService, SucursalService, BancoService],
  exports: []
})
export class CuentaBancariaModule { }
