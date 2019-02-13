import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeschedulesComponent } from './dimeschedules.component';

describe('DimeschedulesComponent', () => {
  let component: DimeschedulesComponent;
  let fixture: ComponentFixture<DimeschedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeschedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeschedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
