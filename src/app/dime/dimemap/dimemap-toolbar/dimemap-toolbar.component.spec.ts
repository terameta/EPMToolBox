import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemapToolbarComponent } from './dimemap-toolbar.component';

describe('DimemapToolbarComponent', () => {
  let component: DimemapToolbarComponent;
  let fixture: ComponentFixture<DimemapToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemapToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemapToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
