import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailFieldsComponent } from './dimematrix-detail-fields.component';

describe('DimematrixDetailFieldsComponent', () => {
  let component: DimematrixDetailFieldsComponent;
  let fixture: ComponentFixture<DimematrixDetailFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
