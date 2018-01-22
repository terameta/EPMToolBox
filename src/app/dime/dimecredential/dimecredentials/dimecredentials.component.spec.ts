import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimecredentialsComponent } from './dimecredentials.component';

describe('DimecredentialsComponent', () => {
  let component: DimecredentialsComponent;
  let fixture: ComponentFixture<DimecredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimecredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimecredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
