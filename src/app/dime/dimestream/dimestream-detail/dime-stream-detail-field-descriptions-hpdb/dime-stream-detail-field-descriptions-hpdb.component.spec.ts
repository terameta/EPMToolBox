import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldDescriptionsHpdbComponent } from './dime-stream-detail-field-descriptions-hpdb.component';

describe('DimeStreamDetailFieldDescriptionsHpdbComponent', () => {
  let component: DimeStreamDetailFieldDescriptionsHpdbComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldDescriptionsHpdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldDescriptionsHpdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldDescriptionsHpdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
