import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlerClickComponent } from './handler-click.component';

describe('HandlerClickComponent', () => {
  let component: HandlerClickComponent;
  let fixture: ComponentFixture<HandlerClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HandlerClickComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandlerClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
