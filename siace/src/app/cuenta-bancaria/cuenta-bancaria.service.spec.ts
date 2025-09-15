import { TestBed } from '@angular/core/testing';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CuentaBancariaService', () => {
  let service: CuentaBancariaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CuentaBancariaService]
    });

    service = TestBed.get(CuentaBancariaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
