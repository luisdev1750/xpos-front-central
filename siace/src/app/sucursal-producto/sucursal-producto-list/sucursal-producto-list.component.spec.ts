import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SucursalProductoListComponent } from './sucursal-producto-list.component';
import { SucursalProductoService } from '../sucursal-producto.service';

describe('SucursalProductoListComponent', () => {
  let component: SucursalProductoListComponent;
  let fixture: ComponentFixture<SucursalProductoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SucursalProductoListComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule, NoopAnimationsModule],
      providers: [SucursalProductoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalProductoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
