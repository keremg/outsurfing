import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRouteReviewsPage } from './single-route-reviews.page';

describe('SingleRouteReviewsPage', () => {
  let component: SingleRouteReviewsPage;
  let fixture: ComponentFixture<SingleRouteReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRouteReviewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRouteReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
