import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmserverComponent } from './acmserver.component';

describe('AcmserverComponent', () => {
  let component: AcmserverComponent;
  let fixture: ComponentFixture<AcmserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
