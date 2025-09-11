import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnNumeroTiposSesionesComponent } from './column-numero-tipos-sesiones.component';

describe('ColumnNumeroTiposSesionesComponent', () => {
  let component: ColumnNumeroTiposSesionesComponent;
  let fixture: ComponentFixture<ColumnNumeroTiposSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnNumeroTiposSesionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnNumeroTiposSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
