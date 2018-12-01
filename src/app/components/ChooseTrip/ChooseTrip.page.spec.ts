import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTrip } from './ChooseTrip.page';

describe('ChooseTripPage', () => {
  let component: ChooseTrip;
  let fixture: ComponentFixture<ChooseTrip>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTrip ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
