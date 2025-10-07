import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuOpenSubject = new BehaviorSubject<boolean>(
    window.innerWidth > 768
  );
  
  public isMenuOpen$ = this.menuOpenSubject.asObservable();

  toggleMenu(): void {
    this.menuOpenSubject.next(!this.menuOpenSubject.value);
  }

  setMenuState(isOpen: boolean): void {
    this.menuOpenSubject.next(isOpen);
  }

  getCurrentState(): boolean {
    return this.menuOpenSubject.value;
  }
}