import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailTabMaindefinitionsComponent } from './dimemap-detail-tab-maindefinitions.component';

describe('DimemapDetailTabMaindefinitionsComponent', () => {
  let component: DimemapDetailTabMaindefinitionsComponent;
  let fixture: ComponentFixture<DimemapDetailTabMaindefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailTabMaindefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailTabMaindefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
