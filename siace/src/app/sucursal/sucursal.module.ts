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

import { SucursalListComponent } from './sucursal-list/sucursal-list.component';
import { SucursalEditComponent } from './sucursal-edit/sucursal-edit.component';
import { SucursalService } from './sucursal.service';
import { SucursalRoutingModule } from './sucursal.routing.module';
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
    SucursalRoutingModule,
    MatSelect,
    MatOption
  ],
  declarations: [
    SucursalListComponent,
    SucursalEditComponent
  ],
  providers: [SucursalService],
  exports: []
})
export class SucursalModule { }
