import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimetagDetailComponent } from './dimetag-detail.component';

describe('DimetagDetailComponent', () => {
  let component: DimetagDetailComponent;
  let fixture: ComponentFixture<DimetagDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimetagDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimetagDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
