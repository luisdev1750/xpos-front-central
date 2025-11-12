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

import { FormulaContableListComponent } from './formula-contable-list/formula-contable-list.component';
import { FormulaContableEditComponent } from './formula-contable-edit/formula-contable-edit.component';
import { FormulaContableService } from './formula-contable.service';
import { FormulaContableRoutingModule } from './formula-contable.routing.module';
import { SucursalService } from '../sucursal/sucursal.service';
import { MatSelect } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FormulaCopyDialogComponent } from './formula-copy/formula-copy-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    FormulaContableRoutingModule,
    MatSelect,
    MatOption,
    MatTooltipModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  declarations: [
    FormulaContableListComponent,
    FormulaContableEditComponent,
    FormulaCopyDialogComponent,
  ],
  providers: [FormulaContableService, SucursalService],
  exports: [],
})
export class FormulaContableModule {}
