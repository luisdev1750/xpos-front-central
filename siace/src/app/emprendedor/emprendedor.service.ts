import { Emprendedor } from './emprendedor';
import { EmprendedorFilter } from './emprendedor-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class EmprendedorService extends GeneralService {
  emprendedorList: Emprendedor[] = [];
  api = this.sUrl + 'Emprendedores';
  user!: ApplicationUser;
  /* Constructores*/

  constructor(private http: HttpClient) {
    super();
    this.user = JSON.parse(localStorage.getItem('user')!);
  }


  /* Métodos */
  checkVersion(empId: number): Observable<number> {
    const url = `${this.api}/checkVersion/${empId}`;

    return this.http.get<number>(url, { headers});
  }


  delete(entity: Emprendedor, userId: number): Observable<Emprendedor> {
    let url = '';
    if (entity.empId) {
      url = `${this.api}/${entity.empId.toString()}`;

      // Crear el body con el userId
      const body = { userId: this.user.userid ?? 1 , id: entity.empId};

      return this.http.delete<Emprendedor>(url, { headers, body });
    }
    return EMPTY;
  }

  find(filter: EmprendedorFilter, empTipo: boolean): Observable<Emprendedor[]> {
    const empId = filter.empId === '' ? '0' : filter.empId;
    const url = `${this.api}/${empId}/${empTipo}`;
    console.log("URL final:", url);
  
    return this.http.get<Emprendedor[]>(url, { headers: headers }).pipe(
      map((emprendedores: Emprendedor[]) => 
        emprendedores.sort((a, b) => a.empRazonSocial.localeCompare(b.empRazonSocial))
      )
    );
  }
  findById(id: string): Observable<Emprendedor> {
    const url = `${this.api}/${id}`;
    const params = { empId: id };
    return this.http
      .get<Emprendedor[]>(url, { headers: headers })
      .pipe(map((ele) => ele[0]));
  }

  findByPattern(filter: EmprendedorFilter): Observable<Emprendedor[]> {
    const empPattern = filter.empPatron == '' ? '_*' : filter.empPatron;
    const url = `${this.api}/buscar/${filter.empPatron}`;

    return this.http.get<Emprendedor[]>(url, { headers: headers });
  }


  findByPatternAll(filter: EmprendedorFilter): Observable<Emprendedor[]> {
    const empPattern = filter.empPatron == '' ? '_*' : filter.empPatron;
    const url = `${this.api}/buscarTodos/${filter.empPatron}`;

    return this.http.get<Emprendedor[]>(url, { headers: headers });
  }


  findByPatternAllStages(filter: EmprendedorFilter): Observable<Emprendedor[]> {
    const empPattern = filter.empPatron == '' ? '_*' : filter.empPatron;
    const url = `${this.api}/buscarTodosEtapas/${filter.empPatron}`;

    return this.http.get<Emprendedor[]>(url, { headers: headers });
  }


  findByPatternRfc(filter: EmprendedorFilter): Observable<Emprendedor[]> {
    const empRfc = filter.empPatron == '' ? '_*' : filter.empPatron;
    const url = `${this.api}/buscarRfc/${filter.empPatron}`;

    return this.http.get<Emprendedor[]>(url, { headers: headers });
  }


  load(filter: EmprendedorFilter, empTipo: boolean): Observable<Emprendedor[]> {
    return this.find(filter, empTipo).pipe(
      tap((result) => {
        this.emprendedorList = result;
      })
    );
  }

  save(entity: any): Observable<Emprendedor> {
    let url = `${this.api}`;
    if (entity.empId) {
      return this.http.put<Emprendedor>(url, entity, { headers: headers });
    } else {
      return this.http.post<Emprendedor>(url, entity, { headers: headers });
    }
  }

  saveEmprendedor(entity: any): Observable<Emprendedor> {
    let postUrl = `${this.api}/creaar`;
    let putUrl = `${this.api}`;
    if (entity.empId) {
      return this.http.put<Emprendedor>(putUrl, entity, { headers: headers });
    } else {
      return this.http.post<Emprendedor>(postUrl, entity, { headers: headers });
    }
  }

  addEmprendedoresEtapa(
    emeUsrId: number,
    emeEmpId: number,
    emeEtaId: number,
    veaId: number
  ): Observable<any> {
    const apiUrl = `${this.api}/emprendedores-etapa/${this?.user?.userid ?? 0}`;

    const body = {
      emeUsrId: emeUsrId,
      emeEmpId: emeEmpId,
      emeEtaId: emeEtaId,
    };

    return this.http.post<any>(apiUrl, body, { headers: headers });
  }
  // Método para actualizar el EmeEtaId
  updateEmprendedoresEtapa(emeId: number, nuevoEtaId: number): Observable<any> {
    const apiUrl = `${this.api}/emprendedores-etapa`;

    const body = {
      emeId: emeId,
      nuevoEtaId: nuevoEtaId,
    };
    console.log('DATOS A ENVIAR: ');
    console.log(body);

    return this.http.put<any>(apiUrl, body, { headers: headers });
  }
}
