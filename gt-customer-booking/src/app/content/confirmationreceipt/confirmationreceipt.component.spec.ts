import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationreceiptComponent } from './confirmationreceipt.component';

describe('ConfirmationreceiptComponent', () => {
  let component: ConfirmationreceiptComponent;
  let fixture: ComponentFixture<ConfirmationreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
