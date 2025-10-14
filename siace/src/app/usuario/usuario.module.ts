import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';
import { UsuarioService } from './usuario.service';
import { UsuarioRoutingModule } from './usuario.routing.module';
import { PerfilService } from '../perfil/perfil.service';
import { SucursalService } from '../sucursal/sucursal.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
    UsuarioRoutingModule,
    MatSelect,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
  ],
  declarations: [UsuarioListComponent, UsuarioEditComponent],
  providers: [UsuarioService, PerfilService, SucursalService],
  exports: [],
})
export class UsuarioModule {}
