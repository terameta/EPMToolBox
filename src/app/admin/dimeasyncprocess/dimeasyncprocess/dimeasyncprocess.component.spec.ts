import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeasyncprocessComponent } from './dimeasyncprocess.component';

describe('DimeasyncprocessComponent', () => {
  let component: DimeasyncprocessComponent;
  let fixture: ComponentFixture<DimeasyncprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeasyncprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeasyncprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
