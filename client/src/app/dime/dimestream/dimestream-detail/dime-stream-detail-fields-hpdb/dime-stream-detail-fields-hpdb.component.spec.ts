import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldsHpdbComponent } from './dime-stream-detail-fields-hpdb.component';

describe('DimeStreamDetailFieldsHpdbComponent', () => {
  let component: DimeStreamDetailFieldsHpdbComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldsHpdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldsHpdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldsHpdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
