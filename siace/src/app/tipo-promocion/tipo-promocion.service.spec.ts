import { TestBed } from '@angular/core/testing';
import { TipoPromocionService } from './tipo-promocion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TipoPromocionService', () => {
  let service: TipoPromocionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoPromocionService]
    });

    service = TestBed.get(TipoPromocionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
