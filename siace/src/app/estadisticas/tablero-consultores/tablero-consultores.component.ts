import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ApplicationUser } from '../../login/login.service';
import {
  TableroConsultoresComunicacionService,
} from './tablero-consultores-comunicacion.service';


@Component({
  selector: 'app-tablero-consultores',
  templateUrl: './tablero-consultores.component.html',
  styleUrl: './tablero-consultores.component.css',
  encapsulation: ViewEncapsulation.None  // Desactiva la encapsulación
})
export class TableroConsultoresComponent implements OnDestroy, OnInit {

  private tipos = ["emprendedor", "consultor"];
  public tipo = this.tipos[0];

  constructor(
    private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService
  ) {
    let user: ApplicationUser = JSON.parse(localStorage.getItem("user")!);
    if (Number(user.role) == 6) this.tipo = this.tipos[0];
    else this.tipo = this.tipos[1];
  }

  ngOnInit() {
    this.tableroConsultoresComunicacionService.isTableroStart = true;
  }

  ngOnDestroy() {
    this.tableroConsultoresComunicacionService.isTableroStart = false;
  }

}
