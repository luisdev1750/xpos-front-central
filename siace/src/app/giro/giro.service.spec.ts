import { TestBed } from '@angular/core/testing';
import { GiroService } from './giro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GiroService', () => {
  let service: GiroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GiroService]
    });

    service = TestBed.get(GiroService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
