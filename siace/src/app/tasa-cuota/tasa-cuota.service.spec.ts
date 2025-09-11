import { TestBed } from '@angular/core/testing';
import { TasaCuotaService } from './tasa-cuota.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TasaCuotaService', () => {
  let service: TasaCuotaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasaCuotaService]
    });

    service = TestBed.get(TasaCuotaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
