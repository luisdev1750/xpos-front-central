import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActividadEditComponent } from './actividad-edit.component';
import { ActividadService } from '../actividad.service';

describe('ActividadEditComponent', () => {
  let component: ActividadEditComponent;
  let fixture: ComponentFixture<ActividadEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [ActividadService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
