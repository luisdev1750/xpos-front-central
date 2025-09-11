import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { PilarEditComponent } from './pilar-edit/pilar-edit.component';
import { PilarListComponent } from './pilar-list/pilar-list.component';
import { PilarRoutingModule } from './pilar.routing.module';
import { PilarService } from './pilar.service';


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
    PilarRoutingModule,
    MatPaginatorModule,
    MatExpansionModule,
  ],
  declarations: [
    PilarListComponent,
    PilarEditComponent
  ],
  providers: [PilarService],
  exports: []
})
export class PilarModule { }
