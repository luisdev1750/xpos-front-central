import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor,
   HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LoginService } from '../login/login.service';
import { LoadingDialogService } from '../common/loading-dialog/loading-dialog.service';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
   constructor(private authService: LoginService,
      private router: Router,
      public loadingService: LoadingDialogService) {
   }

   private handleAuthError(err: HttpErrorResponse): Observable<any> {
      if (err.status === 401 || err.status === 403) {
         this.authService.logout();
         return of(''); // err.message 
      }
      return throwError(err);
   }

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      this.loadingService.updateIsLoading(true);
      const accessToken = localStorage.getItem('access_token');
      const isApiUrl = request.url.startsWith(environment.apiUrl);
      if (accessToken && isApiUrl) {
         request = request.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
         });
      }

      return next.handle(request).pipe(timeout(150000)).pipe(
         finalize(() => {
            this.loadingService.updateIsLoading(false);
         }),
         catchError(x => this.handleAuthError(x))
      );
   }
}
