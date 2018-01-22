import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailMatrixComponent } from './dimematrix-detail-matrix.component';

describe('DimematrixDetailMatrixComponent', () => {
  let component: DimematrixDetailMatrixComponent;
  let fixture: ComponentFixture<DimematrixDetailMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
