import { TestBed } from '@angular/core/testing';
import { ModuleService } from './module.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ModuleService', () => {
  let service: ModuleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModuleService]
    });

    service = TestBed.get(ModuleService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
