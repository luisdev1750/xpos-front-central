import { TestBed } from '@angular/core/testing';
import { TipoSesionService } from './tipo-sesion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TipoSesionService', () => {
  let service: TipoSesionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoSesionService]
    });

    service = TestBed.get(TipoSesionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
