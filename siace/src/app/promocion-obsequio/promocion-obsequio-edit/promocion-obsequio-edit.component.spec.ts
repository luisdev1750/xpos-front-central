import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PromocionObsequioEditComponent } from './promocion-obsequio-edit.component';
import { PromocionObsequioService } from '../promocion-obsequio.service';

describe('PromocionObsequioEditComponent', () => {
  let component: PromocionObsequioEditComponent;
  let fixture: ComponentFixture<PromocionObsequioEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromocionObsequioEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [PromocionObsequioService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionObsequioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
