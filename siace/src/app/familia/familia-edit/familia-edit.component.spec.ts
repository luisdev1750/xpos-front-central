import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FamiliaEditComponent } from './familia-edit.component';
import { FamiliaService } from '../familia.service';

describe('FamiliaEditComponent', () => {
  let component: FamiliaEditComponent;
  let fixture: ComponentFixture<FamiliaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FamiliaEditComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, MatFormFieldModule],
      providers: [FamiliaService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
