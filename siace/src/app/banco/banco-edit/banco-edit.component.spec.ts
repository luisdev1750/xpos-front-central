import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BancoEditComponent } from './banco-edit.component';
import { BancoService } from '../banco.service';

describe('BancoEditComponent', () => {
  let component: BancoEditComponent;
  let fixture: ComponentFixture<BancoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BancoEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [BancoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
