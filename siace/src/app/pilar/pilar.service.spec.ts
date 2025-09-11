import { TestBed } from '@angular/core/testing';
import { PilarService } from './pilar.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PilarService', () => {
  let service: PilarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PilarService]
    });

    service = TestBed.get(PilarService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
