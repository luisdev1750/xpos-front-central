import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadListComponent } from '../../actividad/actividad-list/actividad-list.component';


describe('ActividadesListComponent', () => {
  let component: ActividadesListComponent;
  let fixture: ComponentFixture<ActividadesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActividadesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
