import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessToolbarComponent } from './dimeprocess-toolbar.component';

describe('DimeprocessToolbarComponent', () => {
  let component: DimeprocessToolbarComponent;
  let fixture: ComponentFixture<DimeprocessToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
