import { TestBed } from '@angular/core/testing';
import { SucursalProdStockService } from './sucursal-prod-stock.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SucursalProdStockService', () => {
  let service: SucursalProdStockService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SucursalProdStockService]
    });

    service = TestBed.get(SucursalProdStockService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
