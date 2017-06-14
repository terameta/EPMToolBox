import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmserverToolbarComponent } from './acmserver-toolbar.component';

describe('AcmserverToolbarComponent', () => {
  let component: AcmserverToolbarComponent;
  let fixture: ComponentFixture<AcmserverToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmserverToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmserverToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
