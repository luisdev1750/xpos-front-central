import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MarcaService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });

    service = TestBed.get(MenuService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
