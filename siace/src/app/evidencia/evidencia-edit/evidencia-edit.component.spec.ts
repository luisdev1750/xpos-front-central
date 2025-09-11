import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EvidenciaEditComponent } from './evidencia-edit.component';
import { EvidenciaService } from '../evidencia.service';

describe('EvidenciaEditComponent', () => {
  let component: EvidenciaEditComponent;
  let fixture: ComponentFixture<EvidenciaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenciaEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [EvidenciaService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenciaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
