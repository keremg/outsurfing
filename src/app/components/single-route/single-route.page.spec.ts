import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRoutePage } from './single-route.page';

describe('SingleRoutePage', () => {
  let component: SingleRoutePage;
  let fixture: ComponentFixture<SingleRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
