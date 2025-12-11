export class Promocion {
  pmoId!: number;
  pmoTprId!: number | null;  
  pmoTpaId!: number | null;  
  pmoSpaId!: number | null;  
  pmoFechaInicio!: string;
  pmoFechaFin!: string;
  pmoNombre!: string;
  pmoPolitica!: string;
  pmoObsequioUnico!: boolean;
  pmoLimiteCantidad!: number;
  pmoSucId!: number;
  pmoBanId!: number| null;

  pmoTprNombre!: string;
  pmoTpanombre!: string;
  pmoSpaNombre!: string;
  pmoSucNombre!: string;
  pmoBanNombre!: string;
}