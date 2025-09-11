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

import { NivelListComponent } from './nivel-list/nivel-list.component';
import { NivelEditComponent } from './nivel-edit/nivel-edit.component';
import { NivelService } from './nivel.service';
import { NivelRoutingModule } from './nivel.routing.module';
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
    NivelRoutingModule,
    MatPaginatorModule
  ],
  declarations: [
    NivelListComponent,
    NivelEditComponent
  ],
  providers: [NivelService],
  exports: []
})
export class NivelModule { }
