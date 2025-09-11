  
  
export interface Document {
    caeId: number;
    caeArchivo: string;
    caeUsrId: number;
    caeFecha: Date;
    caeEstatus: string;
    caeResultado: string | null;
    caeNumeroPreguntas: number;
  }