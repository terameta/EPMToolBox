import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailSendlogsComponent } from './dimeprocess-step-detail-sendlogs.component';

describe('DimeprocessStepDetailSendlogsComponent', () => {
  let component: DimeprocessStepDetailSendlogsComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailSendlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailSendlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailSendlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
