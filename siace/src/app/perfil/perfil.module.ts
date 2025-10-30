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

import { PerfilListComponent } from './perfil-list/perfil-list.component';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';
import { PerfilService } from './perfil.service';
import { PerfilRoutingModule } from './perfil.routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
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
    PerfilRoutingModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatPaginator
  ],
  declarations: [PerfilListComponent, PerfilEditComponent],
  providers: [PerfilService],
  exports: [],
})
export class PerfilModule {}
