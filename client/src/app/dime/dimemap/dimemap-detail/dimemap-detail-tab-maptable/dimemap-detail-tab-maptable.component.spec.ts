import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailTabMaptableComponent } from './dimemap-detail-tab-maptable.component';

describe('DimemapDetailTabMaptableComponent', () => {
  let component: DimemapDetailTabMaptableComponent;
  let fixture: ComponentFixture<DimemapDetailTabMaptableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailTabMaptableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailTabMaptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
