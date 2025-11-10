import { TestBed } from '@angular/core/testing';
import { ProductoSugeridoService} from './producto-sugerido.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BancoService', () => {
  let service: ProductoSugeridoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoSugeridoService]
    });

    service = TestBed.get(ProductoSugeridoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
