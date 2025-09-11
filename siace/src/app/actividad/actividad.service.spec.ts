import { TestBed } from '@angular/core/testing';
import { ActividadService } from './actividad.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ActividadService', () => {
  let service: ActividadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActividadService]
    });

    service = TestBed.get(ActividadService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
