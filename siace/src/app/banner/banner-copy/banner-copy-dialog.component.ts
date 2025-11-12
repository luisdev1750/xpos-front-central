import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-banner-copy-dialog',
  template: `
    <h2 mat-dialog-title>Copiar Banners a Sucursal</h2>
    <mat-dialog-content>
      <p>
        Has seleccionado <strong>{{ data.sucursalesSeleccionadas }}</strong> sucursal(es) 
        con un total de <strong>{{ data.bannersSeleccionados }}</strong> banner(s) para copiar.
      </p>
      
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
        Se copiarán todos los banners de las sucursales seleccionadas, 
        incluyendo sus imágenes.
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
      padding: 20px 0;
      min-height: 150px;
    }

    mat-form-field {
      margin-top: 16px;
    }

    mat-hint {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #3f51b5;
    }
  `]
})
export class BannerCopyDialogComponent {
  sucursalSeleccionada: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<BannerCopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.sucursalSeleccionada) {
      this.dialogRef.close({
        sucursalId: this.sucursalSeleccionada
      });
    }
  }
}