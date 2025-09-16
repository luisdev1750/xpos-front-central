import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SucursalProductoEditComponent } from './sucursal-producto-edit.component';
import { SucursalProductoService } from '../sucursal-producto.service';

describe('SucursalProductoEditComponent', () => {
  let component: SucursalProductoEditComponent;
  let fixture: ComponentFixture<SucursalProductoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SucursalProductoEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [SucursalProductoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalProductoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
