import { Component, Inject, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { Role } from '../role';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { ApplicationUser } from '../../login/login.service';
import { EmprendedorFilter } from '../../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'form { display: flex; flex-direction: column;  }',
    'form > * { width: 100% }',
  ],
})
export class RoleEditComponent implements OnInit {
  id!: string;
  role!: Role;
  emprendedores!: Emprendedor[];

  //Buscador de emprededores
  empFilter!: string;
  empModelFilter!: Emprendedor[];
  emp!: Emprendedor;
  empId!: number;
  user!: ApplicationUser;
  logEmpId!: number;
  logEmpNombre!: string;
  logRoleId!: string;

  constructor(
    private dialogRef: MatDialogRef<RoleEditComponent>,
    private roleService: RoleService,
    private toastr: ToastrService,
    private empService: EmprendedorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.role = data.role;
    this.emprendedores = data.emprendedores;
    this.empFilter = data.empText;
    this.role.rolEmpId = data.empId;
    console.log('Data obtenida en roleList: ', this.data);
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.logEmpId = this.user.empId;
    this.logEmpNombre = this.user.empRazonSocial;
    this.logRoleId = this.user.role;
  }

  ngOnInit() {
    if (this.logEmpId) { // Si logEmpId no es nulo o indefinido
      this.role.rolEmpId = this.logEmpId; // Asignar logEmpId si está disponible
    } else if (this.data.empId) { // Si no hay logEmpId, asignar empId desde los datos recibidos
      this.role.rolEmpId = this.data.empId;
      console.log('RolEmpId de rol seleccionado: ', this.role.rolEmpId);
    } else {
      // Si no hay logEmpId ni empId, puedes dejar el valor actual o asignar un valor por defecto
      console.log('No se ha asignado ningún emprendedor');
    }
  }


  /*Metodos*/
  save() {
    this.roleService.save(this.role).subscribe(
      (result) => {
        if (result && result.rolId > 0) {
          this.toastr.success(
            'El rol ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.roleService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      (err) => {
        if (err.status === 409) {
          // Código 409 para el conflicto de duplicado de sufijo
          this.toastr.error('El sufijo de rol para este emprendedor ya está en uso.', 'Error de Duplicado');
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      }
    );
  }


  //---------------- Filtro emprendedor
  changeEmprendedorFilter() {
    let empFilter = new EmprendedorFilter();
    empFilter.empPatron = this.empFilter;
    this.empService.findByPattern(empFilter).subscribe({
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
    this.emp = new Emprendedor();
    this.empId = 0;
    //this.search();
  }


  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }


  selectEmprendedor(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      this.role.rolEmpId = this.empId;
      //this.search();
      console.log('Emprendedor seleccionado: ', this.role.rolEmpId);
    }
  }
}
