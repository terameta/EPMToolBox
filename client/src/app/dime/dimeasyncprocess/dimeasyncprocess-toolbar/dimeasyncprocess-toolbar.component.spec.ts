import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeasyncprocessToolbarComponent } from './dimeasyncprocess-toolbar.component';

describe('DimeasyncprocessToolbarComponent', () => {
  let component: DimeasyncprocessToolbarComponent;
  let fixture: ComponentFixture<DimeasyncprocessToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeasyncprocessToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeasyncprocessToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
