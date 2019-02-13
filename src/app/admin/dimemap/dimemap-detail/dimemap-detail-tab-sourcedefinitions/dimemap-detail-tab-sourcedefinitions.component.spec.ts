import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailTabSourcedefinitionsComponent } from './dimemap-detail-tab-sourcedefinitions.component';

describe('DimemapDetailTabSourcedefinitionsComponent', () => {
  let component: DimemapDetailTabSourcedefinitionsComponent;
  let fixture: ComponentFixture<DimemapDetailTabSourcedefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailTabSourcedefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailTabSourcedefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
