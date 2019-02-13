import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesettingsToolbarComponent } from './dimesettings-toolbar.component';

describe('DimesettingsToolbarComponent', () => {
  let component: DimesettingsToolbarComponent;
  let fixture: ComponentFixture<DimesettingsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesettingsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesettingsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
