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

import { PresentacionListComponent } from './presentacion-list/presentacion-list.component';
import { PresentacionEditComponent } from './presentacion-edit/presentacion-edit.component';
import { PresentacionService } from './presentacion.service';
import { PresentacionRoutingModule } from './presentacion.routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    PresentacionRoutingModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  declarations: [PresentacionListComponent, PresentacionEditComponent],
  providers: [PresentacionService],
  exports: [],
})
export class PresentacionModule {}
