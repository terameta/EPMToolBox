import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabStepsComponent } from './dimeprocess-detail-tab-steps.component';

describe('DimeprocessDetailTabStepsComponent', () => {
  let component: DimeprocessDetailTabStepsComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
