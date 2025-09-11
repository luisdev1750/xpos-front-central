import { TestBed } from '@angular/core/testing';
import { SucursalConfigService } from './sucursal-config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SucursalConfigService', () => {
  let service: SucursalConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SucursalConfigService]
    });

    service = TestBed.get(SucursalConfigService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
