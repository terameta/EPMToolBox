import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessmanagementdashboardComponent } from './accessmanagementdashboard.component';

describe('AccessmanagementdashboardComponent', () => {
  let component: AccessmanagementdashboardComponent;
  let fixture: ComponentFixture<AccessmanagementdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessmanagementdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessmanagementdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
