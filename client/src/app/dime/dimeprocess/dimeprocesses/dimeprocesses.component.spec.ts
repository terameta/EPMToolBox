import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessesComponent } from './dimeprocesses.component';

describe('DimeprocessesComponent', () => {
  let component: DimeprocessesComponent;
  let fixture: ComponentFixture<DimeprocessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
