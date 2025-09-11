import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/*import { map, catchError } from 'rxjs/operators';*/
import { LocalStorageService } from '../common/localstorage.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

   constructor(private localStorage: LocalStorageService) {
      console.log('Constructor de basic auth');
   }


   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log(JSON.stringify(request));
      const token: string = sessionStorage.getItem("token")!;

      if (token) {
         request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + token) });
      }

      if (!request.headers.has('Content-Type')) {
         request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }

      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

      return next.handle(request);/*.pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }));*/
   }
}
