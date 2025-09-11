import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';


@Component({
    selector: 'confirmacion',
    templateUrl: './confirmacion.component.html',
    styleUrls: ['./confirmacion.component.css']
})

export class ConfirmacionComponent{
    condicion:boolean=false
    constructor(public dialogRef: MatDialogRef<ConfirmacionComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any
    ){
        this.condicion=false
    }
    

    confirmar(){
        this.dialogRef.close(true); 
    }

    cerrarSinEvento() {
        this.dialogRef.close();
    }
}   
