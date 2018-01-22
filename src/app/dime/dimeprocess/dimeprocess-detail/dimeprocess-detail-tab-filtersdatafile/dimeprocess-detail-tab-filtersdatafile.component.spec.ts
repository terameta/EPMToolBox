import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeprocessDetailTabFiltersdatafileComponent } from './dimeprocess-detail-tab-filtersdatafile.component';

describe('DimeprocessDetailTabFiltersdatafileComponent', () => {
  let component: DimeprocessDetailTabFiltersdatafileComponent;
  let fixture: ComponentFixture<DimeprocessDetailTabFiltersdatafileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeprocessDetailTabFiltersdatafileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeprocessDetailTabFiltersdatafileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
