import { Component } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(public menuService: MenuService) {}
}