import { Emprendedor } from "../emprendedor/emprendedor";

export class Sesion {
  sesId!: number;
  sesTisId!: number;
  sesHoraIni!: string;
  sesHoraFin!: string;
  sesEmpId!: number;
  sesUsrId!: number;
  sesFecha!: Date;
  sesEmp!: Emprendedor;
  sesTisNombre!: string;

  sesColor!:string;
  sesDescripcion!: string;
  

  checked!: boolean;
}
