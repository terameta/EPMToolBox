import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleDetailHistoryComponent } from './dimeschedule-detail-history.component';

describe('DimescheduleDetailHistoryComponent', () => {
  let component: DimescheduleDetailHistoryComponent;
  let fixture: ComponentFixture<DimescheduleDetailHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleDetailHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
