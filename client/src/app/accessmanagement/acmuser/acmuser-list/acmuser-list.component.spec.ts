import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmuserListComponent } from './acmuser-list.component';

describe('AcmuserListComponent', () => {
  let component: AcmuserListComponent;
  let fixture: ComponentFixture<AcmuserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmuserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmuserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
