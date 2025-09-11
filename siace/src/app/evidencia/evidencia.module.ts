import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { EvidenciaEditComponent } from './evidencia-edit/evidencia-edit.component';
import { EvidenciaListComponent } from './evidencia-list/evidencia-list.component';
import { EvidenciaRoutingModule } from './evidencia.routing.module';
import { EvidenciaService } from './evidencia.service';
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
    EvidenciaRoutingModule,
    MatPaginatorModule
  ],
  declarations: [
    EvidenciaListComponent,
    EvidenciaEditComponent
  ],
  providers: [EvidenciaService],
  exports: [EvidenciaListComponent,
    EvidenciaEditComponent]
})
export class EvidenciaModule { }
