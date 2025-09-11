import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({ providedIn: 'root' })
export class UploadService extends GeneralService {

   constructor(private http: HttpClient) {
      super();
   }


   upload(path: string, formData: FormData) {
      let url = `${this.sUrl}upload/${path}`;
      return this.http.post<{ path: string }>(url,formData);
   }
}