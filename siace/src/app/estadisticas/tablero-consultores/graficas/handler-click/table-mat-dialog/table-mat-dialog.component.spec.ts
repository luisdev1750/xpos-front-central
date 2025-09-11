import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMatDialogComponent } from './table-mat-dialog.component';

describe('TableMatDialogComponent', () => {
  let component: TableMatDialogComponent;
  let fixture: ComponentFixture<TableMatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableMatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
