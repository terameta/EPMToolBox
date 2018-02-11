import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailTarprocedureComponent } from './dimeprocess-step-detail-tarprocedure.component';

describe('DimeprocessStepDetailTarprocedureComponent', () => {
  let component: DimeprocessStepDetailTarprocedureComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailTarprocedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailTarprocedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailTarprocedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
