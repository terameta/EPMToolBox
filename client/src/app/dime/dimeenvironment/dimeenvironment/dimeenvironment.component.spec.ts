import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeenvironmentComponent } from './dimeenvironment.component';

describe('DimeenvironmentComponent', () => {
  let component: DimeenvironmentComponent;
  let fixture: ComponentFixture<DimeenvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeenvironmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeenvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
