import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabMaindefinitionsComponent } from './dimeprocess-detail-tab-maindefinitions.component';

describe('DimeprocessDetailTabMaindefinitionsComponent', () => {
  let component: DimeprocessDetailTabMaindefinitionsComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabMaindefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabMaindefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabMaindefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
