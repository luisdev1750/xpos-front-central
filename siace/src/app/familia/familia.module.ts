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

import { FamiliaListComponent } from './familia-list/familia-list.component';
import { FamiliaEditComponent } from './familia-edit/familia-edit.component';
import { FamiliaService } from './familia.service';
import { FamiliaRoutingModule } from './familia.routing.module';
import { SubmarcaService } from '../submarca/submarca.service';
import { MatSelectModule } from '@angular/material/select';
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
    FamiliaRoutingModule,
    MatSelectModule ,
    MatOptionModule,
    MatTooltipModule
  ],
  declarations: [
    FamiliaListComponent,
    FamiliaEditComponent
  ],
  providers: [FamiliaService, SubmarcaService],
  exports: []
})
export class FamiliaModule { }
