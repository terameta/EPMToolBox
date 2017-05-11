import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DimestreamsComponent } from "./dimestreams.component";

describe("DimestreamsComponent", () => {
	let component: DimestreamsComponent;
	let fixture: ComponentFixture<DimestreamsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DimestreamsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DimestreamsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
