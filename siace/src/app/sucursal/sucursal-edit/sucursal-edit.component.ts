import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../sucursal.service';
import { Sucursal } from '../sucursal';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { EmpresaService } from '../../empresa/empresa.service';

@Component({
  selector: 'app-sucursal-edit',
  standalone: false,
  templateUrl: './sucursal-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class SucursalEditComponent implements OnInit {
  id!: string;
  sucursal!: Sucursal;
  
  // Listas para los combos en cascada
  estadosList: any = [];
  municipiosList: any = [];
  ciudadesList: any = [];
  coloniasList: any = [];
  empresasList: any = []; 


  isInitializing = true;

  constructor(
    private dialogRef: MatDialogRef<SucursalEditComponent>,
    private sucursalService: SucursalService,
    private proveedorService: ProveedorService, 
    private toastr: ToastrService,
    private empresaService: EmpresaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sucursal = data.sucursal;
    console.log('Sucursal inicial:', this.sucursal);
  }

  async ngOnInit() {
    this.isInitializing = true;
    
    await this.loadEstados();

    
    if (this.sucursal.sucCiuId) {
      await this.initializeFromCiudad();
    }
    
    this.isInitializing = false;
    this.loadCatalogs();
  }


  async loadCatalogs() {
    this.empresaService.findAll().subscribe((res)=>{
      console.log(res);
      this.empresasList = res; 
    }, (error)=>{
      console.log(error);
      
    });
  } 

  onEmpresaChange(event: any){
    this.sucursal.sucEmpId = event.value; 
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
      console.log('Iniciando ingeniería inversa para ciudad:', this.sucursal.sucCiuId);
      
      const ubicacionCompleta = await this.getUbicacionCompleta(this.sucursal.sucCiuId);
      
      if (!ubicacionCompleta) {
        console.error('No se pudo obtener la ubicación completa');
        return;
      }

      console.log('Ubicación completa obtenida:', ubicacionCompleta);


      this.sucursal.sucEstId = ubicacionCompleta.estado.estId;
      this.sucursal.sucMunId = ubicacionCompleta.municipio.munId;
      

      await this.loadMunicipiosForEstado(ubicacionCompleta.estado.estId);
      await this.loadCiudadesForMunicipio(ubicacionCompleta.municipio.munId);
      await this.loadColoniasForCiudad(this.sucursal.sucCiuId);

      console.log('Sucursal actualizada:', this.sucursal);
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
    
    this.sucursal.sucEstId = event.value;
    this.sucursal.sucMunId = '';
    this.sucursal.sucCiuId = '';
    this.sucursal.sucColId = '';

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
    
    this.sucursal.sucMunId = event.value;
    this.sucursal.sucCiuId = '';
    this.sucursal.sucColId = '';

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
    
    this.sucursal.sucCiuId = event.value;
    this.sucursal.sucColId = '';

    // Limpiar lista dependiente
    this.coloniasList = [];

    if (event.value) {
      this.getColonias(Number(event.value));
    }
  }

  onColoniaChange(event: any) {
    if (this.isInitializing) return;
    
    console.log('Colonia cambiada:', event.value);
    this.sucursal.sucColId = event.value;
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
    console.log('Guardando sucursal:', this.sucursal);
    
    this.sucursalService.save(this.sucursal).subscribe({
      next: (result) => {
        if (result?.sucColId != null && result?.sucColId != undefined ) {
          this.toastr.success('La sucursal ha sido guardada exitosamente', 'Transacción exitosa');
          this.sucursalService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      error: (err) => {
        console.error('Error guardando sucursal:', err);
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}