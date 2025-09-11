import { TestBed } from '@angular/core/testing';
import { VersionService } from './version.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('VersionService', () => {
  let service: VersionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VersionService]
    });

    service = TestBed.get(VersionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
