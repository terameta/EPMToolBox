import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmserverDetailComponent } from './acmserver-detail.component';

describe('AcmserverDetailComponent', () => {
  let component: AcmserverDetailComponent;
  let fixture: ComponentFixture<AcmserverDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmserverDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmserverDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
