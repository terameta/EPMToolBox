import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmusersComponent } from './acmusers.component';

describe('AcmusersComponent', () => {
  let component: AcmusersComponent;
  let fixture: ComponentFixture<AcmusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
