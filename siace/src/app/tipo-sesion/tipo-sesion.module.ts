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
import { MatTabsModule } from '@angular/material/tabs';
import { TipoSesionListComponent } from './tipo-sesion-list/tipo-sesion-list.component';
import { TipoSesionEditComponent } from './tipo-sesion-edit/tipo-sesion-edit.component';
import { TipoSesionService } from './tipo-sesion.service';
import { TipoSesionRoutingModule } from './tipo-sesion.routing.module';
import { MatSelectModule } from '@angular/material/select';
import { TipoAspectoService } from '../tipo-aspecto/tipo-aspecto.service';
import { ObjetivoModule } from '../objetivo/objetivo.module';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatSelectModule,
    MatTabsModule,
    TipoSesionRoutingModule,
    ObjetivoModule,
    MatPaginatorModule
  ],
  declarations: [
    TipoSesionListComponent,
    TipoSesionEditComponent
  ],
  providers: [TipoSesionService,TipoAspectoService],
  exports: []
})
export class TipoSesionModule { }
