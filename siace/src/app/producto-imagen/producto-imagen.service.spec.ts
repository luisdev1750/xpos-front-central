import { TestBed } from '@angular/core/testing';
import { ProductoImagenService } from './producto-imagen.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProductoImagenService', () => {
  let service: ProductoImagenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoImagenService]
    });

    service = TestBed.get(ProductoImagenService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
