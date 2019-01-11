import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsLinesComponent } from './participants-lines.component';

describe('ParticipantsLinesComponent', () => {
  let component: ParticipantsLinesComponent;
  let fixture: ComponentFixture<ParticipantsLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
