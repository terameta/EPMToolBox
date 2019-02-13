import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeenvironmentToolbarComponent } from './dimeenvironment-toolbar.component';

describe('DimeenvironmentToolbarComponent', () => {
  let component: DimeenvironmentToolbarComponent;
  let fixture: ComponentFixture<DimeenvironmentToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeenvironmentToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeenvironmentToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
