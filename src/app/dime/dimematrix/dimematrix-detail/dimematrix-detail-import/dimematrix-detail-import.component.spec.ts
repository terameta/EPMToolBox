import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailImportComponent } from './dimematrix-detail-import.component';

describe('DimematrixDetailImportComponent', () => {
  let component: DimematrixDetailImportComponent;
  let fixture: ComponentFixture<DimematrixDetailImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
