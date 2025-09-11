import { TestBed } from '@angular/core/testing';
import { ApoyoService } from './apoyo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApoyoService', () => {
  let service: ApoyoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApoyoService]
    });

    service = TestBed.get(ApoyoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
