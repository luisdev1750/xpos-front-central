import { Sesion } from './sesion';
import { SesionFilter } from './sesion-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { SesionObjetivo } from './sesion-objetivo';
import { SesionObjetivoFilter } from './sesion-objetivo-filter';
import { tap } from 'rxjs/operators';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class SesionService extends GeneralService {
   sesionList: Sesion[] = [];
   api = this.sUrl + 'Sesiones';
   user!: ApplicationUser;

   // sesionesObjetivosList: SesionObjetivo[] = [];
   // apiObjetivos = this.sUrl + 'RespuestasSesiones';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   // delete(entity: Sesion): Observable<Sesion> {
   //    let params = new HttpParams();
   //    let url = '';
   //    if (entity.sesId) {
   //       url = `${this.api}/${entity.sesId.toString()}`;
   //       params = new HttpParams().set('ID', entity.sesId.toString());
   //       return this.http.delete<Sesion>(url, {headers, params});
   //    }
   //    return EMPTY;
   // }
   delete(entity: Sesion): Observable<number> {
      let url = '';
      if (entity.sesId) {
        url = `${this.api}/${entity.sesId.toString()}/${this.user.userid}`;
        return this.http.delete<number>(url, { headers });  
      }
      return EMPTY;
   }
  
  
   find(filter: SesionFilter): Observable<Sesion[]> {
      const url = `${this.api}/${filter.sesId}/${filter.sesTisId}/${filter.sesEmpId}`;

      return this.http.get<Sesion[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Sesion> {
      const url = `${this.api}/${id}`;
      const params = { sesId: id };
      return this.http.get<Sesion[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   findByRange(filter: SesionFilter): Observable<Sesion[]> {
      const tisId: string = filter.sesTisId==''?'0': filter.sesTisId;
      const empId: string = filter.sesEmpId==''?'0': filter.sesEmpId;
      const url = `${this.api}/${tisId}/${empId}/${filter.sesFechaIni}/${filter.sesFechaFin}`;

      return this.http.get<Sesion[]>(url, {headers: headers});
   }


   findByRangeSesion(filter: SesionFilter): Observable<Sesion[]> {
      const tisId: string = filter.sesTisId==''?'0': filter.sesTisId;
      const empId: string = filter.sesEmpId==''?'0': filter.sesEmpId;
      const url = `${this.api}/listarSesiones/${tisId}/${empId}/${filter.sesFechaIni}/${filter.sesFechaFin}`;

      return this.http.get<Sesion[]>(url, {headers: headers});
   }


   load(filter: SesionFilter): void {
      this.find(filter).subscribe(result => {
         this.sesionList = result;
      },
         err => {
            console.error('error cargando', err);
         }
      );
   }

   private convertDateToISO(dateString: string): string {
      // Check if the date is already in ISO 8601 format
      if (dateString.includes('T') && dateString.includes('Z')) {
        return dateString; // Already in ISO 8601 format
      }
    
      // Regex to extract date parts
      const datePattern = /(\w{3}) (\w{3}) (\d{2}) (\d{2}:\d{2}:\d{2})\.\d{3}Z/;
      const match = dateString.match(datePattern);
    
      if (!match) {
        throw new Error(`Invalid date string: ${dateString}`);
      }
    
      // Extracting date components
      const [ , dayOfWeek, month, day, time ] = match;
    
      // Construct a new date string assuming the year 2024
      const newDateString = `${day} ${month} 2024 ${time} UTC`;
    
      // Safely create a new Date object
      const date = new Date(Date.parse(newDateString));
    
      // Handle invalid date cases
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
      }
    
      return date.toISOString();
    }
    
    save(entity: Sesion): Observable<Sesion> {
      // Convertir las fechas si están en un formato no ISO
      entity.sesHoraIni = this.convertDateToISO(entity.sesHoraIni);
      entity.sesHoraFin = this.convertDateToISO(entity.sesHoraFin);
    
      let url = `${this.api}/${this.user.userid}`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      
      console.log("GUARDANDO---------------------");
      console.log(url);
      
      if (entity.sesId) {
        return this.http.put<Sesion>(url, entity, { headers: headers });
      } else {
        return this.http.post<Sesion>(url, entity, { headers: headers });
      }
    }


   //Carga de formatos-----------
   // findFormato(filter: SesionObjetivoFilter): Observable<SesionObjetivo[]> {
   //    const url = `${this.apiObjetivos}/${filter.sesId}/${filter.objId}`;

   //    return this.http.get<SesionObjetivo[]>(url, {headers: headers});
   // }

   // loadFormatos(filter: SesionObjetivoFilter): Observable<SesionObjetivo[]> {
   //    return this.findFormato(filter).pipe(
   //      tap(result => {
   //        this.sesionesObjetivosList = result;
   //      })
   //    );
   //  }

}

