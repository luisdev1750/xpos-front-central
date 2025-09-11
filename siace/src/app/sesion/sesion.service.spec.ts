import { TestBed } from '@angular/core/testing';
import { SesionService } from './sesion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SesionService', () => {
  let service: SesionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SesionService]
    });

    service = TestBed.get(SesionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
