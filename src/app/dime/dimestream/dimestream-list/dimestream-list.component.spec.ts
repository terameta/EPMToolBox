import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DimestreamListComponent } from "./dimestream-list.component";

describe("DimestreamListComponent", () => {
	let component: DimestreamListComponent;
	let fixture: ComponentFixture<DimestreamListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DimestreamListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DimestreamListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
