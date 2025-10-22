import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
  animations: [
    trigger('zoomAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'scale(0.8)' })
        ),
      ]),
    ]),
  ],
})
export class ImagePreviewComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private dialogRef: MatDialogRef<ImagePreviewComponent>
  ) {}

  /** Cierra el diálogo al presionar ESC */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.dialogRef.close();
  }

  /** Cierra el diálogo si se hace clic fuera de la imagen */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
