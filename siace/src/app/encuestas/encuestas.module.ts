import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import {
  EncuestasListComponent,
} from './encuestas-list/buscar-encuestas.component';
import { EncuestaListService } from './encuestas-list/buscar-encuestas.service';
import { EncuestasRoutingModule } from './encuestas-routing.module';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadFileService } from './upload-file/upload-file.service';


@NgModule({
  declarations: [
    EncuestasListComponent,
    UploadFileComponent
  ],
  providers: [
    EncuestaListService,
    UploadFileService
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    EncuestasRoutingModule,
    MatStepperModule,
    MatPaginatorModule,
  ]
})
export class EncuestasModule { }
