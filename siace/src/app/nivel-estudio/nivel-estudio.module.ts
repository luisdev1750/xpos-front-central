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

import { NivelEstudioListComponent } from './nivel-estudio-list/nivel-estudio-list.component';
import { NivelEstudioEditComponent } from './nivel-estudio-edit/nivel-estudio-edit.component';
import { NivelEstudioService } from './nivel-estudio.service';
import { NivelEstudioRoutingModule } from './nivel-estudio.routing.module';
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
    NivelEstudioRoutingModule,
    MatPaginatorModule,
    
  ],
  declarations: [
    NivelEstudioListComponent,
    NivelEstudioEditComponent
  ],
  providers: [NivelEstudioService],
  exports: []
})
export class NivelEstudioModule { }
