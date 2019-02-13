import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesecretListComponent } from './dimesecret-list.component';

describe('DimesecretListComponent', () => {
  let component: DimesecretListComponent;
  let fixture: ComponentFixture<DimesecretListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesecretListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesecretListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
