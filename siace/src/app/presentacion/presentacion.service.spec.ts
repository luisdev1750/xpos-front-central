import { TestBed } from '@angular/core/testing';
import { PresentacionService } from './presentacion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PresentacionService', () => {
  let service: PresentacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PresentacionService]
    });

    service = TestBed.get(PresentacionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
