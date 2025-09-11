import { TestBed } from '@angular/core/testing';
import { ListaPrecioService } from './lista-precio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ListaPrecioService', () => {
  let service: ListaPrecioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListaPrecioService]
    });

    service = TestBed.get(ListaPrecioService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
