import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleListComponent } from './dimeschedule-list.component';

describe('DimescheduleListComponent', () => {
  let component: DimescheduleListComponent;
  let fixture: ComponentFixture<DimescheduleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
