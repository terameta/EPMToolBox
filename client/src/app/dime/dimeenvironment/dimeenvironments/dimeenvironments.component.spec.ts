import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeenvironmentsComponent } from './dimeenvironments.component';

describe('DimeenvironmentsComponent', () => {
  let component: DimeenvironmentsComponent;
  let fixture: ComponentFixture<DimeenvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeenvironmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeenvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
