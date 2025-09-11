import { Directive, OnInit, ElementRef, HostListener, Input } from '@angular/core';
import { CurrencyPipe, DecimalPipe, formatNumber } from '@angular/common';
import { take } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel, NgControl } from '@angular/forms';

@Directive({
  selector: '[thousands-separator]'
})
export class ThousandsSeparatorDirective implements OnInit {
  decimalMarker!: string;

  constructor(private control: NgControl, private element: ElementRef) { }

  ngOnInit() {

    this.control.valueChanges!.subscribe((value) => {

      this.formatValue(value);

    });

  }


 

  private formatValue(value: string | null) {

    if (value === null) {

      this.element.nativeElement.value = '';

      return;

    }

 

    if (this.isLastCharacterDecimalSeparator(value)) {

      this.element.nativeElement.value = value;

      return;

    }

 

    // Conclude the decimal and thousand separators from locale

    const [thousandSeparator, decimalMarker] = formatNumber(1000.99, 'en').replace(/\d/g, '');

    this.decimalMarker = decimalMarker;

 

    //Here value should always come with . as decimal marker thus any other behavior is bug

    const [integer, decimal] = value.split('.');

 

    //Group every three elements, and add thousandSeparator after them

    this.element.nativeElement.value = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

 

    //Add decimals and decimalMarker if any

    if (decimal) {

      this.element.nativeElement.value = this.element.nativeElement.value.concat(decimalMarker, decimal);

    }

  }

 

  isLastCharacterDecimalSeparator(value: any) {

    return isNaN(value[value.length - 1]);

  }
}