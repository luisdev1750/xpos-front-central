import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.css']
})
export class CalendarEventComponent implements OnInit {

  eveText = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.eveText = new FormControl('');

  }

   getErrorMessage() {
      return this.eveText.hasError('required') ? 'Debe capturar el texto del evento' : '';
   }
}


