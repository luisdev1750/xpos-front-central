import { TestBed } from '@angular/core/testing';
import { BancoService } from './banco.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BancoService', () => {
  let service: BancoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BancoService]
    });

    service = TestBed.get(BancoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
