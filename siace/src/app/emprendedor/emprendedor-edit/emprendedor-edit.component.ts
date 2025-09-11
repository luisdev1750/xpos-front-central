import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Giro } from '../../giro/giro';
import { GiroService } from '../../giro/giro.service';
import { Necesidad } from '../../necesidad/necesidad';
import { NecesidadService } from '../../necesidad/necesidad.service';
import { NivelEstudio } from '../../nivel-estudio/nivel-estudio';
import { NivelEstudioService } from '../../nivel-estudio/nivel-estudio.service';
import { Emprendedor } from '../emprendedor';
import { EmprendedorService } from '../emprendedor.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { BuscarContestacionesService } from '../../monitor/monitor.component.service';

@Component({
  selector: 'app-emprendedor-edit',
  templateUrl: './emprendedor-edit.component.html',
  styleUrls: ['./emprendedor-edit.component.css'],
})
export class EmprendedorEditComponent implements OnInit {
  id!: string;
  emprendedor!: Emprendedor;
  formulario: FormGroup;
  nivelesList: NivelEstudio[] = [];
  girosList: Giro[] = [];
  necesidadesList: Necesidad[] = [];
  rfcPattern = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})?$/;
  selectedNecesidadesIds: number[] = [];

  
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<EmprendedorEditComponent>,
    private emprendedorService: EmprendedorService,
    private toastr: ToastrService,
    private niveles: NivelEstudioService,
    private giros: GiroService,
    private necesidad: NecesidadService,
    private fb: FormBuilder,
    private buscarContestacionesService: BuscarContestacionesService,
    @Inject(MAT_DIALOG_DATA) public data: Emprendedor
  ) {
    this.emprendedor = data;
    this.formulario = this.fb.group({
      empId: [this.data.empId],
      empClave: [this.data.empClave || ''],
      empRazonSocial: [this.data.empRazonSocial || '', Validators.required],
      empDomicilio: [this.data.empDomicilio || ''],
      empTelefono: [this.data.empTelefono || '', Validators.required],
      empCorreo: [
        this.data.empCorreo || '',
        [Validators.required, Validators.email],
      ],
      empNieId: [
        this.data.empNieId || '', 
        
      ],
      empNombreEmpresa: [this.data.empNombreEmpresa || ''],
      empRfc: [
        this.data.empRfc,
        [Validators.required, Validators.pattern(this.rfcPattern)],
      ],
      empNombreTemporal: [this.data.empNombreTemporal || ''],
      empGiroId: [
        this.data.empGiroId || '',
        [Validators.required, this.noZeroValidator]
      ],
      empNec: [null, Validators.required],
      empEdad: [this.data.empEdad],
      empNombreCompleto: [this.data.empNombreCompleto]

    });
    console.log("this.data información::::::");
    
console.log(this.data);

        // Agregar el listener para convertir el RFC a mayúsculas
        this.formulario.get('empRfc')?.valueChanges.subscribe((value) => {
          if (value) {
            this.formulario.get('empRfc')?.setValue(value.toUpperCase(), { emitEvent: false });
          }
        });
  }
  onSelectionChange(event: any) {
    this.selectedNecesidadesIds = event.value; // Captura los valores seleccionados
  }
  noZeroValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value === 0 ? { noZero: true } : null;
  }
  ngOnInit() {
    this.loadCatalogos();

    console.log('Emprendedor datos');
    console.log(this.emprendedor);
    this.emprendedor.empNieId = this.data.empNieId;
    this.emprendedor.empGiroId = this.data.empGiroId;

    this.selectedNecesidadesIds = this.emprendedor.necesidades.map(
      (necesidad) => {
        return necesidad.eneNecId;
      }
    );
    console.log('Nuevo valor de array:');
    console.log(this.selectedNecesidadesIds);

    this.selectedNecesidadesIds = this.data.necesidades.map((n) => n.eneNecId);
    this.loadCatalogos();
  }

  /*Métodos*/
  save() {
    console.log('Guardando');

    // Mapeo de necesidades seleccionadas
    let necesidadesFinal = this.selectedNecesidadesIds.map((necId) => ({
      eneNecId: necId,
      eneEmpId: this.emprendedor.empId,
    }));
    console.log('Necesidades final.');
    console.log(necesidadesFinal);

    // Validación del formulario
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa el formulario correctamente.',
        'Advertencia'
      );
      console.log(this.formulario.invalid);

      return;
    }

    // Creación del objeto nuevoEmprendedor
    let nuevoEmprendedor = {
      empId: this.emprendedor.empId,
      empRazonSocial: this.formulario.value.empRazonSocial,
      empDomicilio: this.formulario.value.empDomicilio,
      empCorreo: this.formulario.value.empCorreo,
      empTelefono: this.formulario.value.empTelefono,
      empRfc: this.formulario.value.empRfc,
      empClave: this.formulario.value.empClave,
      empNivelEstudios: this.formulario.value.empNieId, // Asegúrate de que este campo esté presente en tu formulario
      empNombreEmpresa: this.formulario.value.empNombreEmpresa,
      empNombreTemporal: this.formulario.value.empNombreTemporal,

      empGiroId: this.formulario.value.empGiroId, // Asegúrate de que este campo esté presente en tu formulario
      empIndustria: this.formulario.value.empIndustria,
      empNecesidades: '', // Puede estar vacío o según la lógica de tu aplicación
      empVersion: 0, // Asigna el valor de versión correspondiente
      necesidades: [], // Inicialmente vacío
      empNieId: this.formulario.value.empNieId, // Asegúrate de que este campo esté presente en tu formulario
      empEdad: this.formulario.value.empEdad, 
      empNombreCompleto: this.formulario.value.empNombreCompleto
    };

    // Cuerpo de la request
    let bodyRequest = {
      empId: this.emprendedor.empId,
      nuevoEmprendedor: nuevoEmprendedor,
      necesidades: necesidadesFinal,
    };

    console.log('Datos a enviar');
    console.log(bodyRequest);

    // Validación de RFC si empId es cero
    if (this.emprendedor.empId === 0) {
      this.buscarContestacionesService
        .validarRFC(this.formulario.value.empRfc)
        .subscribe(
          (rfcRes) => {
            // Si la validación es positiva, procede con el guardado
            this.enviarDatos(bodyRequest);
          },
          (error) => {
            // Si falla, muestra un mensaje de advertencia
            this.toastr.warning('El RFC no pasó la validación', 'Advertencia');
          }
        );
    } else {
      // Si empId no es cero, omitir la validación de RFC y proceder con el guardado
      this.enviarDatos(bodyRequest);
    }
  }

  // Función separada para enviar los datos
  private enviarDatos(bodyRequest: any) {
    this.emprendedorService.saveEmprendedor(bodyRequest).subscribe(
      (emprendedor) => {
        this.emprendedor = emprendedor;
        this.toastr.success(
          'El emprendedor ha sido guardado exitosamente',
          'Transacción exitosa'
        );
        this.emprendedorService.setIsUpdated(true);
        console.log('Emprendedor: ', this.emprendedor);
        this.dialogRef.close();
      },
      (err) => {
        console.log('Error al crear emprendedor:', err);
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  loadCatalogos() {
    this.giros.getAll().subscribe(
      (result) => {
        
        console.log("REsultado");
          console.log(result);
        this.girosList = result.sort((a,b)=>a.girDescripcion.localeCompare(b.girDescripcion));
      },
      (err) => {
        console.error('Error cargando giros', err);
      }
    );

    this.niveles.getAll().subscribe(
      (result) => {
        console.log("REsultado");
          console.log(result);
          
        this.nivelesList = result.sort((a,b) =>a.nieDescripcion.localeCompare(b.nieDescripcion));
      },
      (err) => {
        console.error('Error cargando niveles de estudio', err);
      }
    );

    this.necesidad.getAll().subscribe(
      (result) => {
        
        console.log("REsultado");
          console.log(result);
        this.necesidadesList = result.sort((a, b) => a.necDescripcion.localeCompare(b.necDescripcion));;
      },
      (err) => {
        console.error('Error cargando necesidades', err);
      }
    );
  }
}
