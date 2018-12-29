import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewsPage } from './user-reviews.page';

describe('UserReviewsPage', () => {
  let component: UserReviewsPage;
  let fixture: ComponentFixture<UserReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReviewsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
