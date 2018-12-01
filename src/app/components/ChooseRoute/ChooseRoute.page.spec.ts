import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRoute } from './ChooseRoute.page';

describe('ChooseRoutePage', () => {
  let component: ChooseRoute;
  let fixture: ComponentFixture<ChooseRoute>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseRoute ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
