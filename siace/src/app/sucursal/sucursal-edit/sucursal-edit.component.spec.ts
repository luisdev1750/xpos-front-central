import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SucursalEditComponent } from './sucursal-edit.component';
import { SucursalService } from '../sucursal.service';

describe('SucursalEditComponent', () => {
  let component: SucursalEditComponent;
  let fixture: ComponentFixture<SucursalEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SucursalEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [SucursalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
