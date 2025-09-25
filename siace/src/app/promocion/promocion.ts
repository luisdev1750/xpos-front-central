export class Promocion {
  pmoId!: number;
  pmoTprId!: number | null;  // Ahora permite null
  pmoTpaId!: number | null;  // Ahora permite null
  pmoSpaId!: number | null;  // Ahora permite null
  pmoFechaInicio!: string;
  pmoFechaFin!: string;
  pmoNombre!: string;
  pmoPolitica!: string;
  pmoObsequioUnico!: boolean;
  pmoLimiteCantidad!: number;
  pmoSucId!: number;

  pmoTprNombre!: string;
  pmoTpanombre!: string;
  pmoSpaNombre!: string;
  pmoSucNombre!: string; 
}