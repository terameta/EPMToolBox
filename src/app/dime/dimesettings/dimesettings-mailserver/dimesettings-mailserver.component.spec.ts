import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesettingsMailserverComponent } from './dimesettings-mailserver.component';

describe('DimesettingsMailserverComponent', () => {
  let component: DimesettingsMailserverComponent;
  let fixture: ComponentFixture<DimesettingsMailserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesettingsMailserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesettingsMailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
