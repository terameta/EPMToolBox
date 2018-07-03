import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesecretDetailComponent } from './dimesecret-detail.component';

describe('DimesecretDetailComponent', () => {
  let component: DimesecretDetailComponent;
  let fixture: ComponentFixture<DimesecretDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesecretDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesecretDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
