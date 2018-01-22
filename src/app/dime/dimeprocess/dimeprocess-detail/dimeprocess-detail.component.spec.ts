import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailComponent } from './dimeprocess-detail.component';

describe('DimeprocessDetailComponent', () => {
  let component: DimeprocessDetailComponent;
  let fixture: ComponentFixture<DimeprocessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
