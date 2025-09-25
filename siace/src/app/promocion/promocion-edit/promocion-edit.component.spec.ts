import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PromocionEditComponent } from './promocion-edit.component';
import { PromocionService } from '../promocion.service';

describe('PromocionObsequioEditComponent', () => {
  let component: PromocionEditComponent;
  let fixture: ComponentFixture<PromocionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromocionEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [PromocionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
