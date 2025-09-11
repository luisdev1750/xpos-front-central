import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SesionEditComponent } from './sesion-edit.component';
import { SesionService } from '../sesion.service';

describe('SesionEditComponent', () => {
  let component: SesionEditComponent;
  let fixture: ComponentFixture<SesionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SesionEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [SesionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
