import { TestBed } from '@angular/core/testing';

import { EstadisticasDataService } from './estadisticas-data.service';

describe('EstadisticasDataService', () => {
  let service: EstadisticasDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticasDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
