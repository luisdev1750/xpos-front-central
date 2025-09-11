import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormatoApoyoListComponent } from './formato-apoyo-list/formato-apoyo-list.component';
import { FormatoApoyoEditComponent } from './formato-apoyo-edit/formato-apoyo-edit.component';
import { FormatoApoyoService } from './formato-apoyo.service';
import { FormatoApoyoRoutingModule } from './formato-apoyo.routing.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';

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
    FormatoApoyoRoutingModule,
    MaterialFileInputModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  declarations: [
    FormatoApoyoListComponent,
    FormatoApoyoEditComponent
  ],
  providers: [FormatoApoyoService],
  exports: [FormatoApoyoListComponent, FormatoApoyoEditComponent]
})
export class FormatoApoyoModule { }
