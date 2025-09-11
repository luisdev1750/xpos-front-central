import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  tap,
} from 'rxjs/operators';
import { GeneralService } from '../common/general.service';
import { Nivel } from './nivel';
import { NivelFilter } from './nivel-filter';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class NivelService extends GeneralService {
  nivelList: Nivel[] = [];
  api = this.sUrl + 'Niveles';

  user!: ApplicationUser;
  /* Constructores*/

  constructor(private http: HttpClient) {
    super();

    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  /* Métodos */
  delete(entity: Nivel): Observable<Nivel> {
    let params = new HttpParams();
    let url = '';
    if (entity.nivId) {
      url = `${this.api}/${entity.nivId.toString()}`;
      const body =  { userId: this.user.userid ?? 1 , id: entity.nivId};
      params = new HttpParams().set('ID', entity.nivId.toString());
      return this.http.delete<Nivel>(url, { headers, params , body});
    }
    return EMPTY;
  }

//   delete(entity: Emprendedor, userId: number): Observable<Emprendedor> {
//    let url = '';
//    if (entity.empId) {
//      url = `${this.api}/${entity.empId.toString()}`;

//      // Crear el body con el userId
//      const body = { userId: this.user.userid ?? 1 , id: entity.empId};

//      return this.http.delete<Emprendedor>(url, { headers, body });
//    }
//    return EMPTY;
//  }

  findAll(): Observable<Nivel[]> {
    const url = `${this.api}/listar`;

    return this.http.get<Nivel[]>(url, { headers: headers });
  }

  find(filter: NivelFilter): Observable<Nivel[]> {
    const url = `${this.api}/${filter.nivId}`;

    return this.http.get<Nivel[]>(url, { headers: headers });
  }

  findById(id: string): Observable<Nivel> {
    const url = `${this.api}/${id}`;
    const params = { nivId: id };
    return this.http
      .get<Nivel[]>(url, { headers: headers })
      .pipe(map((ele) => ele[0]));
  }

  findNivel(filter: NivelFilter): Observable<Nivel[]> {
    const empId = filter.empId == '' ? '0' : filter.empId;
    const url = `${this.api}/listarNiveles/${empId}`;

    return this.http.get<Nivel[]>(url, { headers: headers });
  }

  findNivelPorcentaje(filter: NivelFilter): Observable<Nivel[]> {
    const empId = filter.empId == '' ? '0' : filter.empId;
    //const url = `${this.api}/${pilId}/${nivId}`;
    const url = `${this.api}/listarNiveles/${empId}`;

    return this.http.get<Nivel[]>(url, { headers: headers });
  }

  load(): Observable<Nivel[]> {
    return this.findAll().pipe(
      tap((result) => {
        this.nivelList = result; // Asignamos los datos a nivelList
      }),
      catchError((err) => {
        console.error('Error cargando niveles', err);
        return of([]); // Devuelve un observable vacío en caso de error
      })
    );
  }

  loadNivel(filter: NivelFilter): void {
    this.findNivel(filter).subscribe({
      next: (result) => {
        this.nivelList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: Nivel): Observable<Nivel> {
   console.log("Usuario actual");
   console.log(this.user);
   
   
    let url = `${this.api}/${this.user.userid}`;
    if (entity.nivId) {
      return this.http.put<Nivel>(url, entity, { headers: headers });
    } else {
      return this.http.post<Nivel>(url, entity, { headers: headers });
    }
  }
}
