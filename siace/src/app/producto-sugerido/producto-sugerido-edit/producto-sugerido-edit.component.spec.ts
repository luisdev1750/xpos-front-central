import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductoSugeridoEditComponent } from './producto-sugerido-edit.component';
import { ProductoSugeridoService } from '../producto-sugerido.service';

describe('BancoEditComponent', () => {
  let component: ProductoSugeridoEditComponent;
  let fixture: ComponentFixture<ProductoSugeridoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoSugeridoEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [ProductoSugeridoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoSugeridoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
