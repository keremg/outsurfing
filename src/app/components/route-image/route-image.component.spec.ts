import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteImageComponent } from './route-image.component';

describe('RouteImageComponent', () => {
  let component: RouteImageComponent;
  let fixture: ComponentFixture<RouteImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
