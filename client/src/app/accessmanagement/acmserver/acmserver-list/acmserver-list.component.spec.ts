import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmserverListComponent } from './acmserver-list.component';

describe('AcmserverListComponent', () => {
  let component: AcmserverListComponent;
  let fixture: ComponentFixture<AcmserverListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmserverListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmserverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
