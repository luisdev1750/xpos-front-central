import { TestBed } from '@angular/core/testing';
import { PromocionObsequioService } from './promocion-obsequio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PromocionObsequioService', () => {
  let service: PromocionObsequioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromocionObsequioService]
    });

    service = TestBed.get(PromocionObsequioService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
