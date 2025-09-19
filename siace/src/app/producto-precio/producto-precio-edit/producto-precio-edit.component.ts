import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoPrecioService } from '../producto-precio.service';
import { ProductoPrecio } from '../producto-precio';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ListaPrecioService } from '../../lista-precio/lista-precio.service';
import { ListaPrecio } from '../../lista-precio/lista-precio';

@Component({
   selector: 'app-producto-precio-edit',
   standalone: false,
   templateUrl: './producto-precio-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class ProductoPrecioEditComponent implements OnInit {

   id!: string;
   productoPrecio!: ProductoPrecio;
   listaPrecios:ListaPrecio[] = []; 

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ProductoPrecioEditComponent>,
      private productoPrecioService: ProductoPrecioService,
	   private toastr: ToastrService,
      private listaPrecioService : ListaPrecioService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productoPrecio=data.productoPrecio;
   }


   ngOnInit() {
      this.loadCatalogs(); 
   }

    loadCatalogs() {
    this.listaPrecioService
      .find({
        lprId: '0',
        lprActivo: 'all',
        lprFechaAlta: 'all',
        lprFechaVigencia: 'all',
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.listaPrecios = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  OnListaPreciosChange(event: any){
      this.productoPrecio.prrLprId = event.value;
      
  }

   /*Métodos*/
   
   save() {
      this.productoPrecioService.save(this.productoPrecio).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El precio de producto ha sido guardado exitosamente', 'Transacción exitosa');
               this.productoPrecioService.setIsUpdated(true);
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
