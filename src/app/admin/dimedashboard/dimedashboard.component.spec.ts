import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimedashboardComponent } from './dimedashboard.component';

describe('DimedashboardComponent', () => {
  let component: DimedashboardComponent;
  let fixture: ComponentFixture<DimedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
