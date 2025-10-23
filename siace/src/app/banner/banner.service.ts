import { Banner } from './banner';
import { BannerFilter } from './banner-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, switchMap, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BannerService extends GeneralService {
  bannerList: Banner[] = [];
  api = this.sUrl + 'SucursalesBanner';
  private bannersUpdated = new BehaviorSubject<boolean>(false);
  bannersUpdated$ = this.bannersUpdated.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {
    super();
  }

  notifyUpdate() {
    this.bannersUpdated.next(true);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders().set('Accept', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  find(filter: BannerFilter): Observable<Banner[]> {
    const url = `${this.api}/${filter.subSucId}/${filter.subActivo}`;
    return this.http.get<Banner[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findById(id: string): Observable<Banner> {
    const url = `${this.api}/${id}`;
    return this.http
      .get<Banner[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((ele) => ele[0]));
  }

  load(filter: BannerFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.bannerList = result;
      },
      error: (err) => {
        // console.error('error cargando', err);
        this.toastr.info(err.error, 'Información');
        this.bannerList = [];
      },
    });
  }

  listar(): void {
    const url = `${this.api}/listar/`;
    this.http
      .get<Banner[]>(url, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (result) => {
          this.bannerList = result;
        },
        error: (err) => {
          console.error('error cargando', err);
        },
      });
  }

  save(entity: Banner): Observable<Banner> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token
    console.log('Guardando entidad:', entity);
    const sucursalId = Number(entity.subSucId);
    if (entity.subId) {
      return this.http.put<Banner>(
        url,
        this.createFormData(entity, Number(entity.subId)),
        { headers }
      );
    } else {
      return this.subIdMax(sucursalId).pipe(
        switchMap((maxId: number) => {
          const nuevoSubId = maxId + 1;
          entity.subId = Number(nuevoSubId); // Asignamos el nuevo ID
          console.log(
            `Max ID encontrado: ${maxId}. Asignando nuevo SubId: ${entity.subId}`
          );
          return this.http.post<Banner>(
            url,
            this.createFormData(entity, Number(entity.subId)),
            { headers }
          );
        })
      );
    }
  }

  delete(entity: Banner): Observable<Banner> {
    let params = new HttpParams();
    let url = '';
    if (entity.subId) {
      url = `${this.api}/${entity.subId}/${entity.subSucId}`;
      return this.http.delete<Banner>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  subIdMax(sucId: number): Observable<number> {
    const url = `${this.api}/max/${sucId}`;
    return this.http.get<number>(url, {
      headers: this.getHeaders(),
    });
  }

  getImagen(fileName: string): Observable<string> {
    const url = `${this.api}/imagen/${encodeURIComponent(fileName)}`;
    return this.http
      .get(url, {
        headers: this.getHeaders(),
        responseType: 'blob',
      })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }

  private createFormData(entity: Banner, userId: number): FormData {
    const formData = new FormData();
    const entityToSend = { ...entity };
    const imagenFile = entityToSend.imagenUrl;
    entityToSend.subOrden = Number(entityToSend.subOrden);
    delete entityToSend.imagenUrl;
    delete entityToSend.blobUrl;
    formData.append('bannerJson', JSON.stringify(entityToSend));
    if (imagenFile) {
      formData.append('imagen', imagenFile, imagenFile.name);
    }
    return formData;
  }
}
