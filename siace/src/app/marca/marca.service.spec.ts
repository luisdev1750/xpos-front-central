import { TestBed } from '@angular/core/testing';
import { MarcaService } from './marca.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MarcaService', () => {
  let service: MarcaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarcaService]
    });

    service = TestBed.get(MarcaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
