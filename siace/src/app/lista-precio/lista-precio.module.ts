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

import { ListaPrecioListComponent } from './lista-precio-list/lista-precio-list.component';
import { ListaPrecioEditComponent } from './lista-precio-edit/lista-precio-edit.component';
import { ListaPrecioService } from './lista-precio.service';
import { ListaPrecioRoutingModule } from './lista-precio.routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';

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
    ListaPrecioRoutingModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatPaginator,
  ],
  declarations: [ListaPrecioListComponent, ListaPrecioEditComponent],
  providers: [ListaPrecioService],
  exports: [],
})
export class ListaPrecioModule {}
