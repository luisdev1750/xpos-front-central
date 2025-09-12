import { TestBed } from '@angular/core/testing';
import { MenuPerfilService } from './menu-perfil.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MenuPerfilService', () => {
  let service: MenuPerfilService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuPerfilService]
    });

    service = TestBed.get(MenuPerfilService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
