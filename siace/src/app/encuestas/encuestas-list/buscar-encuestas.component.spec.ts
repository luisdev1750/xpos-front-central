import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasListComponent } from './buscar-encuestas.component';

describe('EncuestasListComponent', () => {
  let component: EncuestasListComponent;
  let fixture: ComponentFixture<EncuestasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncuestasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
