import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleDetailComponent } from './dimeschedule-detail.component';

describe('DimescheduleDetailComponent', () => {
  let component: DimescheduleDetailComponent;
  let fixture: ComponentFixture<DimescheduleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
