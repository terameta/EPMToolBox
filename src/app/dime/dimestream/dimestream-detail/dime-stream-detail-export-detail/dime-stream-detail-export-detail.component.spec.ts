import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailExportDetailComponent } from './dime-stream-detail-export-detail.component';

describe('DimeStreamDetailExportDetailComponent', () => {
  let component: DimeStreamDetailExportDetailComponent;
  let fixture: ComponentFixture<DimeStreamDetailExportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailExportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailExportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
