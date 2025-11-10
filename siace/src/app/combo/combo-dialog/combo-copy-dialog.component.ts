import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-combo-copy-dialog',
  template: `
    <h2 mat-dialog-title>Copiar Combos a Sucursal</h2>
    <mat-dialog-content>
      <p>Has seleccionado <strong>{{ data.combosSeleccionados }}</strong> combo(s) para copiar.</p>
      
      <mat-form-field style="width: 100%;">
        <mat-label>Selecciona la sucursal destino</mat-label>
        <mat-select [(ngModel)]="sucursalSeleccionada" required>
          <mat-option *ngFor="let sucursal of data.sucursales" [value]="sucursal.sucId">
            {{ sucursal.sucNombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-hint style="color: #666; font-size: 12px; margin-top: 8px; display: block;">
        <mat-icon style="font-size: 16px; vertical-align: middle;">info</mat-icon>
        Los combos que ya existan en la sucursal destino no se copiarán.
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
  styles: [`
    mat-dialog-content {
      padding: 20px;
      min-width: 400px;
    }
    mat-form-field {
      margin-top: 10px;
    }
  `]
})
export class ComboCopyDialogComponent {
  sucursalSeleccionada: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ComboCopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.sucursalSeleccionada) {
      this.dialogRef.close(this.sucursalSeleccionada);
    }
  }
}