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

import { MenuPerfilListComponent } from './menu-perfil-list/menu-perfil-list.component';
import { MenuPerfilEditComponent } from './menu-perfil-edit/menu-perfil-edit.component';
import { MenuPerfilService } from './menu-perfil.service';
import { MenuPerfilRoutingModule } from './menu-perfil.routing.module';
import { PerfilService } from '../perfil/perfil.service';
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
    MenuPerfilRoutingModule,
    MatOption,
    MatSelect
    
  ],
  declarations: [
    MenuPerfilListComponent,
    MenuPerfilEditComponent
  ],
  providers: [MenuPerfilService, PerfilService],
  exports: []
})
export class MenuPerfilModule { }
