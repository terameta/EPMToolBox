import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixListComponent } from './dimematrix-list.component';

describe('DimematrixListComponent', () => {
  let component: DimematrixListComponent;
  let fixture: ComponentFixture<DimematrixListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
