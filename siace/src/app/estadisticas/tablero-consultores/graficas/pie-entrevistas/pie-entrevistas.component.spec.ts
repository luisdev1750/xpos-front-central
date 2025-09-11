import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieEntrevistasComponent } from './pie-entrevistas.component';

describe('PieEntrevistasComponent', () => {
  let component: PieEntrevistasComponent;
  let fixture: ComponentFixture<PieEntrevistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieEntrevistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieEntrevistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
