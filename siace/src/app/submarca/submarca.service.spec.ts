import { TestBed } from '@angular/core/testing';
import { SubmarcaService } from './submarca.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SubmarcaService', () => {
  let service: SubmarcaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubmarcaService]
    });

    service = TestBed.get(SubmarcaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
