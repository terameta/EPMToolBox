import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimecredentialListComponent } from './dimecredential-list.component';

describe('DimecredentialListComponent', () => {
  let component: DimecredentialListComponent;
  let fixture: ComponentFixture<DimecredentialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimecredentialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimecredentialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
