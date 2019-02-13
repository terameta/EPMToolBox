import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimecredentialDetailComponent } from './dimecredential-detail.component';

describe('DimecredentialDetailComponent', () => {
  let component: DimecredentialDetailComponent;
  let fixture: ComponentFixture<DimecredentialDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimecredentialDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimecredentialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
