import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimescheduleComponent } from './dimeschedule.component';

describe('DimescheduleComponent', () => {
  let component: DimescheduleComponent;
  let fixture: ComponentFixture<DimescheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimescheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
