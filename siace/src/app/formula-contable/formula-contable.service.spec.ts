import { TestBed } from '@angular/core/testing';
import { FormulaContableService } from './formula-contable.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FormulaContableService', () => {
  let service: FormulaContableService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormulaContableService]
    });

    service = TestBed.get(FormulaContableService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
