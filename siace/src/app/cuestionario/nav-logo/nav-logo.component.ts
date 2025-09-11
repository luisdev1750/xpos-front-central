import {
  Component,
  Input,
} from '@angular/core';


@Component({
  selector: 'app-nav-logo',
  templateUrl: './nav-logo.component.html',
  styleUrl: './nav-logo.component.css'
})
export class NavLogoComponent {


  @Input() isActivate?: boolean;


  onclick(){

    if(this.isActivate){
      window.location.href = 'https://a3synergy.com.mx/';
    }
  
  }
}
