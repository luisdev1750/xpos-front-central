import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormatoApoyo } from '../formato-apoyo';
import { FormatoApoyoService } from '../formato-apoyo.service';


@Component({
  selector: 'app-formato-apoyo-edit',
  templateUrl: './formato-apoyo-edit.component.html',
  styleUrls: ['./formato-apoyo-edit.component.css']
})
export class FormatoApoyoEditComponent implements OnInit {

  apoyoForm!: FormGroup;

  id!: string;
  formatoApoyo!: FormatoApoyo;

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<FormatoApoyoEditComponent>,
    private formatoApoyoService: FormatoApoyoService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: FormatoApoyo) {
    //this.formatoApoyo=data;
    this.initForm(data);
  }


  ngOnInit() {
  }

  /*Métodos*/

  initForm(data: FormatoApoyo) {
    this.apoyoForm = new FormGroup({
      foaId: new FormControl({ value: data.foaId, disabled: data.foaId > 0 }),
      basicfile: new FormControl(null),
      foaApoId: new FormControl(data.foaApoId)
    });
  }



  save() {
    if (this.apoyoForm.valid) {
      const formato: FormatoApoyo = this.apoyoForm.getRawValue();
      const file: File | null = this.apoyoForm.get('basicfile')?.value.files[0] || null;  // Asumiendo que 'basicfile' es la clave del campo del archivo en el formulario

      this.formatoApoyoService.save(formato, file).subscribe(
        apoyo => {
          this.toastr.success('El apoyo ha sido guardado exitosamente', 'Transacción exitosa');
          this.formatoApoyoService.setIsUpdated(true);
          this.dialogRef.close();
        },
        err => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
    }
  }
}
