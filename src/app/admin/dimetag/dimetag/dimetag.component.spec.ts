import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimetagComponent } from './dimetag.component';

describe('DimetagComponent', () => {
  let component: DimetagComponent;
  let fixture: ComponentFixture<DimetagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimetagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimetagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
