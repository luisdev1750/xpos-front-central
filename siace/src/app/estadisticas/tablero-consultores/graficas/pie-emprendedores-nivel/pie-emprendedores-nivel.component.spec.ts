import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieEmprendedoresNivelComponent } from './pie-emprendedores-nivel.component';

describe('PieEmprendedoresNivelComponent', () => {
  let component: PieEmprendedoresNivelComponent;
  let fixture: ComponentFixture<PieEmprendedoresNivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieEmprendedoresNivelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieEmprendedoresNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
