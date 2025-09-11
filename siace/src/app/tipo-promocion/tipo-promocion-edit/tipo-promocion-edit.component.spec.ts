import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TipoPromocionEditComponent } from './tipo-promocion-edit.component';
import { TipoPromocionService } from '../tipo-promocion.service';

describe('TipoPromocionEditComponent', () => {
  let component: TipoPromocionEditComponent;
  let fixture: ComponentFixture<TipoPromocionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipoPromocionEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [TipoPromocionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPromocionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
