import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService]
    });

    service = TestBed.get(RoleService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
