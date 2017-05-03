import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessComponent } from './dimeprocess.component';

describe('DimeprocessComponent', () => {
  let component: DimeprocessComponent;
  let fixture: ComponentFixture<DimeprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
