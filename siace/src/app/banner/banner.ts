export class Banner {
  subId!: number;
  subSucId!: number;
  subNombre!: string;
  subOrden!: number;
  subActivo!: boolean; // 'Activo' o 'Inactivo'
  imagenUrl?: File | null;
  blobUrl?: string; // URL para mostrar la imagen en la tabla
}
