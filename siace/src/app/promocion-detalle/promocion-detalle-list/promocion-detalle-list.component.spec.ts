import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PromocionDetalleListComponent } from './promocion-detalle-list.component';
import { PromocionDetalleService } from '../promocion-detalle.service';

describe('PromocionDetalleListComponent', () => {
  let component: PromocionDetalleListComponent;
  let fixture: ComponentFixture<PromocionDetalleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromocionDetalleListComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule, NoopAnimationsModule],
      providers: [PromocionDetalleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionDetalleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
