import { TestBed, inject } from '@angular/core/testing';

import { DimematrixService } from './dimematrix.service';

describe('DimematrixService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DimematrixService]
    });
  });

  it('should be created', inject([DimematrixService], (service: DimematrixService) => {
    expect(service).toBeTruthy();
  }));
});
