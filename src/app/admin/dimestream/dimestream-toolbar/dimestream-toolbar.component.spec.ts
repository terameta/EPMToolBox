import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DimestreamToolbarComponent } from "./dimestream-toolbar.component";

describe("DimestreamToolbarComponent", () => {
	let component: DimestreamToolbarComponent;
	let fixture: ComponentFixture<DimestreamToolbarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DimestreamToolbarComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DimestreamToolbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
