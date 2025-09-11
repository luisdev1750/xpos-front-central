import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

export class GeneralService {
   protected sUrl: string = environment.apiUrl; 
   protected subjectUpdate = new Subject<any>();
   // private refreshSubject = new Subject<void>();
   // refreshObservable$ = this.refreshSubject.asObservable();

   public setIsUpdated(isUpdated: boolean) {
      this.subjectUpdate.next(isUpdated);
   }

   public getIsUpdated(): Observable<any> {
      return this.subjectUpdate.asObservable();
   }

   // emitRefresh(): void{
   //    this.refreshSubject.next();
   // }


   protected extractArray(res: Response, showprogress: boolean = true) {
      let data = res.json();

      return data || [];
   }


  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }

   protected handleErrorPromise(error: any): Promise<void> {
      try {
         error = JSON.parse(error._body);
      } catch (e) {
      }

      let errMsg = error.errorMessage
         ? error.errorMessage
         : error.message
            ? error.message
            : error._body
               ? error._body
               : error.status
                  ? `${error.status} - ${error.statusText}`
                  : 'unknown server error';

      console.error(errMsg);
      return Promise.reject(errMsg);
   }


   
}
