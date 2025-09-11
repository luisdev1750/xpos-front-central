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

import { SucursalConfigListComponent } from './sucursal-config-list/sucursal-config-list.component';
import { SucursalConfigEditComponent } from './sucursal-config-edit/sucursal-config-edit.component';
import { SucursalConfigService } from './sucursal-config.service';
import { SucursalConfigRoutingModule } from './sucursal-config.routing.module';

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
    SucursalConfigRoutingModule,
  ],
  declarations: [
    SucursalConfigListComponent,
    SucursalConfigEditComponent
  ],
  providers: [SucursalConfigService],
  exports: []
})
export class SucursalConfigModule { }
