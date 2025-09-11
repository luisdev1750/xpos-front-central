import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationUser } from '../../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class UploadFileService {
  private url: string =  environment.apiUrl + 'CuestionarioExcel';
  user!: ApplicationUser;
  fecha = 0;
  constructor(private http: HttpClient) {             
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  uploadFile(archivo: File): Observable<any> {
    const apiUrl = this.url + `/saveArchivoExcel/${this.user.userid}`;
    const formData: FormData = new FormData();
    formData.append('file', archivo, archivo.name);

    return this.http.post<any>(apiUrl, formData, { headers: headers });
  }
}
