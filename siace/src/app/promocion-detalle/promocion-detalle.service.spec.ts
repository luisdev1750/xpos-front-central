import { TestBed } from '@angular/core/testing';
import { PromocionDetalleService } from './promocion-detalle.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PromocionDetalleService', () => {
  let service: PromocionDetalleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromocionDetalleService]
    });

    service = TestBed.get(PromocionDetalleService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
