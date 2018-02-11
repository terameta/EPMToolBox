import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailValidateComponent } from './dimeprocess-step-detail-validate.component';

describe('DimeprocessStepDetailValidateComponent', () => {
  let component: DimeprocessStepDetailValidateComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
