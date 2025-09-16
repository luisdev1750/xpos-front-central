import { TestBed } from '@angular/core/testing';
import { SucursalProductoService } from './sucursal-producto.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SucursalProductoService', () => {
  let service: SucursalProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SucursalProductoService]
    });

    service = TestBed.get(SucursalProductoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
