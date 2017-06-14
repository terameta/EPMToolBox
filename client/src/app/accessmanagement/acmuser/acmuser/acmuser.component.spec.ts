import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmuserComponent } from './acmuser.component';

describe('AcmuserComponent', () => {
  let component: AcmuserComponent;
  let fixture: ComponentFixture<AcmuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
