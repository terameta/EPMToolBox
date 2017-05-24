import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessStepDetailComponent } from './dimeprocess-step-detail.component';

describe('DimeprocessStepDetailComponent', () => {
  let component: DimeprocessStepDetailComponent;
  let fixture: ComponentFixture<DimeprocessStepDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessStepDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessStepDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
