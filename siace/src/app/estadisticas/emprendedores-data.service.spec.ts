import { TestBed } from '@angular/core/testing';

import { EmprendedoresDataService } from './emprendedores-data.service';

describe('EmprendedoresDataService', () => {
  let service: EmprendedoresDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprendedoresDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
