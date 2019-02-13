import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeenvironmentDetailComponent } from './dimeenvironment-detail.component';

describe('DimeenvironmentDetailComponent', () => {
  let component: DimeenvironmentDetailComponent;
  let fixture: ComponentFixture<DimeenvironmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeenvironmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeenvironmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
