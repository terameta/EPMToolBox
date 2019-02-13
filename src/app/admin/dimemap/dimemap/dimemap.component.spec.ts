import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapComponent } from './dimemap.component';

describe('DimemapComponent', () => {
  let component: DimemapComponent;
  let fixture: ComponentFixture<DimemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
