import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesettingsComponent } from './dimesettings.component';

describe('DimesettingsComponent', () => {
  let component: DimesettingsComponent;
  let fixture: ComponentFixture<DimesettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
