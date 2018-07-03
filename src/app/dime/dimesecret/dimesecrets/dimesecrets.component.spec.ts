import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimesecretsComponent } from './dimesecrets.component';

describe('DimesecretsComponent', () => {
  let component: DimesecretsComponent;
  let fixture: ComponentFixture<DimesecretsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimesecretsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimesecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
