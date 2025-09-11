import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GiroEditComponent } from './giro-edit.component';
import { GiroService } from '../giro.service';

describe('GiroEditComponent', () => {
  let component: GiroEditComponent;
  let fixture: ComponentFixture<GiroEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GiroEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [GiroService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
