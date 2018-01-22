import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleToolbarComponent } from './dimeschedule-toolbar.component';

describe('DimescheduleToolbarComponent', () => {
  let component: DimescheduleToolbarComponent;
  let fixture: ComponentFixture<DimescheduleToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
