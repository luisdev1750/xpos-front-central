import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../common/general.service';
import {
  Nivele,
} from '../dto/dtoBusiness';  // Ajusta la importación según tu estructura de DTOs


@Injectable({
   providedIn: 'root'
})
export class NivelesService extends GeneralService {
   private baseUrl: string=this.sUrl + 'Niveles'; // Utiliza environment.apiUrl

   constructor(private http: HttpClient) {
      super();
    }

   /**
    * @summary Obtiene todos los niveles desde el backend
    * @returns Observable<Nivele[]>
    */
   getAllNiveles(): Observable<Nivele[]> {
      return this.http.get<Nivele[]>(`${this.baseUrl}/listar`);
   }
}
