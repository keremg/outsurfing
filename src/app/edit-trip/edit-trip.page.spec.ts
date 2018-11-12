import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripPage } from './edit-trip.page';

describe('EditTripPage', () => {
  let component: EditTripPage;
  let fixture: ComponentFixture<EditTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTripPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
