import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabDefaulttargetsComponent } from './dimeprocess-detail-tab-defaulttargets.component';

describe('DimeprocessDetailTabDefaulttargetsComponent', () => {
  let component: DimeprocessDetailTabDefaulttargetsComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabDefaulttargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabDefaulttargetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabDefaulttargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
