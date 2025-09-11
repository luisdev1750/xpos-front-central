import { TestBed } from '@angular/core/testing';
import { SucursalService } from './sucursal.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SucursalService', () => {
  let service: SucursalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SucursalService]
    });

    service = TestBed.get(SucursalService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
