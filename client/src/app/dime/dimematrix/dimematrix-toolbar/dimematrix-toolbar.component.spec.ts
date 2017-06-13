import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixToolbarComponent } from './dimematrix-toolbar.component';

describe('DimematrixToolbarComponent', () => {
  let component: DimematrixToolbarComponent;
  let fixture: ComponentFixture<DimematrixToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
