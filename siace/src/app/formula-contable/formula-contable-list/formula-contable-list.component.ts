import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormulaContableFilter } from '../formula-contable-filter';
import { FormulaContableService } from '../formula-contable.service';
import { FormulaContable } from '../formula-contable';
import { FormulaContableEditComponent } from '../formula-contable-edit/formula-contable-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';

@Component({
   selector: 'app-formula-contable',
   standalone: false,
   templateUrl: 'formula-contable-list.component.html',
   styles: [
      'table { }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class FormulaContableListComponent implements OnInit {
   displayedColumns = [ 'focId',  'focSucId',  'focFormula',  'focClave',  'focNombre',  'focEstatusEdicion',  'actions'];
   filter = new FormulaContableFilter();

   private subs!: Subscription;
   listSucursales : any = [];
   
    /* Inicialización */

   constructor(
      private formulaContableService: FormulaContableService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private sucursalService: SucursalService
   ) {
      this.subs = this.formulaContableService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.focId='0';
      this.filter.focSucId='0';
   }


   ngOnInit() {
      this.loadCatalog();
      this.search(); 
   }
   OnSucursalChange(event: any){
      this.filter.focSucId=event.value;
      this.search();
   }

   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }

   loadCatalog(){
      this.sucursalService.findAll().subscribe({
         next: result => {
            this.listSucursales = result;  
         },
         error: err => {
            this.toastr.error('Ha ocurrido un error al cargar las sucursales', 'Error');

         }
      });
   }

   /* Accesors */

   get formulaContableList(): FormulaContable [] {
      return this.formulaContableService.formulaContableList;
   }

   
   /* Métodos */

   add() {
      let newFormulaContable: FormulaContable = new FormulaContable();

      this.edit(newFormulaContable);
   }



   delete (formulaContable: FormulaContable): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el fórmula contable?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.formulaContableService.delete(formulaContable).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El fórmula contable ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.formulaContableService.setIsUpdated(true);
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


   edit(ele: FormulaContable) {
      this.dialog.open(FormulaContableEditComponent, {
         data: {formulaContable:JSON.parse(JSON.stringify(ele)),
            listSucursales : this.listSucursales
         },
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.formulaContableService.load(this.filter);
   }
   
}
