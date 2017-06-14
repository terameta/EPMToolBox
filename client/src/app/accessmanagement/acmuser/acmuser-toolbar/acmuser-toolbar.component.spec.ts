import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmuserToolbarComponent } from './acmuser-toolbar.component';

describe('AcmuserToolbarComponent', () => {
  let component: AcmuserToolbarComponent;
  let fixture: ComponentFixture<AcmuserToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmuserToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmuserToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
