import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailSenddataComponent } from './dimeprocess-step-detail-senddata.component';

describe('DimeprocessStepDetailSenddataComponent', () => {
  let component: DimeprocessStepDetailSenddataComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailSenddataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailSenddataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailSenddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
