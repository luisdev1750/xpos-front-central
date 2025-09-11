import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NecesidadEditComponent } from './necesidad-edit.component';
import { NecesidadService } from '../necesidad.service';

describe('NecesidadEditComponent', () => {
  let component: NecesidadEditComponent;
  let fixture: ComponentFixture<NecesidadEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NecesidadEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [NecesidadService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NecesidadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
