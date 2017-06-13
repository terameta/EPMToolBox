import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailComponent } from './dimematrix-detail.component';

describe('DimematrixDetailComponent', () => {
  let component: DimematrixDetailComponent;
  let fixture: ComponentFixture<DimematrixDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
