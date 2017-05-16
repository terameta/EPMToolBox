import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapListComponent } from './dimemap-list.component';

describe('DimemapListComponent', () => {
  let component: DimemapListComponent;
  let fixture: ComponentFixture<DimemapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
