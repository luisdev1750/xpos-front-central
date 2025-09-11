import { TestBed } from '@angular/core/testing';
import { NivelEstudioService } from './nivel-estudio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NivelEstudioService', () => {
  let service: NivelEstudioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NivelEstudioService]
    });

    service = TestBed.get(NivelEstudioService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
