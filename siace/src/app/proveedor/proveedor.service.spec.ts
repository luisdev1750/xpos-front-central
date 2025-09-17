import { TestBed } from '@angular/core/testing';
import { ProveedorService } from './proveedor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProveedorService', () => {
  let service: ProveedorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProveedorService]
    });

    service = TestBed.get(ProveedorService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
