import { TestBed } from '@angular/core/testing';
import { FamiliaService } from './familia.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FamiliaService', () => {
  let service: FamiliaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FamiliaService]
    });

    service = TestBed.get(FamiliaService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
