import { DateTime } from "luxon";

export class RespuestaA3{
   reaId!: number;
   reaEviId!: number;
   reaRuta!: string;
   reaDescripcion!: string;
   reaUsrId!: number;
   reaFecha!: string;
   reaEmpId!: number;
   reaArchivo!: string;

   eviDescripcion!: string;
   requireDescription!: boolean;
   reaArchivoUrl!: string;
   reaFechaBaja!: DateTime;
}