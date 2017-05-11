import { TestBed, inject } from "@angular/core/testing";

import { DimeEnvironmentService } from "./dimeenvironment.service";

describe("DimeEnvironmentService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DimeEnvironmentService]
		});
	});

	it("should ...", inject([DimeEnvironmentService], (service: DimeEnvironmentService) => {
		expect(service).toBeTruthy();
	}));
});
