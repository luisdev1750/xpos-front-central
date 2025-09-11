import { LocationStrategy } from '@angular/common';
import {
  Component,
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
import { GlobalComponent } from '../../common/global-component';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { EmprendedorFilter } from '../../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';
import { Modulo } from '../../modulo/modulo';
import { ModuloFilter } from '../../modulo/modulo-filter';
import { Role } from '../../role/role';
import { RoleFilter } from '../../role/role-filter';
import { RoleService } from '../../role/role.service';
import { Permiso } from '../permiso';
import { PermisoService } from '../permiso.service';


@Component({
  selector: 'app-permiso',
  templateUrl: 'permiso-list.component.html',
  styleUrls: ['permiso-list.component.css'],
})
export class PermisoListComponent extends GlobalComponent {
  displayedColumns = ['modNombre', 'perChecked'];
  filter = new ModuloFilter();
  private subs!: Subscription;

  perModel!: Modulo[];
  rolModel!: Role[];
  rolId!: number;

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
    private rolService: RoleService,
    private grantService: PermisoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    override locationStrategy: LocationStrategy,
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

    this.subs = this.grantService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.perModel = [];
    //if(this.user.role=='1') this.prmId=0; //Caso admin

    this.user = JSON.parse(localStorage.getItem('user')!);
    this.logEmpId = this.user.empId;
    this.logEmpNombre = this.user.empRazonSocial;
    this.logRoleId = this.user.role;

    // if (this.logEmpId) {
    //    this.empId = this.logEmpId;  // Aquí se asigna el valor inicial
    //  } else {
    //    this.empId = 0;  // 'Todos' si no hay logEmpId
    //  }
  }

  /* Métodos */

  override changeEmprendedor() {
    // Verifica si logEmpId está presente y asigna empId si es necesario
    if (this.logEmpId) {
      this.empId = this.logEmpId; // Asegura que empId tome el valor de logEmpId si está definido
    }
    let rolFilter: RoleFilter = new RoleFilter();
    rolFilter.rolId = '0';
    rolFilter.rolEmpId = this.empId!.toString();
    this.rolService.find(rolFilter).subscribe({
      next: async (roles) => {
        this.rolModel = roles.sort((a, b) => a.rolNombre.localeCompare(b.rolNombre));;
        if (roles.length > 0) this.rolId = roles[0].rolId;
        else this.rolId = 0;

        this.search();
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  changePermiso(mod: Modulo) {
    let ele: Permiso = new Permiso();
    ele.perModId = mod.modId;
    ele.perRolId = this.rolId;
    this.grantService.save(ele).subscribe(
      (result) => {
        if (Number(result) > 0) {
          this.toastr.success(
            'El permiso ha sido generado exitosamente',
            'Transacción exitosa'
          );
          this.grantService.setIsUpdated(true);
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  
  search(): void {
    this.filter.empId = this.empId!.toString();
    this.filter.rolId = this.rolId.toString();
    this.grantService.find(this.filter).subscribe(
      async (pers) => {
        this.perModel = pers;

        this.dataSource.data = pers; // Asignamos los datos al MatTableDataSource
        this.dataSource.paginator = this.paginator;
        console.log('EmpId para permisos: ', this.filter.empId);
        console.log('RolId para permisos: ', this.filter.rolId);
        console.log('Arrar de permisos: ', this.dataSource.data);
      },
      (error) => {
        alert(error.message);
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
    let rolFilter: RoleFilter = new RoleFilter();
    rolFilter.rolId = '0';
    rolFilter.rolEmpId = this.empId!.toString();
    this.rolService.find(rolFilter).subscribe({
      next: async (roles) => {
        this.rolModel = roles;
        if (roles.length > 0) this.rolId = roles[0].rolId;
        else this.rolId = 0;

        this.search();
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }


  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }


  selectEmprendedor(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      let rolFilter: RoleFilter = new RoleFilter();
      rolFilter.rolId = '0';
      rolFilter.rolEmpId = this.empId!.toString();
      this.rolService.find(rolFilter).subscribe({
        next: async (roles) => {
          this.rolModel = roles;
          if (roles.length > 0) this.rolId = roles[0].rolId;
          else this.rolId = 0;

          this.search();
        },
        error: (error) => {
          alert(error.message);
        },
      });
    }
  }
}
