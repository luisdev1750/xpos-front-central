import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PromocionObsequioListComponent } from './promocion-obsequio-list.component';
import { PromocionObsequioService } from '../promocion-obsequio.service';

describe('PromocionObsequioListComponent', () => {
  let component: PromocionObsequioListComponent;
  let fixture: ComponentFixture<PromocionObsequioListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromocionObsequioListComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule, NoopAnimationsModule],
      providers: [PromocionObsequioService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocionObsequioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
