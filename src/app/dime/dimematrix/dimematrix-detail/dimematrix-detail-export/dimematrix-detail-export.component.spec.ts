import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailExportComponent } from './dimematrix-detail-export.component';

describe('DimematrixDetailExportComponent', () => {
  let component: DimematrixDetailExportComponent;
  let fixture: ComponentFixture<DimematrixDetailExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
