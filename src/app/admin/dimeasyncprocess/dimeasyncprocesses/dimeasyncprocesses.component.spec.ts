import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeasyncprocessesComponent } from './dimeasyncprocesses.component';

describe('DimeasyncprocessesComponent', () => {
  let component: DimeasyncprocessesComponent;
  let fixture: ComponentFixture<DimeasyncprocessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeasyncprocessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeasyncprocessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
