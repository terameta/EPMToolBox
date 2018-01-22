import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapDetailComponent } from './dimemap-detail.component';

describe('DimemapDetailComponent', () => {
  let component: DimemapDetailComponent;
  let fixture: ComponentFixture<DimemapDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
