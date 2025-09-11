import { Directive, HostListener } from '@angular/core';

@Directive({
   selector: 'input[positiveNumber]'
})
export class PositiveNumberDirective {
   private specialKeys: string[] = ['Ctrl', 'Control'];
   private acceptedCharacters: string[] = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9','Backspace', 'Tab', 'Delete', 'Del', 'ArrowLeft', 'ArrowRight', 'Left', 'Right' ];

   constructor() { }

   /*@HostListener('keypress', ['$event']) onInput(event: KeyboardEvent): void {
      if (!this.acceptedCharacters.includes(event.key)) {
         event.preventDefault();
      }
   }*/


   @HostListener('keydown', [ '$event' ]) onKeyDown(event: KeyboardEvent):void {
      if (this.specialKeys.includes(event.key) || !this.acceptedCharacters.includes(event.key)) {
         event.preventDefault();
      }
    }
}