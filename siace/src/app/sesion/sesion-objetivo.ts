import { DateTime } from "luxon";

export class SesionObjetivo{
   objId!: number;
  objTisId!: number;
  objNombre!: string;
  objDescripcion!: string;
  objFormato!: string;


  seoId!: number;
  seoSesId!: number;
  seoObjId!: number;
  seoArchivo!: number;
  seoArchivoUrl!: string;
  seoFechaBaja!: DateTime;
}