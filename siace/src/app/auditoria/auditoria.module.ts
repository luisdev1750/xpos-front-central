import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UsuarioService } from '../usuario/usuario.service';
import {
  AuditoriaEditComponent,
} from './auditoria-edit/auditoria-edit.component';
import {
  AuditoriaListComponent,
} from './auditoria-list/auditoria-list.component';
import { AuditoriaRoutingModule } from './auditoria.routing.module';
import { AuditoriaService } from './auditoria.service';


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
    AuditoriaRoutingModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  declarations: [
    AuditoriaListComponent,
    AuditoriaEditComponent
  ],
  providers: [AuditoriaService, UsuarioService],
  exports: []
})
export class AuditoriaModule { }
