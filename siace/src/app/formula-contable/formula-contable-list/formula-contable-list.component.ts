import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormulaContableFilter } from '../formula-contable-filter';
import { FormulaContableService } from '../formula-contable.service';
import { FormulaContable } from '../formula-contable';
import { FormulaContableEditComponent } from '../formula-contable-edit/formula-contable-edit.component';
import { FormulaCopyDialogComponent } from '../formula-copy/formula-copy-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';
import { SelectionModel } from '@angular/cdk/collections';

interface FormulaToken {
  value: string;
  type: 'variable' | 'operator' | 'number' | 'parenthesis';
  tooltip?: string;
}

@Component({
  selector: 'app-formula-contable',
  standalone: false,
  templateUrl: 'formula-contable-list.component.html',
  styleUrls: ['./formula-contable-list.component.css']
})
export class FormulaContableListComponent implements OnInit {
  displayedColumns = [
    'select',
    'focId',
    'focSucId',
    'focFormula',
    'focClave',
    'focNombre',
    'focEstatusEdicion',
    'actions',
  ];
  
  filter = new FormulaContableFilter();
  selection = new SelectionModel<FormulaContable>(true, []);

  private subs!: Subscription;
  listSucursales: any = [];
  variablesContables: any[] = [];

  constructor(
    private formulaContableService: FormulaContableService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService
  ) {
    this.subs = this.formulaContableService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.focId = '0';
    this.filter.focSucId = '0';
  }

  ngOnInit() {
    this.loadCatalog();
    this.loadVariables();
    this.search();
  }

  OnSucursalChange(event: any) {
    this.filter.focSucId = event.value;
    this.selection.clear();
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalog() {
    this.sucursalService.findAll().subscribe({
      next: (result) => {
        this.listSucursales = result;
      },
      error: (err) => {
        this.toastr.error(
          'Ha ocurrido un error al cargar las sucursales',
          'Error'
        );
      },
    });
  }

  loadVariables() {
    this.formulaContableService.findVariables(0).subscribe({
      next: (result) => {
        this.variablesContables = result;
      },
      error: (err) => {
        console.error('Error al cargar variables', err);
      },
    });
  }

  parseFormula(formula: string): FormulaToken[] {
    if (!formula || formula.trim() === '') {
      return [];
    }

    const tokens: FormulaToken[] = [];
    const parts = formula.split(' ').filter(p => p.trim() !== '');

    for (const part of parts) {
      let token: FormulaToken;

      if (this.isOperator(part)) {
        token = {
          value: this.formatOperator(part),
          type: 'operator',
          tooltip: this.getOperatorName(part)
        };
      } else if (part === '(' || part === ')') {
        token = {
          value: part,
          type: 'parenthesis',
          tooltip: part === '(' ? 'Paréntesis de apertura' : 'Paréntesis de cierre'
        };
      } else if (this.isNumber(part)) {
        token = {
          value: part,
          type: 'number',
          tooltip: `Número: ${part}`
        };
      } else {
        const variable = this.variablesContables.find(v => v.vacClave === part);
        token = {
          value: part,
          type: 'variable',
          tooltip: variable ? variable.vacNombre : part
        };
      }

      tokens.push(token);
    }

    return tokens;
  }

  private isOperator(token: string): boolean {
    return ['+', '-', '*', '/', '^'].includes(token);
  }

  private isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(Number(token));
  }

  private formatOperator(operator: string): string {
    const operatorMap: { [key: string]: string } = {
      '*': '×',
      '/': '÷',
      '^': '^',
      '+': '+',
      '-': '−' 
    };
    return operatorMap[operator] || operator;
  }

  private getOperatorName(operator: string): string {
    const nameMap: { [key: string]: string } = {
      '+': 'Suma',
      '-': 'Resta',
      '*': 'Multiplicación',
      '/': 'División',
      '^': 'Potencia'
    };
    return nameMap[operator] || operator;
  }

  get formulaContableList(): FormulaContable[] {
    return this.formulaContableService.formulaContableList;
  }

  add() {
    let newFormulaContable: FormulaContable = new FormulaContable();
    this.edit(newFormulaContable, false);
  }

delete(formulaContable: FormulaContable): void {
  const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Confirmación',
      message: '¿Está seguro de eliminar la fórmula contable?',
    },
  });
  
  confirmDialog.afterClosed().subscribe((result) => {
    if (result === true) {
      this.formulaContableService.delete(formulaContable).subscribe({
        next: (result) => {
          if (result.focId > 0) {
            this.toastr.success(
              'La fórmula contable ha sido eliminada exitosamente',
              'Transacción exitosa'
            );
            this.selection.clear();
            this.formulaContableService.setIsUpdated(true);
          } else {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        },
        error: (err) => {
          // 🔹 MANEJAR ERROR DE DEPENDENCIAS
          if (err.status === 409) { // Conflict
            const errorData = err.error;
            let mensajeDetallado = errorData.message || 'No se puede eliminar la fórmula porque otras dependen de ella.';
            
            // Si hay detalles de las fórmulas dependientes, mostrarlos
            if (errorData.formulasDependientes && errorData.formulasDependientes.length > 0) {
              const listaFormulas = errorData.formulasDependientes
                .map((f: any) => `• ${f.focClave} - ${f.focNombre}`)
                .join('\n');
              
              mensajeDetallado += `\n\nFórmulas dependientes:\n${listaFormulas}`;
            }
            
            this.toastr.error(mensajeDetallado, 'No se puede eliminar', {
              timeOut: 8000,
              enableHtml: true
            });
          } else {
            this.toastr.error(
              err.error?.message || 'Ha ocurrido un error al eliminar la fórmula',
              'Error'
            );
          }
        },
      });
    }
  });
}

  edit(ele: FormulaContable, isEditing: boolean = true) {
    this.dialog.open(FormulaContableEditComponent, {
      data: {
        formulaContable: JSON.parse(JSON.stringify(ele)),
        listSucursales: this.listSucursales,
        sucIdFilter: ele.focSucId ?? this.filter.focSucId,
        isEditing: isEditing
      },
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '98vh',
      panelClass: 'formula-contable-dialog',
      disableClose: true,
    });
  }

  search(): void {
    this.formulaContableService.load(this.filter);
  }

  // ========== MÉTODOS PARA SELECCIÓN Y COPIA ==========

  /** Si todas las filas están seleccionadas */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.formulaContableList.length;
    return numSelected === numRows;
  }

  /** Seleccionar/deseleccionar todas las filas */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.formulaContableList.forEach((row) => this.selection.select(row));
  }

  /** Abrir diálogo para copiar fórmulas */
 copiarFormulasSeleccionadas(): void {
  if (this.selection.selected.length === 0) {
    this.toastr.warning('Selecciona al menos una fórmula para copiar', 'Advertencia');
    return;
  }

  const dialogRef = this.dialog.open(FormulaCopyDialogComponent, {
    width: '500px',
    data: {
      formulasSeleccionadas: this.selection.selected.length,
      sucursales: this.listSucursales,
    },
  });

  dialogRef.afterClosed().subscribe((result: { sucursalId: number, copiarDependencias: boolean }) => {
    if (result && result.sucursalId) {
      this.ejecutarCopiaFormulas(result); // 👈 Pasar el objeto completo
    }
  });
}

  /** Ejecutar la copia de fórmulas */
 // Cambiar la firma para recibir un objeto con las propiedades
private ejecutarCopiaFormulas(data: { sucursalId: number, copiarDependencias: boolean }): void {
  const formulaIds = this.selection.selected.map((formula) => formula.focId);

  this.formulaContableService.copyFormulasToSucursal(
    formulaIds, 
    data.sucursalId,
    data.copiarDependencias
  ).subscribe({
    next: (response) => {
      console.log('Respuesta de copia:', response);
      
      if (response.data.success) {
        const copiados = response.data.copiados || 0;
        const detalles = response.data.detalles || [];

        if (copiados > 0) {
          this.toastr.success(
            `Se copiaron ${copiados} fórmula(s) exitosamente`,
            'Operación exitosa'
          );
        }

        if (detalles.length > 0) {
          this.toastr.warning(
            `Advertencias: ${detalles.join(', ')}`,
            'Atención',
            { timeOut: 5000 }
          );
        }

        this.selection.clear();
        this.search();
      } else {
        this.toastr.error(
          response.data.detalles?.join(', ') || 'No se pudo copiar ninguna fórmula',
          'Error'
        );
      }
    },
    error: (err) => {
      console.error('Error al copiar fórmulas:', err);
      this.toastr.error('Error al copiar las fórmulas', 'Error');
    },
  });
}
}