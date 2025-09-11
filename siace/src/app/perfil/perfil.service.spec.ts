import { TestBed } from '@angular/core/testing';
import { PerfilService } from './perfil.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfilService]
    });

    service = TestBed.get(PerfilService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
