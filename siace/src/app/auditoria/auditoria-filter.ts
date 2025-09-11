import {
  endOfToday,
  startOfDay,
  startOfMonth,
  startOfToday,
  endOfDay,
} from 'date-fns';

export class AuditoriaFilter {
  audUsrId = 1;
  audTipo = '';
  audFechaInicial=  startOfMonth(new Date());  // Fecha actual como objeto Date
  audFechaFinal =   endOfToday();    // Fecha actual como objeto 
  audModulo = ''; 
}

export class UsuarioSiace{
  usrId!: number; 
  usrRolId!: number;
  usrNombre!: string;
  usrApellidoPaterno!: string; 
  usrApellidoMaterno!: string;
  usrUsuario!: string; 
}
