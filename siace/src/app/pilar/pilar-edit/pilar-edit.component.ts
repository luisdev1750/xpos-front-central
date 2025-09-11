import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Pilar } from '../pilar';
import { PilarService } from '../pilar.service';


@Component({
   selector: 'app-pilar-edit',
   templateUrl: './pilar-edit.component.html',
   styleUrls: ['pilar-edit.component.css']
 })
 export class PilarEditComponent implements OnInit {
 
    id!: string;
    pilar!: Pilar;
    pilarCopia!: Pilar;

 
    /* Constructores */
    
    constructor(
       private dialogRef: MatDialogRef<PilarEditComponent>,
       private pilarService: PilarService,
      private toastr: ToastrService,
       @Inject(MAT_DIALOG_DATA) public data: Pilar) {
       this.pilar=data;
       this.pilarCopia = JSON.parse(JSON.stringify(data));
    }
 
 
    ngOnInit() {
    }
 
    /*Métodos*/
    
    save() {
       this.pilarService.save(this.pilarCopia).subscribe(
          pilar => {
             this.pilar = pilar;
          this.toastr.success('El pilar ha sido guardado exitosamente', 'Transacción exitosa');
             this.pilarService.setIsUpdated(true);
             this.dialogRef.close();
          },
          err => {
             this.toastr.error('Ha ocurrido un error', 'Error');
          }
       );
    }
 }