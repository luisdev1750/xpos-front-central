import { TestBed } from '@angular/core/testing';

import { PilaresDataService } from './pilares-data.service';

describe('PilaresDataService', () => {
  let service: PilaresDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PilaresDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
