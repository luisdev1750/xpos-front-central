import { Directive, HostListener } from '@angular/core';

@Directive({
   selector: 'div[disable-reload]'
})
export class FunctionReloadDirective {
   private specialKeys: string[] = ['F5'];
  
   constructor() { }

   /*@HostListener('keypress', ['$event']) onInput(event: KeyboardEvent): void {
      if (!this.acceptedCharacters.includes(event.key)) {
         event.preventDefault();
      }
   }*/


   @HostListener('keydown', [ '$event' ]) onKeyDown(event: KeyboardEvent):void {
      if (this.specialKeys.includes(event.key)) {
         event.preventDefault();
      }
    }
}