import { TestBed } from '@angular/core/testing';
import { ProductoProveedorService } from './producto-proveedor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProductoProveedorService', () => {
  let service: ProductoProveedorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoProveedorService]
    });

    service = TestBed.get(ProductoProveedorService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
