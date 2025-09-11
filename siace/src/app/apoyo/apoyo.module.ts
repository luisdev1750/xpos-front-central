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
import { ApoyoListComponent } from './apoyo-list/apoyo-list.component';
import { ApoyoEditComponent } from './apoyo-edit/apoyo-edit.component';
import { ApoyoService } from './apoyo.service';
import { ApoyoRoutingModule } from './apoyo.routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormatoApoyoModule } from '../formato-apoyo/formato-apoyo.module';

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
    ApoyoRoutingModule,
    MatTabsModule,
    MaterialFileInputModule,
    ReactiveFormsModule,
    MatExpansionModule,
    FormatoApoyoModule,
    MatPaginatorModule
  ],
  declarations: [
    ApoyoListComponent,
    ApoyoEditComponent
  ],
  providers: [ApoyoService],
  exports: [ApoyoListComponent, ApoyoEditComponent]
})
export class ApoyoModule { }
