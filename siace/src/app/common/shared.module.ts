import { NgModule } from '@angular/core';
import { PositiveNumberDirective } from './positive-number.directive';
import { FunctionReloadDirective } from './function-reload.directive';
import { ThousandsSeparatorDirective } from './thousands-separtator.directive';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@NgModule({
  imports: [
  ],
  declarations: [
    PositiveNumberDirective,
    FunctionReloadDirective,
    ThousandsSeparatorDirective
  ],
  providers: [CurrencyPipe, DecimalPipe],
  exports: [PositiveNumberDirective, FunctionReloadDirective, ThousandsSeparatorDirective]
})
export class SharedModule { }
