import { TestBed } from '@angular/core/testing';
import { AuditoriaService } from './auditoria.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditoriaService]
    });

    service = TestBed.get(AuditoriaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
