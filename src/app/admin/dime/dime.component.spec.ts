import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeComponent } from './dime.component';

describe('DimeComponent', () => {
  let component: DimeComponent;
  let fixture: ComponentFixture<DimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
