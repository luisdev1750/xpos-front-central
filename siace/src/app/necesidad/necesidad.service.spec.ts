import { TestBed } from '@angular/core/testing';
import { NecesidadService } from './necesidad.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NecesidadService', () => {
  let service: NecesidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NecesidadService]
    });

    service = TestBed.get(NecesidadService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
