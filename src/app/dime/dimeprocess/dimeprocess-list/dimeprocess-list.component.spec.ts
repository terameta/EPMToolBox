import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessListComponent } from './dimeprocess-list.component';

describe('DimeprocessListComponent', () => {
	let component: DimeprocessListComponent;
	let fixture: ComponentFixture<DimeprocessListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DimeprocessListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DimeprocessListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
