export class Emprendedor {
  empId!: number;
  empClave?: string;
  empRazonSocial!: string;
  empDomicilio!: string;
  empTelefono!: string;
  empCorreo!: string;
  empNombreCompleto?: string;
  empRfc!: string;
  empEdad: number | null = null;
  empNieId: number | null = null;
  empNombreEmpresa?: string;
  empNombreTemporal?: string;
  empIndustria: number | null = null;
  empNecId: number | null = null;
  empGiroId: number | null = null;
  necesidades: Array<any> = [];
  empTisNombre!: string;
}