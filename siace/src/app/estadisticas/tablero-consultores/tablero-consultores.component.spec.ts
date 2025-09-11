import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroConsultoresComponent } from './tablero-consultores.component';

describe('TableroConsultoresComponent', () => {
  let component: TableroConsultoresComponent;
  let fixture: ComponentFixture<TableroConsultoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableroConsultoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableroConsultoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
