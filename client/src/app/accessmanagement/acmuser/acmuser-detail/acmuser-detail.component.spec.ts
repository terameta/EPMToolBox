import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmuserDetailComponent } from './acmuser-detail.component';

describe('AcmuserDetailComponent', () => {
  let component: AcmuserDetailComponent;
  let fixture: ComponentFixture<AcmuserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmuserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmuserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
