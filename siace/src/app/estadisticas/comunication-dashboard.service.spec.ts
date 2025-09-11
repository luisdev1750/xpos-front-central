import { TestBed } from '@angular/core/testing';

import { ComunicationDashboardService } from './comunication-dashboard.service';

describe('ComunicationDashboardService', () => {
  let service: ComunicationDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicationDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
