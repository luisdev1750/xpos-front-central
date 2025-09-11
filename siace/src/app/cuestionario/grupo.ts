import { Pregunta } from "./pregunta";

export interface Grupo {
   nombrePilar: string;
   sumaTotalGrupo: number;
   preguntas: Pregunta[];
 }