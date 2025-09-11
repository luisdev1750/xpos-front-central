import { TestBed } from '@angular/core/testing';
import { ObjetivoService } from './objetivo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ObjetivoService', () => {
  let service: ObjetivoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObjetivoService]
    });

    service = TestBed.get(ObjetivoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
