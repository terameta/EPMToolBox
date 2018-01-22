import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixComponent } from './dimematrix.component';

describe('DimematrixComponent', () => {
  let component: DimematrixComponent;
  let fixture: ComponentFixture<DimematrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
