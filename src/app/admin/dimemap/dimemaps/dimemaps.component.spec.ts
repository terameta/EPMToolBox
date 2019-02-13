import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapsComponent } from './dimemaps.component';

describe('DimemapsComponent', () => {
  let component: DimemapsComponent;
  let fixture: ComponentFixture<DimemapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
