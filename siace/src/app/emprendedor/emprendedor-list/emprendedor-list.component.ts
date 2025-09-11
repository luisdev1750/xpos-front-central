import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ApplicationUser } from '../../login/login.service';
import { Emprendedor } from '../emprendedor';
import { EmprendedorEditComponent } from '../emprendedor-edit/emprendedor-edit.component';
import { EmprendedorFilter } from '../emprendedor-filter';
import { EmprendedorService } from '../emprendedor.service';
import { GlobalComponent } from '../../common/global-component';

@Component({
  selector: 'app-emprendedor',
  templateUrl: 'emprendedor-list.component.html',
  styles: [],
})
export class EmprendedorListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    //'empId',
    'empRazonSocial',
    'empRfc',
 
    'empDomicilio',
    'empTelefono',
    'empCorreo',
    //'empNivelEstudios',
    //'empNombreEmpresa',
    //'empNombreTemporal',
    //'empIndustria',
    //'empNecesidades',
    'empVersion',
    'empFechaBaja', 
    'actions',
  ];
  dataSource = new MatTableDataSource<Emprendedor>();
  filter = new EmprendedorFilter();
  selectedEmprendedor!: Emprendedor;
  user!: ApplicationUser;
  private subs!: Subscription;
  // Lista de opciones para el combobox
  tipos: string[] = ['Activo', 'Eliminado'];

  // Objeto de selección de estado
  statusSelection = {
    empTipo: 'Activo', 
  };


  onSelectionChange(event: any) {
    console.log('Tipo seleccionado:', event.value);
    this.search(); 
  }

  //Buscador de emprededores
  empFilter!: string;
  empRfc!: string;
  empModelFilter!: Emprendedor[];
  emp!: Emprendedor;
  empId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /* Inicialización */

  constructor(
    private emprendedorService: EmprendedorService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatoor: MatPaginatorIntl
  ) {
    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';
    this.user = JSON.parse(localStorage.getItem('user')!);

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
  }

  ngOnInit() {
    this.subs = this.emprendedorService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.empId = '0';

    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /* Accesors */

  get emprendedorList(): Emprendedor[] {
    return this.emprendedorService.emprendedorList;
  }

  /* Métodos */

  add() {
    let newEmprendedor: Emprendedor = new Emprendedor();

    newEmprendedor.empId = Number(this.filter.empId);

    this.edit(newEmprendedor);
  }

  delete(emprendedor: Emprendedor): void {
    console.log('Usuario actual: ');
    console.log(this.user);

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el emprendedor?: ',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.emprendedorService.delete(emprendedor, this.user.userid).subscribe(
          () => {
            this.toastr.success(
              'El emprendedor ha sido eliminado exitosamente',
              'Transacción exitosa'
            );
            this.emprendedorService.setIsUpdated(true);
          },
          (err) => {
            console.log('Error');
            console.log(err.error);

            this.toastr.error(err.error, 'Error');
          }
        );
      }
    });
  }

  edit(ele: Emprendedor) {
    this.dialog.open(EmprendedorEditComponent, {
      data: ele,
      height: '80vh',
      minWidth: '450px',
      width: '600px',
    });
    console.log('emprendedor: ', ele);
  }

  search(): void {
    console.log('empId filtrado: ', this.filter.empId);
    this.emprendedorService.load(this.filter, this.statusSelection.empTipo === 'Activo').subscribe({
      next: (emprendedores: Emprendedor[]) => {
        this.emprendedorService.emprendedorList = emprendedores; // Asigna la lista completa
        this.dataSource.data = emprendedores; // Asignamos los datos al MatTableDataSource
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar los roles', err);
      },
    });
  }

  select(selected: Emprendedor): void {
    this.selectedEmprendedor = selected;
  }

  //----------------------- Filtro Razon Social
  changeRazonFilter() {
    let empFilter = new EmprendedorFilter();
    empFilter.empPatron = this.empFilter;
    this.emprendedorService.findByPatternAll(empFilter).subscribe({
      next: (emps) => {
        this.empModelFilter = emps;
      },
      // error: (err) => {
      //   this.toastr.error('Ha ocurrido un error', 'Error');
      // },
    });
  }

  cleanRazon() {
    this.empFilter = '';
    this.emp = new Emprendedor();
    this.empId = 0;
    this.filter.empId = '0';
    this.search();
  }

  cleanRazonInput() {
    this.empFilter = '';
  }

  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }

  selectRazon(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      this.filter.empId = this.empId.toString();
      this.cleanRfcInput();
      this.search();
      console.log('Emprendedor seleccionado: ', this.empId);
    }
  }

  //----------------------- Filtro RFC
  changeRfcFilter() {
    let empRfc = new EmprendedorFilter();
    empRfc.empPatron = this.empRfc;
    this.emprendedorService.findByPatternRfc(empRfc).subscribe({
      next: (emps) => {
        this.empModelFilter = emps;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  cleanRfc() {
    this.empRfc = '';
    this.emp = new Emprendedor();
    this.empId = 0;
    this.filter.empId = '0';
    this.search();
  }

  cleanRfcInput() {
    this.empRfc = '';
  }

  displayFnRfc(emp: Emprendedor): string {
    return emp && emp.empRfc ? emp.empRfc : '';
  }

  selectRfc(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      this.filter.empId = this.empId.toString();
      this.cleanRazonInput();
      this.search();
      console.log('Emprendedor seleccionado: ', this.empId);
    }
  }
}
