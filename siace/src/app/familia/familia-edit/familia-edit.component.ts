import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { FamiliaService } from '../familia.service';
import { Familia } from '../familia';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Submarca } from '../../submarca/submarca';
import { SubmarcaService } from '../../submarca/submarca.service';

@Component({
   selector: 'app-familia-edit',
   standalone: false,
   templateUrl: './familia-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class FamiliaEditComponent implements OnInit {

   id!: string;
   familia!: Familia;
   submarcasLists: Submarca[] = [];
   familiasListFilter: Familia[] = [];

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<FamiliaEditComponent>,
      private familiaService: FamiliaService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any,
       private submarca: SubmarcaService
      ) {
      this.familia=data.familia;
      this.familiasListFilter=data.familiasListFilter;
      this.submarcasLists=data.submarcasListsFilter;
       
      }



   ngOnInit() {
 }

   onFamiliaPadreChange(event: any){
      this.familia.famIdParent = event.value;
   }

   onSubmarcaChange(event: any){
      this.familia.famSmaId = event.value;
   }

   /*Métodos*/
   
   save() {

      //  if (result?.banId !== undefined && result?.banId !== null && Number(result.banId) >= 0) {
      this.familiaService.save(this.familia).subscribe({
         next:  result => {
            if (result?.famId !== undefined && result?.famId !== null && Number(result.famId) >= 0 
               ) {
               this.toastr.success('El familia ha sido guardado exitosamente', 'Transacción exitosa');
               this.familiaService.setIsUpdated(true);
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
