import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-formula-copy-dialog',
  template: `
    <h2 mat-dialog-title>Copiar Fórmulas a Sucursal</h2>
    <mat-dialog-content>
      <p>Has seleccionado <strong>{{ data.formulasSeleccionadas }}</strong> fórmula(s) para copiar.</p>
      
      <mat-form-field style="width: 100%;">
        <mat-label>Selecciona la sucursal destino</mat-label>
        <mat-select [(ngModel)]="sucursalSeleccionada" required>
          <mat-option *ngFor="let sucursal of data.sucursales" [value]="sucursal.sucId">
            {{ sucursal.sucNombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- 👇 Nueva opción para copiar dependencias -->
      <mat-checkbox [(ngModel)]="copiarDependencias" style="margin-top: 16px;">
        Copiar fórmulas dependientes automáticamente
      </mat-checkbox>

      <mat-hint style="color: #666; font-size: 12px; margin-top: 8px; display: block;">
        <mat-icon style="font-size: 16px; vertical-align: middle;">info</mat-icon>
        Si las fórmulas seleccionadas dependen de otras fórmulas, también se copiarán automáticamente.
      </mat-hint>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="!sucursalSeleccionada"
        (click)="onConfirm()">
        Copiar
      </button>
    </mat-dialog-actions>
  `,
  // styles: [`...`]
})
export class FormulaCopyDialogComponent {
  sucursalSeleccionada: number | null = null;
  copiarDependencias: boolean = true; // 👈 Por defecto activado

  constructor(
    public dialogRef: MatDialogRef<FormulaCopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.sucursalSeleccionada) {
      this.dialogRef.close({
        sucursalId: this.sucursalSeleccionada,
        copiarDependencias: this.copiarDependencias
      });
    }
  }
}