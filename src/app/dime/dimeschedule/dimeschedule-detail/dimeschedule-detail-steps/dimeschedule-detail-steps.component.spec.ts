import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleDetailStepsComponent } from './dimeschedule-detail-steps.component';

describe('DimescheduleDetailStepsComponent', () => {
  let component: DimescheduleDetailStepsComponent;
  let fixture: ComponentFixture<DimescheduleDetailStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleDetailStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleDetailStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
