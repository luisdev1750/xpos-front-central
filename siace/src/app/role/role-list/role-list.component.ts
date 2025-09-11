import { LocationStrategy } from '@angular/common';
import {
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { GlobalComponent } from '../../common/global-component';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { EmprendedorFilter } from '../../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';
import { Role } from '../role';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { RoleFilter } from '../role-filter';
import { RoleService } from '../role.service';


@Component({
  selector: 'app-role',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.css'],
})
export class RoleListComponent extends GlobalComponent implements OnDestroy {
  displayedColumns = ['rolId', 'rolNombre', 'rolSufix', 'actions'];
  filter = new RoleFilter();

  private subs!: Subscription;

  //Buscador de emprededores
  empFilter!: string;
  empModelFilter!: Emprendedor[];
  emp!: Emprendedor;
  logEmpId!: number;
  logEmpNombre!: string;
  logRoleId!: string;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  /* Inicialización */

  constructor(
    override empService: EmprendedorService,
    private roleService: RoleService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    protected override locationStrategy: LocationStrategy,
    private paginatoor: MatPaginatorIntl
  ) {
    super(empService, locationStrategy);

    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';

    this.paginatoor.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };

    this.subs = this.roleService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.empId = this.user.empId;

    this.filter.rolId = '0';
    if (this.user.role == '1') this.empId = 0; //Caso admin
    if (this.user.role == '6') this.empId = this.empId; //Caso emprendedor

    this.logEmpId = this.user.empId;
    this.logEmpNombre = this.user.empRazonSocial;
    this.logRoleId = this.user.role;
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get roleList(): Role[] {
    return this.roleService.roleList;
  }


  /* Métodos */
  add() {
    let newRole: Role = new Role();
    newRole.rolEmpId = Number(this.filter.rolEmpId);
    this.edit(newRole);
  }


  override changeEmprendedor() {
    this.search();
  }


  edit(ele: Role) {
    const selectedEmpId = this.empId === 0 && ele.rolEmpId ? ele.rolEmpId : this.empId;
    // const selectedEmpText = this.empFilter 
    // ? this.empFilter 
    // : this.empModel.find(e => e.empId === selectedEmpId)?.empRazonSocial || '';
    const selectedEmpText = this.empFilter
    ? this.empFilter
    : {
        empId: selectedEmpId,
        empRazonSocial: this.empModel.find(e => e.empId === selectedEmpId)?.empRazonSocial || '',  // Asigna el valor de empRazonSocial
        empCorreo: '',  // Asegúrate de agregar todas las propiedades del tipo 'Emprendedor'
        empDomicilio: '',
        empTelefono: '',
        empEdad: null,  // Asegúrate de incluir las propiedades faltantes como 'empEdad'
        empNieId: null,
        empIndustria: null,
        empNecId: null,
        // Agrega las propiedades faltantes aquí
      };
    this.dialog.open(RoleEditComponent, {
      data: {
        role: JSON.parse(JSON.stringify(ele)),
        emprendedores: this.empModel,
        empText: selectedEmpText,
        empId: selectedEmpId,
      },
      minWidth: '400px',
    });
  }


  delete(role: Role): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el rol?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      console.log("Resultado del borrado:"); 
      console.log(result);
      
      if (result === true) {
        this.roleService.delete(role).subscribe(
          (result) => {
            if (result) {
              this.toastr.success(
                'El rol ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.roleService.setIsUpdated(true);
            } 
          },
          (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
      }
    });
  }


  search(): void {
    this.filter.rolEmpId = this.empId!.toString();

    this.roleService.load(this.filter, this.logEmpId).subscribe({
      next: (roles: Role[]) => {
        this.roleService.roleList = roles; // Asigna la lista completa de roles
        this.dataSource.data = roles; // Asignamos los datos al MatTableDataSource
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar los roles', err);
      },
    });
    // }
    //this.roleService.load(this.filter);
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
    this.search();
  }

  
  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }


  selectEmprendedor(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      this.search();
    }
  }
}
