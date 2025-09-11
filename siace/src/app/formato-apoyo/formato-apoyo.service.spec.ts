import { TestBed } from '@angular/core/testing';
import { FormatoApoyoService } from './formato-apoyo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FormatoApoyoService', () => {
  let service: FormatoApoyoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormatoApoyoService]
    });

    service = TestBed.get(FormatoApoyoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
