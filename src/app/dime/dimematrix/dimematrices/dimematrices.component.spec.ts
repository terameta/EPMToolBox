import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimematricesComponent } from './dimematrices.component';

describe('DimematricesComponent', () => {
  let component: DimematricesComponent;
  let fixture: ComponentFixture<DimematricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimematricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimematricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
