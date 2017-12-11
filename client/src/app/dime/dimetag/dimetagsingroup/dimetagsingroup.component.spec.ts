import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimetagsingroupComponent } from './dimetagsingroup.component';

describe('DimetagsingroupComponent', () => {
  let component: DimetagsingroupComponent;
  let fixture: ComponentFixture<DimetagsingroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimetagsingroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimetagsingroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
