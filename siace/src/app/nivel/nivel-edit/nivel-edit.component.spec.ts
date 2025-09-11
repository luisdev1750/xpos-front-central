import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NivelEditComponent } from './nivel-edit.component';
import { NivelService } from '../nivel.service';

describe('NivelEditComponent', () => {
  let component: NivelEditComponent;
  let fixture: ComponentFixture<NivelEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NivelEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [NivelService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
