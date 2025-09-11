import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MarcaEditComponent } from './marca-edit.component';
import { MarcaService } from '../marca.service';

describe('MarcaEditComponent', () => {
  let component: MarcaEditComponent;
  let fixture: ComponentFixture<MarcaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarcaEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [MarcaService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
