import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BannerService } from '../banner.service';
import { Banner } from '../banner';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-banco-edit',
   standalone: false,
   templateUrl: './banner-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class BannerEditComponent implements OnInit {

   id!: string;
   banner!: Banner;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<BannerEditComponent>,
      private bannerService: BannerService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.banner = { ...data.banner };
      
  
   }

   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      // El valor ya es booleano, no necesita conversión adicional
      this.bannerService.save(this.banner).subscribe({
         next: result => {
            if (result?.subId !== undefined && result?.subId !== null && Number(result.subId) >= 0) {
               this.toastr.success('El banco ha sido guardado exitosamente', 'Transacción exitosa');
               this.bannerService.setIsUpdated(true);
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