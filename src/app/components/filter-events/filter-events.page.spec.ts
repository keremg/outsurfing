import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEventsPage } from './filter-events.page';

describe('FilterEventsPage', () => {
  let component: FilterEventsPage;
  let fixture: ComponentFixture<FilterEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
