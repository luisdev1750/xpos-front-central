import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciasAddComponent } from './evidencias-add.component';

describe('EvidenciasAddComponent', () => {
  let component: EvidenciasAddComponent;
  let fixture: ComponentFixture<EvidenciasAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidenciasAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
