import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldDescriptionsRdbtComponent } from './dime-stream-detail-field-descriptions-rdbt.component';

describe('DimeStreamDetailFieldDescriptionsRdbtComponent', () => {
  let component: DimeStreamDetailFieldDescriptionsRdbtComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldDescriptionsRdbtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldDescriptionsRdbtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldDescriptionsRdbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
