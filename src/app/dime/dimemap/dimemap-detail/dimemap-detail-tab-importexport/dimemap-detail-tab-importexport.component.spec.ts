import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailTabImportexportComponent } from './dimemap-detail-tab-importexport.component';

describe('DimemapDetailTabImportexportComponent', () => {
  let component: DimemapDetailTabImportexportComponent;
  let fixture: ComponentFixture<DimemapDetailTabImportexportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailTabImportexportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailTabImportexportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
