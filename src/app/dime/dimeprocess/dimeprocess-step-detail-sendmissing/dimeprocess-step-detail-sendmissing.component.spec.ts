import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailSendmissingComponent } from './dimeprocess-step-detail-sendmissing.component';

describe('DimeprocessStepDetailSendmissingComponent', () => {
  let component: DimeprocessStepDetailSendmissingComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailSendmissingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailSendmissingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailSendmissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
