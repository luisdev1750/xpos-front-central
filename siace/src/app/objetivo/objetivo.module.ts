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

import { ObjetivoListComponent } from './objetivo-list/objetivo-list.component';
import { ObjetivoEditComponent } from './objetivo-edit/objetivo-edit.component';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoRoutingModule } from './objetivo.routing.module';

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
    ObjetivoRoutingModule,
  ],
  declarations: [
    ObjetivoListComponent,
    ObjetivoEditComponent
  ],
  providers: [ObjetivoService],
  exports: [ObjetivoListComponent,
    ObjetivoEditComponent]
})
export class ObjetivoModule { }
