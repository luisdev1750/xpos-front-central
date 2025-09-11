import { TestBed } from '@angular/core/testing';
import { NivelService } from './nivel.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NivelService', () => {
  let service: NivelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NivelService]
    });

    service = TestBed.get(NivelService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
