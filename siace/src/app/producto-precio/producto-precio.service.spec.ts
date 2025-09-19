import { TestBed } from '@angular/core/testing';
import { ProductoPrecioService } from './producto-precio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProductoPrecioService', () => {
  let service: ProductoPrecioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoPrecioService]
    });

    service = TestBed.get(ProductoPrecioService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
