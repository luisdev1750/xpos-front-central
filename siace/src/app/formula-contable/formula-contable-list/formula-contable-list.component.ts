import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormulaContableFilter } from '../formula-contable-filter';
import { FormulaContableService } from '../formula-contable.service';
import { FormulaContable } from '../formula-contable';
import { FormulaContableEditComponent } from '../formula-contable-edit/formula-contable-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';

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
    'focId',
    'focSucId',
    'focFormula',
    'focClave',
    'focNombre',
    'focEstatusEdicion',
    'actions',
  ];
  filter = new FormulaContableFilter();

  private subs!: Subscription;
  listSucursales: any = [];
  variablesContables: any[] = []; // Para los tooltips

  /* Inicialización */

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

  /* Método para parsear la fórmula */
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
        // Es una variable
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

  /* Accesors */

  get formulaContableList(): FormulaContable[] {
    return this.formulaContableService.formulaContableList;
  }

  /* Métodos */

  add() {
    let newFormulaContable: FormulaContable = new FormulaContable();
    this.edit(newFormulaContable, false);
  }

  delete(formulaContable: FormulaContable): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el fórmula contable?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.formulaContableService.delete(formulaContable).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El fórmula contable ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.formulaContableService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: FormulaContable, isEditing: boolean  = true) {
    this.dialog.open(FormulaContableEditComponent, {
      data: {
        formulaContable: JSON.parse(JSON.stringify(ele)),
        listSucursales: this.listSucursales,
        sucIdFilter : ele.focSucId ?? this.filter.focSucId,
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
}
