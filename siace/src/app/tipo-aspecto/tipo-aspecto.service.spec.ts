import { TestBed } from '@angular/core/testing';
import { TipoAspectoService } from './tipo-aspecto.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TipoAspectoService', () => {
  let service: TipoAspectoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoAspectoService]
    });

    service = TestBed.get(TipoAspectoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
