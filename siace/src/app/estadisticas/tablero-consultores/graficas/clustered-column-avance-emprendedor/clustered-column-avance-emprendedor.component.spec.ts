import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusteredColumnAvanceEmprendedorComponent } from './clustered-column-avance-emprendedor.component';

describe('ClusteredColumnAvanceEmprendedorComponent', () => {
  let component: ClusteredColumnAvanceEmprendedorComponent;
  let fixture: ComponentFixture<ClusteredColumnAvanceEmprendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClusteredColumnAvanceEmprendedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClusteredColumnAvanceEmprendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
