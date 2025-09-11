import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TasaCuotaEditComponent } from './tasa-cuota-edit.component';
import { TasaCuotaService } from '../tasa-cuota.service';

describe('TasaCuotaEditComponent', () => {
  let component: TasaCuotaEditComponent;
  let fixture: ComponentFixture<TasaCuotaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TasaCuotaEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [TasaCuotaService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasaCuotaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
