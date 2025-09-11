import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { EmprendedorFilter } from '../../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';
import { Objetivo } from '../../objetivo/objetivo';
import { ObjetivoFilter } from '../../objetivo/objetivo-filter';
import { ObjetivoService } from '../../objetivo/objetivo.service';
import { TipoSesion } from '../../tipo-sesion/tipo-sesion';
import { Sesion } from '../sesion';
import { SesionObjetivo } from '../sesion-objetivo';
//import { SesionAddObjectiveComponent } from '../sesion-add-objective/sesion-add-objective.component';
import { SesionObjetivoFilter } from '../sesion-objetivo-filter';
import { SesionObjetivoService } from '../sesion-objetivo.service';
import { SesionService } from '../sesion.service';
import { TipoSesionService } from '../../tipo-sesion/tipo-sesion.service';
import { GeneralComponent } from '../../common/general-component';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-sesion-edit',
  templateUrl: './sesion-edit.component.html',
  styleUrls: ['./sesion-edit.component.css']
})
export class SesionEditComponent extends GeneralComponent implements OnInit {
  id!: string;
  sesion!: Sesion;
  fecha!: Date;
  sesHoraIni!: string;
  sesHoraFin!: string;
  tisModel!: TipoSesion[];
  empFilter!: string;
  emp!: Emprendedor;
  empModelFilter!: Emprendedor[];
  empRazonSocial!: string;
  sesTisNombre!: string;

  //Formatos
  objetivos: Objetivo[] = [];
  dataSource = new MatTableDataSource<Objetivo>(this.objetivos);
  displayedColumns: string[] = ['objetivo'];
  selectedObjetivoId: number | null = null;

  fileNames: string[] = ['', '', '', ''];
  idSesion: number = 0;
  idObjetivo: number = 0;
  idObjTis: number = 0;
  myGroup!: FormGroup;
  initialData: boolean = false;

  @Output() archivoCargado: EventEmitter<void> = new EventEmitter<void>();
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<SesionEditComponent>,
    private sesionService: SesionService,
    private empService: EmprendedorService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private objetivosService: ObjetivoService,
    private tisService: TipoSesionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,

    // public dialogRef1: MatDialogRef<SesionAddObjectiveComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // public data1: { sesId: number; objId: number, objTisId: number },
    private sesionObjetivoService: SesionObjetivoService,
    protected override locationStrategy: LocationStrategy
  ) {
    super(locationStrategy);
    this.sesion = data.sesion;
    this.fecha = data.sesion.sesHoraIni;
    this.sesHoraIni = data.sesion.sesHoraIni.toString().substring(11, 16);
    this.sesHoraFin = data.sesion.sesHoraFin.toString().substring(11, 16);
    this.tisModel = data.tisModel;
    this.emp = data.sesion.sesEmp;
    //this.empFilter=this.emp?this.emp.empRazonSocial:'';
    this.empRazonSocial = this.emp ? this.emp.empRazonSocial : '';
    this.sesTisNombre = data.sesion.sesTisNombre;
    this.idSesion = this.data.sesion.sesId;
    //this.idObjetivo = objetivo.objId;
    //this.idObjTis = this.sesion.sesTisId;
    this.myGroup = new FormGroup({
      multiplefile: new FormControl(),
    });
  }

  ngOnInit() {
    this.listarElementos();
    this.searchObjetivos();
    this.selectEmprendedorMethod(this.data);
    this.updateTisModel(this.sesion.sesEmpId);
  }


  /* Accesosors */
  get formatoObjetivo() {
    return this.sesionObjetivoService.sesionObjetivoList;
  }


  /*Métodos*/
  changeEmprendedorFilter() {
    //this.empModelFilter=this.empModel.filter(f=>f.empRazonSocial.toLowerCase().includes(this.empFilter));
    let empFilter = new EmprendedorFilter();
    empFilter.empPatron = this.empFilter;
    this.empService.findByPatternAllStages(empFilter).subscribe({
      next: (emps) => {
        this.empModelFilter = emps;
      },
      // error: (err) => {
      //   this.toastr.error('Ha ocurrido un error', 'Error');
      // },
    });
  }


  cleanEmprendedor() {
    this.empFilter = '';
    this.empRazonSocial = '';
    this.emp = new Emprendedor();
    let empVacio = 0;
    this.updateTisModel(empVacio);
  }


  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }


  save() {
    if (this.fecha == undefined) {
      this.toastr.warning('Es necesario seleccionar una fecha', 'Precaución');
      return;
    } else if (this.sesHoraIni == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una hora inicial',
        'Precaución'
      );
      return;
    } else if (this.sesHoraFin == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una hora final',
        'Precaución'
      );
      return;
    } else if (this.emp == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar un emprendedor',
        'Precaución'
      );
      return;
    }

    let ses = JSON.parse(JSON.stringify(this.sesion));
    ses.sesHoraIni =
      this.fecha.toString().substring(0, 11) + this.sesHoraIni + ':00.000Z';
    ses.sesHoraFin =
      this.fecha.toString().substring(0, 11) + this.sesHoraFin + ':00.000Z';
    ses.sesEmpId = this.emp.empId;
    this.sesionService.save(ses).subscribe({
      next: (sesion) => {
        //this.sesion = sesion;
        this.toastr.success(
          'El sesion ha sido guardado exitosamente',
          'Transacción exitosa'
        );
        this.sesionService.setIsUpdated(true);
        console.log("cerrando");

        this.dialogRef.close(true);
      },
      error: (err) => {
        if (err.status === 409) { // Suponiendo que el código de estado HTTP es 409 (conflicto)
          this.toastr.warning(
            'El emprendedor ya tiene una sesión de este tipo.',
            'Conflicto'
          );
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      }
    });
  }

  selectEmprendedor(sesion: any) {
    console.log('Estamos dando click a esto: ');
    console.log(sesion);

    if (sesion.option) {
      this.emp = sesion.option.value;
      this.updateTisModel(sesion.option.value.empId);
    }
  }


  selectEmprendedorMethod(data: any) {
    console.log(data);
    if (data.sesion) {
      console.log('asignando emprendedor');
      console.log(data.sesion.sesEmpId);
      if (data.sesion.sesEmpId == 0) {
        return;
      }
      // this.emp = data.sesion  ;
      this.empService.findById(data.sesion.sesEmpId.toString()).subscribe({
        next: (res) => {
          console.log('Respuesta');
          console.log(res);

          this.emp = res;
          console.log('Valor del emprendedor actual: ');
          console.log(this.emp);
          this.initialData = true;
        },
        error: (error) => {
          console.log('error en el metodo');
        },
      });
    }
  }


  //Formatos
  cerrar() {
    this.dialogRef.close(true);

  }


  createFormGroup() {
    const group: any = {};
    this.formatoObjetivo.forEach((formato, index) => {
      group[`multiplefile${index}`] = new FormControl();
    });
    this.myGroup = this.formBuilder.group(group);
  }


  listarElementos(): void {
    //console.log('Sesion: ', this.sesion);
    console.log('Clave Sesion: ', this.sesion.sesId);
    console.log('Clave Emprendedor: ', this.sesion.sesEmpId);
    console.log('Clave Tipo Sesiones: ', this.sesion.sesTisId);
  }


  onPanelOpen(objetivo: Objetivo): void {
    console.log('Expanded Objetivo ID:', objetivo.objId);
    this.selectedObjetivoId = objetivo.objId;
    this.search(this.selectedObjetivoId);
  }


  search(objetivoId: number) {
    let seoFilter = new SesionObjetivoFilter();
    seoFilter.sesId = this.sesion.sesId.toString();
    seoFilter.objId = objetivoId.toString();
    //seoFilter.objTisId = this.idObjTis.toString();
    this.sesionObjetivoService.loadFormatos(seoFilter).subscribe(() => {
      this.createFormGroup();
    });
  }


  searchObjetivos() {
    if (this.sesion.sesId) {
      console.log('sesId: ', this.sesion.sesId);
      let objFilter = new ObjetivoFilter();
      objFilter.sesId = this.sesion.sesId.toString();

      this.objetivosService.findObjetivos(objFilter).subscribe({
        next: (objs) => {
          this.objetivos = objs;
          this.dataSource.data = this.objetivos;
        },
        error: (err) => {
          console.log('Error');
        },
      });
    }
  }


  setFilename(files: any, index: number) {
    if (files[0]) {
      this.fileNames[index] = files[0].name;
      /*if(index==0) this.risk.rieMitigacionUrl='';
         else if(index==1) this.risk.rieMitigacionCertificadoUrl='';
         else if(index==2) this.risk.rieAccionUrl='';
         else if(index==3) this.risk.rieAccionCertificadoUrl='';*/
    }
  }


  onDeleteClick(formato: SesionObjetivo): void {
    if (!formato.seoArchivo) {
      this.toastr.warning('No hay archivo que eliminar', 'Advertencia');
    } else {
      this.sesionObjetivoService.delete(formato.seoId).subscribe({
        next: (response) => {
          this.toastr.success('Archivo eliminado exitosamente', 'Éxito');
          this.search(formato.seoObjId);
          this.archivoCargado.emit();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el archivo', 'Error');
          console.error('Error al eliminar el archivo:', error);
        },
      });
    }
  }


  onDownloadClick(formato: string): void {
    // Obtener la fecha actual y restar 6 horas
    const date = new Date();
    date.setHours(date.getHours() - 6); // Resta 6 horas

    // Formatear la fecha como yyyyMMddHHmmss
    let formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 15);
    formattedDate = formattedDate.replace(/\.$/, '');

    // Construir la URL completa
    const url = `${formato}?${this.user.blobToken}`;

    // Descargar el archivo con el nombre personalizado
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al descargar el archivo.");
        }
        return response.blob();
      })
      .then(blob => {
        // Obtener el nombre base del archivo original
        const fileName = formato.split('/').pop() ?? 'archivo';

        // Separar el nombre y la extensión
        const dotIndex = fileName.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
        const extension = dotIndex !== -1 ? fileName.substring(dotIndex) : '';

        // Crear un enlace temporal para descargar el archivo
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${baseName}_${formattedDate}${extension}`; // Nombre con la fecha antes de la extensión
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Liberar el objeto URL
        URL.revokeObjectURL(downloadUrl);
      })
      .catch(error => {
        console.error("Error al descargar el archivo:", error);
      });
  }


  onFileSelected(event: Event, evidencia: any, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      evidencia.requireDescription = true;
      this.setFilename(input.files, index);
    }
  }


  onSaveClick(): void {
    if (this.idSesion !== null) {
      this.formatoObjetivo.forEach((formato, index) => {
        const control = this.myGroup.get(`multiplefile${index}`) as FormControl;
        const files = control?.value?.files;

        if (files && files.length > 0) {
          const file = files[0];
          this.sesionObjetivoService
            .upload(file, this.idSesion, formato.objId)
            .subscribe({
              next: (response) => {
                console.log('Archivo subido:', response);
                this.toastr.success('Archivo(s) subido(s) exitosamente', 'Éxito');
                this.search(formato.objId);
                this.archivoCargado.emit();
              },
              error: (error) => {
                this.toastr.error('Error al subir el archivo');
                console.error('Error al subir el archivo:', error);
              },
            });
        }
      });
    } else {
      console.error('idSesion is null');
    }
  }


  updateTisModel(empId: number) {
    this.tisService.findByEmp(empId).subscribe({
      next: async tiss => {
        this.tisModel = tiss;
      },
      error: error => {
        alert(error.message);
      }
    });
  }
}
