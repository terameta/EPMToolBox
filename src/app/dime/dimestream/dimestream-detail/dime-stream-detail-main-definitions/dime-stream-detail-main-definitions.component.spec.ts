import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimeStreamDetailMainDefinitionsComponent } from './dime-stream-detail-main-definitions.component';

describe('DimeStreamDetailMainDefinitionsComponent', () => {
  let component: DimeStreamDetailMainDefinitionsComponent;
  let fixture: ComponentFixture<DimeStreamDetailMainDefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimeStreamDetailMainDefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimeStreamDetailMainDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
