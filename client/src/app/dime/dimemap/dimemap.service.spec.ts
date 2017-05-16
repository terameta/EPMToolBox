import { TestBed, inject } from '@angular/core/testing';

import { DimemapService } from './dimemap.service';

describe('DimemapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DimemapService]
    });
  });

  it('should be created', inject([DimemapService], (service: DimemapService) => {
    expect(service).toBeTruthy();
  }));
});
