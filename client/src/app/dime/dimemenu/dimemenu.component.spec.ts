import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimemenuComponent } from './dimemenu.component';

describe('DimemenuComponent', () => {
  let component: DimemenuComponent;
  let fixture: ComponentFixture<DimemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
