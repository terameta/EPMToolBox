import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailFieldsComponent } from './dime-stream-detail-fields.component';

describe('DimeStreamDetailFieldsComponent', () => {
  let component: DimeStreamDetailFieldsComponent;
  let fixture: ComponentFixture<DimeStreamDetailFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
