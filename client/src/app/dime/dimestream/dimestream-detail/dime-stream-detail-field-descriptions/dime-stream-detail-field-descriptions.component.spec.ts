import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldDescriptionsComponent } from './dime-stream-detail-field-descriptions.component';

describe('DimeStreamDetailFieldDescriptionsComponent', () => {
  let component: DimeStreamDetailFieldDescriptionsComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldDescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldDescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
