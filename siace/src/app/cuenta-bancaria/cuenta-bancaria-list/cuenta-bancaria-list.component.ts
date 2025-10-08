import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CuentaBancariaFilter } from '../cuenta-bancaria-filter';
import { CuentaBancariaService } from '../cuenta-bancaria.service';
import { CuentaBancaria } from '../cuenta-bancaria';
import { CuentaBancariaEditComponent } from '../cuenta-bancaria-edit/cuenta-bancaria-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';
import { BancoService } from '../../banco/banco.service';

@Component({
   selector: 'app-cuenta-bancaria',
   standalone: false,
   templateUrl: 'cuenta-bancaria-list.component.html',
   styles: [
      'table {  }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class CuentaBancariaListComponent implements OnInit {
   displayedColumns = [  'cubBanId','cubSucId',    'cubCuentaBancaria',  'cubActivo',  'cubFechaAlta',  'actions'];
   filter = new CuentaBancariaFilter();
   sucursalList: any[] = [];
   bancoList: any[] = []
   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private cuentaBancariaService: CuentaBancariaService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private sucursalService: SucursalService,
      private bancoService: BancoService
      
      ) {
      this.subs = this.cuentaBancariaService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.cubId='0';
      this.filter.cubSucId='0';
      this.filter.cubBanId='0';
   }


   ngOnInit() {
      this.search();
      this.loadCatalog();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }

   loadCatalog(){
    
      this.sucursalService.findAll().subscribe({
         next: (result) => {
            console.log(result);   
            this.sucursalList = result;     
      },
         error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });   
      
      this.bancoService.find({
         banId: '0',
         banActivo: ''
      }).subscribe({
         next: (result) => {
            console.log(result);   
            this.bancoList = result;     
      },
         error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   
   }

   OnSucursalChange(event: any){
      this.filter.cubSucId=event.value;
      this.search();
   }

   OnBancoChange(event: any){
      this.filter.cubBanId=event.value;
      this.search();
   }
   /* Accesors */

   get cuentaBancariaList(): CuentaBancaria [] {
      return this.cuentaBancariaService.cuentaBancariaList;
   }

   
   /* Métodos */

   add() {
      let newCuentaBancaria: CuentaBancaria = new CuentaBancaria();

      this.edit(newCuentaBancaria);
   }



   delete (cuentaBancaria: CuentaBancaria): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el cuenta bancaria?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.cuentaBancariaService.delete(cuentaBancaria).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El cuenta bancaria ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.cuentaBancariaService.setIsUpdated(true);
                  }
                  else this.toastr.error('Ha ocurrido un error', 'Error');
               },
               error: err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            });
         }
      });
   }


   edit(ele: CuentaBancaria) {
      this.dialog.open(CuentaBancariaEditComponent, {
         data: {cuentaBancaria:JSON.parse(JSON.stringify(ele)),
            sucursalList: this.sucursalList,
            bancoList: this.bancoList
         },
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.cuentaBancariaService.load(this.filter);
   }
   
}
