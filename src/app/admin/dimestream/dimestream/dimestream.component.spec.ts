import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimestreamComponent } from './dimestream.component';

describe('DimestreamComponent', () => {
  let component: DimestreamComponent;
  let fixture: ComponentFixture<DimestreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimestreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimestreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
