import { TestBed, inject } from '@angular/core/testing';

import { DimeenvironmentService } from './dimeenvironment.service';

describe('DimeenvironmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DimeenvironmentService]
    });
  });

  it('should ...', inject([DimeenvironmentService], (service: DimeenvironmentService) => {
    expect(service).toBeTruthy();
  }));
});
