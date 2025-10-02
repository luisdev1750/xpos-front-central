import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComboEditComponent } from './combo-edit.component';
import { ComboService } from '../combo.service';


describe('BancoEditComponent', () => {
  let component: ComboEditComponent;
  let fixture: ComponentFixture<ComboEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComboEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [ComboService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
