import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NivelEstudioEditComponent } from './nivel-estudio-edit.component';
import { NivelEstudioService } from '../nivel-estudio.service';

describe('NivelEstudioEditComponent', () => {
  let component: NivelEstudioEditComponent;
  let fixture: ComponentFixture<NivelEstudioEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NivelEstudioEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [NivelEstudioService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelEstudioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
