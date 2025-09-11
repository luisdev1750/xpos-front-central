import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnPromedioContestacionComponent } from './column-promedio-contestacion.component';

describe('ColumnPromedioContestacionComponent', () => {
  let component: ColumnPromedioContestacionComponent;
  let fixture: ComponentFixture<ColumnPromedioContestacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnPromedioContestacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnPromedioContestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
