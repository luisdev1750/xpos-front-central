import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PilarEditComponent } from './pilar-edit.component';
import { PilarService } from '../pilar.service';

describe('PilarEditComponent', () => {
  let component: PilarEditComponent;
  let fixture: ComponentFixture<PilarEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PilarEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [PilarService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
