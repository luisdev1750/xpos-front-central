import { TestBed } from '@angular/core/testing';
import { EmprendedorService } from './emprendedor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('EmprendedorService', () => {
  let service: EmprendedorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmprendedorService]
    });

    service = TestBed.get(EmprendedorService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
