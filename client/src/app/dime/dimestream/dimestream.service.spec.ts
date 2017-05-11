import { TestBed, inject } from "@angular/core/testing";

import { DimeStreamService } from "./dimestream.service";

describe("DimeStreamService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DimeStreamService]
		});
	});

	it("should ...", inject([DimeStreamService], (service: DimeStreamService) => {
		expect(service).toBeTruthy();
	}));
});
