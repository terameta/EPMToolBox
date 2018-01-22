import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldDescriptionsRouterComponent } from './dime-stream-detail-field-descriptions-router.component';

describe('DimeStreamDetailFieldDescriptionsRouterComponent', () => {
  let component: DimeStreamDetailFieldDescriptionsRouterComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldDescriptionsRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldDescriptionsRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldDescriptionsRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
