import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../proveedor';

@Component({
  selector: 'app-proveedor-edit',
  standalone: false,
  templateUrl: './proveedor-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProveedorEditComponent implements OnInit {
  id!: string;
  proveedor!: Proveedor;
  
  // Listas para los combos en cascada
  estadosList: any = [];
  municipiosList: any = [];
  ciudadesList: any = [];
  coloniasList: any = [];

  constructor(
    private dialogRef: MatDialogRef<ProveedorEditComponent>,
    private proveedorService: ProveedorService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedor = data.proveedor;
  }

  ngOnInit() {
    this.loadCatalogs();
    this.initializeLocationData();
  }

  loadCatalogs() {
    // Cargar estados primero
    this.proveedorService.findAllEstados().subscribe(
      (res) => {
        this.estadosList = res;
        // Si el proveedor ya tiene un estado, cargar sus dependientes
        if (this.proveedor.pveEstId) {
          this.getMunicipios(Number(this.proveedor.pveEstId));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initializeLocationData() {
    // Si estamos editando un proveedor existente, cargar la cadena de ubicación
    if (this.proveedor.pveEstId && this.proveedor.pveMunId) {
      this.getMunicipios(Number(this.proveedor.pveEstId));
    }
    if (this.proveedor.pveMunId && this.proveedor.pveCiuId) {
      this.getCiudades(Number(this.proveedor.pveMunId));
    }
    if (this.proveedor.pveCiuId && this.proveedor.pveColId) {
      this.getColonias(Number(this.proveedor.pveCiuId));
    }
  }

  onEstadoChange(event: any) {
    this.proveedor.pveEstId = event.value;
    this.proveedor.pveMunId = '';
    this.proveedor.pveCiuId = '';
    this.proveedor.pveColId = '';
    
    // Limpiar listas dependientes
    this.municipiosList = [];
    this.ciudadesList = [];
    this.coloniasList = [];
    
    if (event.value) {
      this.getMunicipios(Number(event.value));
    }
  }

  onMunicipioChange(event: any) {
    this.proveedor.pveMunId = event.value;
    this.proveedor.pveCiuId = '';
    this.proveedor.pveColId = '';
    
    // Limpiar listas dependientes
    this.ciudadesList = [];
    this.coloniasList = [];
    
    if (event.value) {
      this.getCiudades(Number(event.value));
    }
  }

  onCiudadChange(event: any) {
    this.proveedor.pveCiuId = event.value;
    this.proveedor.pveColId = '';
    
    // Limpiar lista dependiente
    this.coloniasList = [];
    
    if (event.value) {
      this.getColonias(Number(event.value));
    }
  }

  onColoniaChange(event: any) {
    this.proveedor.pveColId = event.value;
  }

  getMunicipios(estId: number) {
    this.proveedorService.findMunicipios(estId).subscribe(
      (res) => {
        this.municipiosList = res;
        // Si el proveedor ya tenía un municipio seleccionado, cargar sus ciudades
        if (this.proveedor.pveMunId) {
          this.getCiudades(Number(this.proveedor.pveMunId));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCiudades(munId: number) {
    this.proveedorService.findCiudades(munId).subscribe(
      (res) => {
        this.ciudadesList = res;
        // Si el proveedor ya tenía una ciudad seleccionada, cargar sus colonias
        if (this.proveedor.pveCiuId) {
          this.getColonias(Number(this.proveedor.pveCiuId));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getColonias(ciuId: number) {
    this.proveedorService.findColonias(ciuId).subscribe(
      (res) => {
        this.coloniasList = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  save() {
    this.proveedorService.save(this.proveedor).subscribe({
      next: (result) => {
        if (Number(result) > 0) {
          this.toastr.success(
            'El proveedor ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.proveedorService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}