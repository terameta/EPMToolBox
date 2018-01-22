import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeenvironmentListComponent } from './dimeenvironment-list.component';

describe('DimeenvironmentListComponent', () => {
  let component: DimeenvironmentListComponent;
  let fixture: ComponentFixture<DimeenvironmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeenvironmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeenvironmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
