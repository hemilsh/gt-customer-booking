import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourBookingDetailsComponent } from './tourBookingDetails.component';

describe('TourBookingDetailsComponent', () => {
  let component: TourBookingDetailsComponent;
  let fixture: ComponentFixture<TourBookingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourBookingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
