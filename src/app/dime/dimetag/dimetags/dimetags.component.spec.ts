import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimetagsComponent } from './dimetags.component';

describe('DimetagsComponent', () => {
  let component: DimetagsComponent;
  let fixture: ComponentFixture<DimetagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimetagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimetagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
