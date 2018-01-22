import { TestBed, inject } from '@angular/core/testing';

import { DimescheduleService } from './dimeschedule.service';

describe('DimescheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DimescheduleService]
    });
  });

  it('should be created', inject([DimescheduleService], (service: DimescheduleService) => {
    expect(service).toBeTruthy();
  }));
});
