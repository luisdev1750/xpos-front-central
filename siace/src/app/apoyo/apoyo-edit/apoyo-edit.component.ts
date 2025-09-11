import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Apoyo } from '../apoyo';
import { ApoyoService } from '../apoyo.service';
import { GeneralComponent } from '../../common/general-component';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-apoyo-edit',
  templateUrl: './apoyo-edit.component.html',
  styleUrls: ['apoyo-edit.component.css']
})
export class ApoyoEditComponent extends GeneralComponent implements OnInit {

  apoyoForm!: FormGroup;

  id!: string;
  apoyo!: Apoyo;

  veaFechaActivacion!: DateTime;

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ApoyoEditComponent>,
    private apoyoService: ApoyoService,
    private toastr: ToastrService,
    protected override locationStrategy: LocationStrategy,
    @Inject(MAT_DIALOG_DATA) public data: { apoyo: Apoyo, veaFechaActivacion: DateTime }) {
    //this.apoyo=data;
    super(locationStrategy);
    this.initForm(data.apoyo);
    this.veaFechaActivacion = data.veaFechaActivacion;
  }


  ngOnInit() {
  }

  /*Métodos*/

  initForm(data: Apoyo) {
    this.apoyoForm = new FormGroup({
      apoId: new FormControl({ value: data.apoId, disabled: data.apoId > 0 }),
      apoTitulo: new FormControl(data.apoTitulo, Validators.required),
      apoDescripcion: new FormControl(data.apoDescripcion, Validators.required),
      basicfile: new FormControl(null),  // Manejar archivo
      apoLiga: new FormControl(data.apoLiga),
      apoAaaId: new FormControl(data.apoAaaId)
    });
  }


  getFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }


  save() {
    if (this.apoyoForm.valid) {
      const apoyo: Apoyo = this.apoyoForm.getRawValue();
      //const file: File | null = this.apoyoForm.get('basicfile')?.value.files[0] || null;  // Asumiendo que 'basicfile' es la clave del campo del archivo en el formulario
      let file: File | null = null;
      const basicfileControl = this.apoyoForm.get('basicfile')?.value;
      if (basicfileControl && basicfileControl.files && basicfileControl.files.length > 0) {
        file = basicfileControl.files[0];  // Asignar el archivo si existe
      }

      this.apoyoService.save(apoyo, file).subscribe(
        apoyo => {
          this.toastr.success('El apoyo ha sido guardado exitosamente', 'Transacción exitosa');
          this.apoyoService.setIsUpdated(true);
          this.dialogRef.close();
        },
        err => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
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


  onDeleteClick(data: Apoyo): void {
    if (!data.apoTutorial) {
      this.toastr.warning('No hay archivo que eliminar', 'Advertencia');
    } else {
      this.apoyoService.deleteDoc(data.apoId).subscribe({
        next: (response) => {
          this.toastr.success('Archivo eliminado exitosamente', 'Éxito');
          //this.data.apoyo.apoTutorialDoc = "";
          this.data.apoyo.apoTutorialUrl = "";
          this.initForm(data);
          this.apoyoService.setIsUpdated(true);
          //this.evidenciasCambios.emit();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el archivo', 'Error');
          console.error('Error al eliminar el archivo:', error);
        },
      });
    }
  }

}
