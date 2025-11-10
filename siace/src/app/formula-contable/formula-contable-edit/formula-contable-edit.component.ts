import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { FormulaContableService } from '../formula-contable.service';
import { FormulaContable } from '../formula-contable';

interface VariableContable {
  vacId: number;
  vacNombre: string;
  vacClave: string;
  vacActivo: boolean;
  esFormula: boolean;
  vacFormulaDesc: string; 
}

@Component({
  selector: 'app-formula-contable-edit',
  standalone: false,
  templateUrl: './formula-contable-edit.component.html',
  styleUrls: ['./formula-contable-edit.component.css'],
})
export class FormulaContableEditComponent implements OnInit {
  id!: string;
  formulaContable!: FormulaContable;
  listSucursales: any = [];

  // Variables para el constructor de fórmulas
  variablesContables: VariableContable[] = [];
  variablesSimples: VariableContable[] = [];
  formulasCompuestas: VariableContable[] = [];
  formulaPreview: string[] = [];
  formulaError: string = '';

  // Variables para números
  numeroTemporal: number | null = null;
  numerosRapidos: number[] = [0, 1, 2, 10, 100, 1000];
  isEditing: boolean = false;
  // Nueva propiedad para controlar el cambio de sucursal
  sucursalBloqueada: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<FormulaContableEditComponent>,
    private formulaContableService: FormulaContableService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formulaContable = data.formulaContable;
    this.listSucursales = data.listSucursales;
    this.formulaContable.focSucId = data.sucIdFilter;
    this.isEditing = data.isEditing; 
  }

  ngOnInit() {
    // Primero cargar variables para poder validar fórmulas compuestas
    this.loadVariables();
  }

  loadVariables() {
    this.formulaContableService.findVariables(this.formulaContable.focSucId).subscribe(
      (res) => {
        console.log('Variables contables y fórmulas', res);
        this.variablesContables = res;

        // Separar variables simples de fórmulas compuestas
        this.variablesSimples = res.filter(
          (v: VariableContable) => !v.esFormula
        );
        this.formulasCompuestas = res.filter(
          (v: VariableContable) => v.esFormula
        );

        console.log('Variables simples:', this.variablesSimples);
        console.log('Fórmulas compuestas:', this.formulasCompuestas);

        // IMPORTANTE: Después de cargar las variables, parsear la fórmula existente
        // Esto es crucial para validar si hay fórmulas compuestas en modo edición
        if (this.formulaContable.focFormula && this.formulaContable.focFormula.trim() !== '') {
          this.parseFormulaExistente(this.formulaContable.focFormula);
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error al cargar variables contables', 'Error');
      }
    );
  }

  insertarVariable(variable: VariableContable) {
    if (!variable.vacActivo) {
      this.toastr.warning('Esta variable está inactiva', 'Advertencia');
      return;
    }
    this.formulaPreview.push(variable.vacClave);
    this.formulaError = '';

    // Verificar si se insertó una fórmula compuesta y bloquear sucursal
    if (variable.esFormula) {
      this.sucursalBloqueada = true;
      this.toastr.info(
        `Insertada fórmula compuesta: ${variable.vacNombre}. Sucursal bloqueada.`,
        'Info',
        {
          timeOut: 3000,
        }
      );
    }

    // Actualizar la fórmula en el modelo
    this.actualizarFormulaEnModelo();
  }

  insertarOperador(operador: string) {
    this.formulaPreview.push(operador);
    this.formulaError = '';
    this.actualizarFormulaEnModelo();
  }

  insertarNumero() {
    if (this.numeroTemporal !== null && this.numeroTemporal !== undefined) {
      this.formulaPreview.push(this.numeroTemporal.toString());
      this.numeroTemporal = null;
      this.formulaError = '';
      this.actualizarFormulaEnModelo();
    }
  }

  insertarNumeroRapido(numero: number) {
    this.formulaPreview.push(numero.toString());
    this.formulaError = '';
    this.actualizarFormulaEnModelo();
  }

  eliminarUltimo() {
    if (this.formulaPreview.length > 0) {
      const tokenEliminado = this.formulaPreview.pop();
      
      // Verificar si se eliminó una fórmula compuesta
      if (tokenEliminado && this.isFormulaCompuesta(tokenEliminado)) {
        // Verificar si quedan más fórmulas compuestas en la vista previa
        const tieneFormulasCompuestas = this.formulaPreview.some(token => 
          this.isFormulaCompuesta(token)
        );
        
        if (!tieneFormulasCompuestas) {
          this.sucursalBloqueada = false;
          this.toastr.info('Sucursal desbloqueada', 'Info', { timeOut: 2000 });
        }
      }
      
      this.actualizarFormulaEnModelo();
    }
  }

  limpiarFormula() {
    this.formulaPreview = [];
    this.formulaError = '';
    this.numeroTemporal = null;
    this.sucursalBloqueada = false;
    this.formulaContable.focFormula = '';
    this.toastr.info('Fórmula limpiada. Sucursal desbloqueada.', 'Info', { timeOut: 2000 });
  }

  isVariable(token: string): boolean {
    return this.variablesSimples.some((v) => v.vacClave === token);
  }

  isFormulaCompuesta(token: string): boolean {
    return this.formulasCompuestas.some((v) => v.vacClave === token);
  }

  isOperator(token: string): boolean {
    return ['+', '-', '*', '/', '^', '(', ')'].includes(token);
  }

  isNumber(token: string): boolean {
    return !isNaN(parseFloat(token)) && isFinite(Number(token));
  }

  getVariableNombre(token: string): string {
    if (this.isNumber(token)) {
      return `Número: ${token}`;
    }
    const variable = this.variablesContables.find((v) => v.vacClave === token);
    if (variable) {
      return variable.esFormula
        ? `📐 Fórmula: ${variable.vacNombre}`
        : variable.vacNombre;
    }
    return '';
  }

  validarFormula(): boolean {
    if (this.formulaPreview.length === 0) {
      this.formulaError = 'La fórmula está vacía';
      return false;
    }

    let parentesisBalance = 0;
    let ultimoTokenTipo = '';

    for (let i = 0; i < this.formulaPreview.length; i++) {
      const token = this.formulaPreview[i];

      if (token === '(') {
        parentesisBalance++;
        ultimoTokenTipo = 'parentesis_abre';
      } else if (token === ')') {
        parentesisBalance--;
        if (parentesisBalance < 0) {
          this.formulaError = 'Paréntesis no balanceados';
          return false;
        }
        ultimoTokenTipo = 'parentesis_cierra';
      } else if (this.isOperator(token) && token !== '(' && token !== ')') {
        if (
          ultimoTokenTipo === 'operador' ||
          ultimoTokenTipo === 'parentesis_abre' ||
          i === 0
        ) {
          this.formulaError = 'Operador en posición inválida';
          return false;
        }
        ultimoTokenTipo = 'operador';
      } else if (
        this.isVariable(token) ||
        this.isNumber(token) ||
        this.isFormulaCompuesta(token)
      ) {
        if (
          ultimoTokenTipo === 'variable' ||
          ultimoTokenTipo === 'parentesis_cierra'
        ) {
          this.formulaError = 'Variable/Número en posición inválida';
          return false;
        }
        ultimoTokenTipo = 'variable';
      }
    }

    if (parentesisBalance !== 0) {
      this.formulaError = 'Paréntesis no balanceados';
      return false;
    }

    if (
      ultimoTokenTipo === 'operador' ||
      ultimoTokenTipo === 'parentesis_abre'
    ) {
      this.formulaError =
        'La fórmula no puede terminar con un operador o paréntesis abierto';
      return false;
    }

    this.formulaError = '';
    return true;
  }

  // Método para actualizar la fórmula en el modelo en tiempo real
  actualizarFormulaEnModelo() {
    this.formulaContable.focFormula = this.formulaPreview.join(' ');
    // Validar automáticamente
    this.validarFormula();
  }

  // Método obsoleto - ya no se usa el botón "Aplicar Fórmula"
  aplicarFormula() {
    if (this.validarFormula()) {
      this.formulaContable.focFormula = this.formulaPreview.join(' ');
      this.toastr.success('Fórmula aplicada correctamente', 'Éxito');
    }
  }

  parseFormulaExistente(formula: string) {
    // Parsear fórmula existente para mostrarla en la vista previa
    const tokens = formula.split(' ').filter((t) => t.trim() !== '');
    this.formulaPreview = tokens;
    
    // IMPORTANTE: Verificar si hay fórmulas compuestas y bloquear sucursal
    // Esto se ejecuta tanto en modo creación como en modo edición
    const tieneFormulasCompuestas = tokens.some(token => 
      this.isFormulaCompuesta(token)
    );
    
    if (tieneFormulasCompuestas) {
      this.sucursalBloqueada = true;
      console.log('🔒 Sucursal bloqueada: La fórmula contiene fórmulas compuestas');
      
      // Mostrar mensaje informativo solo si no es la carga inicial
      if (tokens.length > 0) {
        const formulasEncontradas = tokens.filter(token => this.isFormulaCompuesta(token));
        console.log('Fórmulas compuestas encontradas:', formulasEncontradas);
      }
    } else {
      this.sucursalBloqueada = false;
      console.log('🔓 Sucursal desbloqueada: No hay fórmulas compuestas');
    }
    
    // Validar la fórmula parseada
    this.validarFormula();
  }

  OnSucursalChange(event: any) {
    // Verificar si hay fórmulas compuestas en la vista previa
    if (this.sucursalBloqueada) {
      this.toastr.warning(
        'No puedes cambiar de sucursal porque hay fórmulas compuestas en la vista previa. Límpialas primero.',
        'Advertencia',
        { timeOut: 4000 }
      );
      return;
    }

    // Si no hay fórmulas compuestas, permitir el cambio
    this.formulaContable.focSucId = event.value;
    this.loadVariables();
    
    // Limpiar la fórmula si había algo
    if (this.formulaPreview.length > 0) {
      this.toastr.info(
        'Sucursal cambiada. Se limpiará la fórmula en construcción.',
        'Info',
        { timeOut: 3000 }
      );
      this.limpiarFormula();
    }
  }

  // Método para verificar si el formulario es válido para guardar
  puedeGuardar(): boolean {
    // Verificar que la fórmula esté validada
    if (!this.validarFormula()) {
      return false;
    }
    
    // Verificar que los campos requeridos estén completos
    if (!this.formulaContable.focClave || this.formulaContable.focClave.trim() === '') {
      return false;
    }
    
    if (!this.formulaContable.focNombre || this.formulaContable.focNombre.trim() === '') {
      return false;
    }
    
    if (!this.formulaContable.focFormula || this.formulaContable.focFormula.trim() === '') {
      return false;
    }
    
    return true;
  }

  save() {
    // Validar antes de guardar
    if (!this.puedeGuardar()) {
      this.toastr.error(
        'Completa todos los campos y asegúrate de que la fórmula sea válida',
        'Error'
      );
      return;
    }

    // La fórmula ya está actualizada en formulaContable.focFormula
    // gracias al método actualizarFormulaEnModelo()
    
    this.formulaContableService.save(this.formulaContable).subscribe({
      next: (result) => {
        if (
          result.focId !== undefined &&
          result?.focId !== null &&
          Number(result.focId) >= 0
        ) {
          this.toastr.success(
            'La fórmula contable ha sido guardada exitosamente',
            'Transacción exitosa'
          );
          this.formulaContableService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error al guardar', 'Error');
        console.error(err);
      },
    });
  }
}