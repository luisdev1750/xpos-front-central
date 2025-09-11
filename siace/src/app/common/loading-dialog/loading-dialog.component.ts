import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { LoadingDialogService } from './loading-dialog.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'loading-dialog', 
   templateUrl: './loading-dialog.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingDialogComponent implements OnDestroy, AfterContentChecked {
   subscription: Subscription;
   isLoading: boolean;

   constructor(private _service: LoadingDialogService, 
      private changeDedectionRef: ChangeDetectorRef) {
      this.isLoading = false;
      this.subscription = this._service.getIsLoading().subscribe(res => {
         this.isLoading = res;
      });
   }


   ngAfterContentChecked(): void {
      this.changeDedectionRef.detectChanges();
   }

   
   ngOnDestroy() {
      this.subscription.unsubscribe();
   }


   public show() {
      this.isLoading = true;
      this._service.updateIsLoading(this.isLoading);
   }

   public hide() {
      this.isLoading = false;
      this._service.updateIsLoading(this.isLoading);
   }
}
