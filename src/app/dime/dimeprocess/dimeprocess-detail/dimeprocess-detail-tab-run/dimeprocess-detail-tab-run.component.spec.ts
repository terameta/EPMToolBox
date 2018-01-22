import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabRunComponent } from './dimeprocess-detail-tab-run.component';

describe('DimeprocessDetailTabRunComponent', () => {
  let component: DimeprocessDetailTabRunComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
