import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabFiltersComponent } from './dimeprocess-detail-tab-filters.component';

describe('DimeprocessDetailTabFiltersComponent', () => {
  let component: DimeprocessDetailTabFiltersComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
