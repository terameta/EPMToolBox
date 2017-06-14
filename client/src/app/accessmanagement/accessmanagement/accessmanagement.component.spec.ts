import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessmanagementComponent } from './accessmanagement.component';

describe('AccessmanagementComponent', () => {
  let component: AccessmanagementComponent;
  let fixture: ComponentFixture<AccessmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
