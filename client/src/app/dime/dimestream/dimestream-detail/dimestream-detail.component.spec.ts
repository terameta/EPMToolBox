import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DimestreamDetailComponent } from "./dimestream-detail.component";

describe("DimestreamDetailComponent", () => {
	let component: DimestreamDetailComponent;
	let fixture: ComponentFixture<DimestreamDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DimestreamDetailComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DimestreamDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
