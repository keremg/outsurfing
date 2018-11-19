import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoutePage } from './create-route.page';

describe('CreateRoutePage', () => {
  let component: CreateRoutePage;
  let fixture: ComponentFixture<CreateRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
