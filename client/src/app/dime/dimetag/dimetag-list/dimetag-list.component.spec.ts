import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimetagListComponent } from './dimetag-list.component';

describe('DimetagListComponent', () => {
  let component: DimetagListComponent;
  let fixture: ComponentFixture<DimetagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimetagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimetagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
