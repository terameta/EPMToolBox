import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimecredentialToolbarComponent } from './dimecredential-toolbar.component';

describe('DimecredentialToolbarComponent', () => {
  let component: DimecredentialToolbarComponent;
  let fixture: ComponentFixture<DimecredentialToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimecredentialToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimecredentialToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
