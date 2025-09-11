import { DateTime } from "luxon";
import { Actividad } from "../actividad/actividad";

export class Version {
  veaId!: number;
  veaFecha!: string;
  veaNoVersion!: number;
  veaUsrId!: number;
  veaActivo!: boolean;
  usuario!: string;
  veaFechaActivacion!: DateTime;

  actividadesA3s!: Actividad[];
}
