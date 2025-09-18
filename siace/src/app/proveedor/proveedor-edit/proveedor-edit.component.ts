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

  // Flag para controlar si estamos inicializando (evitar eventos en cascada)
  isInitializing = true;

  constructor(
    private dialogRef: MatDialogRef<ProveedorEditComponent>,
    private proveedorService: ProveedorService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedor = data.proveedor;
    console.log('Proveedor inicial:', this.proveedor);
  }

  async ngOnInit() {
    this.isInitializing = true;
    
    // Primero cargamos todos los estados
    await this.loadEstados();
    
    // Si el proveedor tiene una ciudad, hacemos la ingeniería inversa
    if (this.proveedor.pveCiuId) {
      await this.initializeFromCiudad();
    }
    
    this.isInitializing = false;
  }

  async loadEstados(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.proveedorService.findAllEstados().subscribe(
        (res) => {
          this.estadosList = res;
          console.log('Estados cargados:', this.estadosList);
          resolve();
        },
        (error) => {
          console.error('Error cargando estados:', error);
          reject(error);
        }
      );
    });
  }

  async initializeFromCiudad(): Promise<void> {
    try {
      console.log('Iniciando ingeniería inversa para ciudad:', this.proveedor.pveCiuId);
      
      // Obtenemos la información completa de la jerarquía
      const ubicacionCompleta = await this.getUbicacionCompleta(this.proveedor.pveCiuId);
      
      if (!ubicacionCompleta) {
        console.error('No se pudo obtener la ubicación completa');
        return;
      }

      console.log('Ubicación completa obtenida:', ubicacionCompleta);

      // Asignamos los IDs faltantes al proveedor
      this.proveedor.pveEstId = ubicacionCompleta.estado.estId;
      this.proveedor.pveMunId = ubicacionCompleta.municipio.munId;
      
      // Cargamos las listas en cascada
      await this.loadMunicipiosForEstado(ubicacionCompleta.estado.estId);
      await this.loadCiudadesForMunicipio(ubicacionCompleta.municipio.munId);
      await this.loadColoniasForCiudad(this.proveedor.pveCiuId);

      console.log('Proveedor actualizado:', this.proveedor);
      console.log('Listas cargadas - Municipios:', this.municipiosList.length, 
                  'Ciudades:', this.ciudadesList.length, 
                  'Colonias:', this.coloniasList.length);

    } catch (error) {
      console.error('Error en la inicialización desde ciudad:', error);
      this.toastr.error('Error al cargar la información de ubicación', 'Error');
    }
  }

  async getUbicacionCompleta(ciudadId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.proveedorService.getUbicacionCompletaByCiudad(Number(ciudadId)).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async loadMunicipiosForEstado(estadoId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.proveedorService.findMunicipios(Number(estadoId)).subscribe(
        (res) => {
          this.municipiosList = res;
          console.log(`Municipios cargados para estado ${estadoId}:`, this.municipiosList);
          resolve();
        },
        (error) => {
          console.error('Error cargando municipios:', error);
          reject(error);
        }
      );
    });
  }

  async loadCiudadesForMunicipio(municipioId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.proveedorService.findCiudades(Number(municipioId)).subscribe(
        (res) => {
          this.ciudadesList = res;
          console.log(`Ciudades cargadas para municipio ${municipioId}:`, this.ciudadesList);
          resolve();
        },
        (error) => {
          console.error('Error cargando ciudades:', error);
          reject(error);
        }
      );
    });
  }

  async loadColoniasForCiudad(ciudadId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.proveedorService.findColonias(Number(ciudadId)).subscribe(
        (res) => {
          this.coloniasList = res;
          console.log(`Colonias cargadas para ciudad ${ciudadId}:`, this.coloniasList);
          resolve();
        },
        (error) => {
          console.error('Error cargando colonias:', error);
          reject(error);
        }
      );
    });
  }

  onEstadoChange(event: any) {
    if (this.isInitializing) return;
    
    console.log('Estado cambiado:', event.value);
    
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
    if (this.isInitializing) return;
    
    console.log('Municipio cambiado:', event.value);
    
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
    if (this.isInitializing) return;
    
    console.log('Ciudad cambiada:', event.value);
    
    this.proveedor.pveCiuId = event.value;
    this.proveedor.pveColId = '';

    // Limpiar lista dependiente
    this.coloniasList = [];

    if (event.value) {
      this.getColonias(Number(event.value));
    }
  }

  onColoniaChange(event: any) {
    if (this.isInitializing) return;
    
    console.log('Colonia cambiada:', event.value);
    this.proveedor.pveColId = event.value;
  }

  getMunicipios(estId: number) {
    this.proveedorService.findMunicipios(estId).subscribe(
      (res) => {
        this.municipiosList = res;
        console.log('Municipios obtenidos:', this.municipiosList);
      },
      (error) => {
        console.error('Error obteniendo municipios:', error);
      }
    );
  }

  getCiudades(munId: number) {
    this.proveedorService.findCiudades(munId).subscribe(
      (res) => {
        this.ciudadesList = res;
        console.log('Ciudades obtenidas:', this.ciudadesList);
      },
      (error) => {
        console.error('Error obteniendo ciudades:', error);
      }
    );
  }

  getColonias(ciuId: number) {
    this.proveedorService.findColonias(ciuId).subscribe(
      (res) => {
        this.coloniasList = res;
        console.log('Colonias obtenidas:', this.coloniasList);
      },
      (error) => {
        console.error('Error obteniendo colonias:', error);
      }
    );
  }

  save() {
    console.log('Guardando proveedor:', this.proveedor);
    
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
        console.error('Error guardando proveedor:', err);
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}