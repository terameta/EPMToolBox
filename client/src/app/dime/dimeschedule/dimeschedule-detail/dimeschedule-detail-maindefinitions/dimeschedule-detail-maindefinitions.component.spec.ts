import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleDetailMaindefinitionsComponent } from './dimeschedule-detail-maindefinitions.component';

describe('DimescheduleDetailMaindefinitionsComponent', () => {
  let component: DimescheduleDetailMaindefinitionsComponent;
  let fixture: ComponentFixture<DimescheduleDetailMaindefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleDetailMaindefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleDetailMaindefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
