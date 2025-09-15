import { FormulaContable } from './formula-contable';
import { FormulaContableFilter } from './formula-contable-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class FormulaContableService extends GeneralService {
   formulaContableList: FormulaContable[] = [];
   api = this.sUrl + 'FormulasContables';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
      super();
   }

   // Método para obtener headers con el token
   private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('accessToken');
      let headers = new HttpHeaders().set('Accept', 'application/json');
      
      if (token) {
         headers = headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
   }

   /* Métodos */

   delete(entity: FormulaContable): Observable<FormulaContable> {
      let params = new HttpParams();
      let url = '';
      if (entity.focId) {
         url = `${this.api}/${entity.focId.toString()}`;
         params = new HttpParams().set('ID', entity.focId.toString());
         return this.http.delete<FormulaContable>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: FormulaContableFilter): Observable<FormulaContable[]> {
      const url = `${this.api}/${filter.focId}/${filter.focSucId}`;
      return this.http.get<FormulaContable[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<FormulaContable> {
      const url = `${this.api}/${id}`;
      const params = { focId: id };
      return this.http.get<FormulaContable[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: FormulaContableFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.formulaContableList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: FormulaContable): Observable<FormulaContable> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.focId) {
         return this.http.put<FormulaContable>(url, entity, { headers });
      } else {
         return this.http.post<FormulaContable>(url, entity, { headers });
      }
   }
}