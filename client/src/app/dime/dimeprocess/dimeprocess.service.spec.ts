import { TestBed, inject } from '@angular/core/testing';

import { DimeprocessesService } from './dimeprocess.service';

describe('DimeprocessesService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DimeprocessesService]
		});
	});

	it('should ...', inject([DimeprocessesService], (service: DimeprocessesService) => {
		expect(service).toBeTruthy();
	}));
});
