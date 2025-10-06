import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../menu.service';
import { Marca } from '../menu';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-menu-edit',
   standalone: false,
   templateUrl: './menu-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class MenuEditComponent implements OnInit {

   id!: string;
   marca!: Marca;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<MenuEditComponent>,
      private menuService: MenuService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      

         this.marca = { ...data.marca };
      
  
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.menuService.save(this.marca).subscribe({
         next: result => {
            // Validación similar al BancoEditComponent
            if (result?.marId !== undefined && result?.marId !== null && Number(result.marId) >= 0) {
               this.toastr.success('La marca ha sido guardada exitosamente', 'Transacción exitosa');
               this.menuService.setIsUpdated(true);
               this.dialogRef.close();
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {   
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }
}
