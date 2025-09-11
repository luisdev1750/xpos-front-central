import { TestBed } from '@angular/core/testing';
import { EvidenciaService } from './evidencia.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('EvidenciaService', () => {
  let service: EvidenciaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EvidenciaService]
    });

    service = TestBed.get(EvidenciaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
