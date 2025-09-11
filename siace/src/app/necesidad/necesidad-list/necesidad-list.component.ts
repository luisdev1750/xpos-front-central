import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Necesidad } from '../necesidad';
import {
  NecesidadEditComponent,
} from '../necesidad-edit/necesidad-edit.component';
import { NecesidadFilter } from '../necesidad-filter';
import { NecesidadService } from '../necesidad.service';


@Component({
  selector: 'app-necesidad',
  templateUrl: 'necesidad-list.component.html',
  styleUrls: ['necesidad-list.component.css'],
})
export class NecesidadListComponent implements OnInit, OnDestroy {
   displayedColumns = ['necId','necDescripcion','actions'];
   filter = new NecesidadFilter();
   selectedNecesidad!: Necesidad;

   private subs!: Subscription;
  
   dataSource = new MatTableDataSource<any>();
 
    @ViewChild(MatPaginator) paginator!: MatPaginator;
   ngAfterViewInit(): void{
     this.dataSource.paginator = this.paginator; 
   }
   /* Inicialización */
  
   constructor(private necesidadService: NecesidadService, 
      private toastr: ToastrService,
      public dialog: MatDialog) {
   }


   ngOnInit() {
      this.subs = this.necesidadService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get necesidadList(): Necesidad[] {
      return this.necesidadService.necesidadList;
   }
  
  
  /* Métodos */

   add() {
      let newNecesidad: Necesidad = new Necesidad();
	  
      this.edit(newNecesidad);
   }


   delete(necesidad: Necesidad): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el necesidad? '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.necesidadService.delete(necesidad).subscribe(() => {
               this.toastr.success('La necesidad ha sido eliminada exitosamente', 'Transacción exitosa');
               this.necesidadService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Necesidad) {
      this.dialog.open(NecesidadEditComponent, {
         data: ele,
      });
   }   


   search(): void {
      this.necesidadService.load(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar necesidades', err);
         }
      );
   }
   


   select(selected: Necesidad): void {
      this.selectedNecesidad = selected;
   }
  
}
