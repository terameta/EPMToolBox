import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematrixDetailMaindefinitionsComponent } from './dimematrix-detail-maindefinitions.component';

describe('DimematrixDetailMaindefinitionsComponent', () => {
  let component: DimematrixDetailMaindefinitionsComponent;
  let fixture: ComponentFixture<DimematrixDetailMaindefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematrixDetailMaindefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematrixDetailMaindefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
