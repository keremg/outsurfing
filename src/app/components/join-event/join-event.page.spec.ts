import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinEventPage } from './join-event.page';

describe('JoinEventPage', () => {
  let component: JoinEventPage;
  let fixture: ComponentFixture<JoinEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
