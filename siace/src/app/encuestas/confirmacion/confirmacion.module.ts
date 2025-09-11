import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmacionComponent } from './confirmacion.component';


///Agregar componentes genericos para usar materials
@NgModule(
    {
        declarations: [ConfirmacionComponent],
        imports: [
            CommonModule,
            FormsModule,
            MatTableModule,
            MatButtonModule,
            MatIconModule,
            MatDialogModule,
            MatFormFieldModule,
            ToastrModule.forRoot({
                preventDuplicates: true
            }),
            MatInputModule,
        ],
        providers: [],
        ///Quiero que el componente pueda ser usado en otros components
        exports: [ConfirmacionComponent]
    }
)

export class ConfirmacionModule{

}