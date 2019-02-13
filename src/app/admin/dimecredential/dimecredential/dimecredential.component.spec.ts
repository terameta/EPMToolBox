import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimecredentialComponent } from './dimecredential.component';

describe('DimecredentialComponent', () => {
  let component: DimecredentialComponent;
  let fixture: ComponentFixture<DimecredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimecredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimecredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
