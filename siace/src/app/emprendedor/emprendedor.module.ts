import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CuestionarioModule } from '../cuestionario/cuestionario.module';
import { NivelService } from '../nivel/nivel.service';
import {
  EmprendedorEditComponent,
} from './emprendedor-edit/emprendedor-edit.component';
import {
  EmprendedorListComponent,
} from './emprendedor-list/emprendedor-list.component';
import { EmprendedorRoutingModule } from './emprendedor.routing.module';
import { EmprendedorService } from './emprendedor.service';
import {
  RegistroEmprendedorComponent,
} from './registro-emprendedor/registro-emprendedor.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
    EmprendedorRoutingModule,
    MatPaginatorModule,
    MatOptionModule,
    MatFormField,
    ReactiveFormsModule,
    MatSelectModule,
    CuestionarioModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  declarations: [
    EmprendedorListComponent,
    EmprendedorEditComponent,
    RegistroEmprendedorComponent,
  ],
  providers: [EmprendedorService, NivelService],
  exports: [RegistroEmprendedorComponent],
})
export class EmprendedorModule {}
