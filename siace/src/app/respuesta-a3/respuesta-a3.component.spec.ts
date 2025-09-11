import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RespuestaA3Component } from './respuesta-a3.component';


describe('RespuestaA3Component', () => {
  let component: RespuestaA3Component;
  let fixture: ComponentFixture<RespuestaA3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RespuestaA3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespuestaA3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
