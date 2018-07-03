import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesecretToolbarComponent } from './dimesecret-toolbar.component';

describe('DimesecretToolbarComponent', () => {
  let component: DimesecretToolbarComponent;
  let fixture: ComponentFixture<DimesecretToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesecretToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesecretToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
