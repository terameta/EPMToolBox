import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmserversComponent } from './acmservers.component';

describe('AcmserversComponent', () => {
  let component: AcmserversComponent;
  let fixture: ComponentFixture<AcmserversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmserversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmserversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
