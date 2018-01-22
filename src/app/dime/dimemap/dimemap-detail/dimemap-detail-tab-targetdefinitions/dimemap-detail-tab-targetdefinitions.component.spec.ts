import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailTabTargetdefinitionsComponent } from './dimemap-detail-tab-targetdefinitions.component';

describe('DimemapDetailTabTargetdefinitionsComponent', () => {
  let component: DimemapDetailTabTargetdefinitionsComponent;
  let fixture: ComponentFixture<DimemapDetailTabTargetdefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailTabTargetdefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailTabTargetdefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
