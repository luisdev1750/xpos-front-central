import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmprendedorService } from '../emprendedor.service';
import { BuscarContestacionesService } from '../../monitor/monitor.component.service';
import { format } from 'date-fns';
import { NivelEstudioService } from '../../nivel-estudio/nivel-estudio.service';
import { GiroService } from '../../giro/giro.service';
import { NecesidadService } from '../../necesidad/necesidad.service';
import { NivelEstudio } from '../../nivel-estudio/nivel-estudio';
import { Giro } from '../../giro/giro';
import { Necesidad } from '../../necesidad/necesidad';
import { LoginService } from '../../login/login.service';
import { ApplicationUser } from '../../login/login.service';

@Component({
  selector: 'formulario-previo-cuestionario',
  templateUrl: './registro-emprendedor.component.html',
  styleUrl: './registro-emprendedor.component.css',
})
export class RegistroEmprendedorComponent {
  formulario: FormGroup;
  rfcPattern = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})?$/;
  // Arreglos para almacenar los datos de los catálogos
  nivelesList: NivelEstudio[] = [];
  girosList: Giro[] = [];
  necesidadesList: Necesidad[] = [];
  options: string[] = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];
  selectedOptions: string[] = [];
  user!: ApplicationUser;
  // IDs de las necesidades seleccionadas por el usuario
  selectedNecesidadesIds: number[] = [];
  constructor(
    private fb: FormBuilder,
    private emprendedorService: EmprendedorService,
    private buscarContestacionesService: BuscarContestacionesService,
    public router: Router,
    private toastr: ToastrService,
    private niveles: NivelEstudioService,
    private giros: GiroService,
    private necesidad: NecesidadService,
    private loginServcie: LoginService
  ) {
    this.formulario = this.fb.group({
      empRazonSocial: ['', Validators.required],
      empDomicilio: [''],
      empCorreo: ['', [Validators.required, Validators.email]],
      empTelefono: ['', Validators.required],
      empNombreCompleto: ['', Validators.required],
      empRfc: ['', [Validators.required, Validators.pattern(this.rfcPattern)]],
      empEdad: [null],
      empNie: [null],
      empNombreEmpresa: [''],
      empNombreTemporal: [''],
      empGiro: [null, Validators.required],
      empNec: [null, Validators.required],
    });

    // Agregar el listener para convertir el RFC a mayúsculas
    this.formulario.get('empRfc')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formulario
          .get('empRfc')
          ?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
    this.loginServcie.clearAll();
    this.loadCatalogos();
  }

  onSelectionChange(event: any) {
    this.selectedNecesidadesIds = event.value; // Captura los valores seleccionados
  }

  loadCatalogos() {
    this.giros.getAll().subscribe(
      (result) => {
        this.girosList = result.sort((a, b) =>
          a.girDescripcion.localeCompare(b.girDescripcion)
        );
      },
      (err) => {
        console.error('Error cargando giros', err);
      }
    );

    this.niveles.getAll().subscribe(
      (result) => {
        this.nivelesList = result.sort((a, b) =>
          a.nieDescripcion.localeCompare(b.nieDescripcion)
        );
      },
      (err) => {
        console.error('Error cargando niveles de estudio', err);
      }
    );

    this.necesidad.getAll().subscribe(
      (result) => {
        this.necesidadesList = result.sort((a, b) =>
          a.necDescripcion.localeCompare(b.necDescripcion)
        );
      },
      (err) => {
        console.error('Error cargando necesidades', err);
      }
    );
  }

  onSubmit() {
    console.log('Guardando');
    console.log(this?.user?.userid ?? 1);

    let necesidadesFinal = this.selectedNecesidadesIds.map((necId) => ({
      eneNecId: necId,
      eneEmpId: 0,
    }));
    console.log('Necesidades final.');
    console.log(necesidadesFinal);

    if (this.formulario.invalid) {
      // Marca todos los controles como tocados para que las validaciones se activen
      this.formulario.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa el formulario correctamente.',
        'Advertencia'
      );

      return;
    }

    if (this.formulario.valid) {
      console.log(this.formulario.value);

      let emprendedorRequest = {
        empId: 0,
        empClave: this.formulario.value.empClave,
        empRazonSocial: this.formulario.value.empRazonSocial,
        empDomicilio: this.formulario.value.empDomicilio,
        empTelefono: this.formulario.value.empTelefono,
        empCorreo: this.formulario.value.empCorreo,
        empNombreCompleto: this.formulario.value.empNombreCompleto,
        empRFC: this.formulario.value.empRfc,
        empEdad: this.formulario.value.empEdad,
        empNieId: this.formulario.value.empNie,
        empNombreEmpresa: this.formulario.value.empNombreEmpresa,
        empNombreTemporal: this.formulario.value.empNombreTemporal,
        empIndustria: this.formulario.value.empIndustria,
        empGiroId: this.formulario.value.empGiro,
        empNecId: 1,
      };

      let bodyRequest = {
        nuevoEmprendedor: emprendedorRequest,
        necesidades: necesidadesFinal,
      };

      console.log('Datos a enviar');
      console.log(emprendedorRequest);

      // Validación del RFC
      this.buscarContestacionesService
        .validarRFC(emprendedorRequest.empRFC)
        .subscribe({
          next: (res) => {
            console.log('RFC válido:', emprendedorRequest.empRFC);

            this.emprendedorService.saveEmprendedor(bodyRequest).subscribe({
              next: (res) => {
                emprendedorRequest.empId = res.empId;
                const fechaActual = new Date();
                const fechaFormateada = format(fechaActual, 'MM/dd/yyyy HH:mm');
                localStorage.setItem('rfc', emprendedorRequest.empRFC ?? '');
                localStorage.setItem('empId', `${emprendedorRequest.empId}`);
                localStorage.setItem(
                  'emprendedor',
                  JSON.stringify(emprendedorRequest)
                );
                localStorage.setItem('fechaActual', fechaFormateada);
                console.log('Fecha a enviar: ');
                console.log(fechaFormateada);

                this.router.navigate(['/cuestionario', 0]);
              },
              error: (error) => {
                console.log('Error al crear emprendedor:', error);
                this.toastr.error('Error al crear emprendedor.', 'Error');
              },
            });
          },
          error: (error) => {
            console.log('RFC no válido:', error.error.message);
            this.toastr.error(`${error.error.message} `, 'Error');
          },
        });
    } else {
      // Si el formulario no es válido, mostrar un mensaje
      this.toastr.warning(
        'Por favor, completa el formulario correctamente.',
        'Advertencia'
      );
    }
  }
}
