import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalConfigFilter } from '../sucursal-config-filter';
import { SucursalConfigService } from '../sucursal-config.service';
import { SucursalConfig } from '../sucursal-config';
import { SucursalConfigEditComponent } from '../sucursal-config-edit/sucursal-config-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';

@Component({
   selector: 'app-sucursal-config',
   standalone: false,
   templateUrl: 'sucursal-config-list.component.html',
   styles: [
      'table {  }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class SucursalConfigListComponent implements OnInit {
   displayedColumns = [  'scoSucId',  'scoHost',  'scoTokenUser',  'scoTokenPassword',  'actions'];
   filter = new SucursalConfigFilter();

   private subs!: Subscription;
   listSucursales: any[] = [];
   
    /* Inicialización */

   constructor(
      private sucursalConfigService: SucursalConfigService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private sucursalService: SucursalService
   ) {
      this.subs = this.sucursalConfigService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.scoId='0';
   }


   ngOnInit() {
      this.loadCatalogs(); 
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }
   
   onSucursalChange(event:any){
      this.filter.scoSucId = event.value;
      this.search();  
   }
   loadCatalogs(){
      this.sucursalService.findAll().subscribe((res)=>{
         console.log("all sucursales");
         console.log(res);
         this.listSucursales = res; 
         
         
      }, (error)=>{
         console.log(error);
         
      })
   }

   /* Accesors */

   get sucursalConfigList(): SucursalConfig [] {
      return this.sucursalConfigService.sucursalConfigList;
   }

   
   /* Métodos */

   add() {
      let newSucursalConfig: SucursalConfig = new SucursalConfig();

      this.edit(newSucursalConfig);
   }



   delete (sucursalConfig: SucursalConfig): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el configuración de sucursal?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
        
            this.sucursalConfigService.delete(sucursalConfig).subscribe({
               next: (result) => {
                  if (Number(result.scoId) > 0) {
                     this.toastr.success('El configuración de sucursal ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.sucursalConfigService.setIsUpdated(true);
                  }
                  else this.toastr.error('Ha ocurrido un error', 'Error');
               },
               error: err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            });
         
      });
   }


   edit(ele: SucursalConfig) {
      this.dialog.open(SucursalConfigEditComponent, {
         data: {sucursalConfig:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.sucursalConfigService.load(this.filter);
   }
   
}
