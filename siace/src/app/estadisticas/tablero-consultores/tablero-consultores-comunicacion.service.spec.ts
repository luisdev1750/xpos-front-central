import { TestBed } from '@angular/core/testing';

import { TableroConsultoresComunicacionService } from './tablero-consultores-comunicacion.service';

describe('TableroConsultoresComunicacionService', () => {
  let service: TableroConsultoresComunicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableroConsultoresComunicacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
