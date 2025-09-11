import { Contestacion } from "./contestacion";
import { Respuesta } from "./respuesta";

export interface Pregunta {
   preId: number;
   prePregunta: string;
   preTipId: number;
   prePreIdTrigger: number;
   preResIdTrigger: number;
   prePilId: number; 
   respuesta: Respuesta[];
   contestaciones: Contestacion[]; 
   maxPonderacion: number; 
   minPonderacion: number; 
   pildDescription: string; 
   preObligatoria: boolean; 
 }