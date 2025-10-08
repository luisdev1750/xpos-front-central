import { BannerListComponent } from './banner-list.component';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { BancoService } from '../banco.service';

describe('BannerListComponent', () => {
  let component: BannerListComponent;
  let fixture: ComponentFixture<BannerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerListComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
