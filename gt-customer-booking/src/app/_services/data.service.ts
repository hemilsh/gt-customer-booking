import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private tourSelectedDateSource = new BehaviorSubject('');
  tourSelectedDateMessage = this.tourSelectedDateSource.asObservable();

  private monthlyVacantReportSelectedDateSource = new BehaviorSubject('');
  monthlyVacantReportSelectedDateMessage = this.monthlyVacantReportSelectedDateSource.asObservable();

  private customCalendarSource = new BehaviorSubject('');
  currentCustomCalendar = this.customCalendarSource.asObservable();

  constructor() { }

  changeMessage(message: any) {
    this.messageSource.next(message)
  }
  changeTourSelectedDateMessage(message: any) {
    this.tourSelectedDateSource.next(message)
  }
  changeMonthlyVacantReportSelectedDateMessage(message: any) {
    this.monthlyVacantReportSelectedDateSource.next(message)
  }
  changeCustomCalendar(message: any) {
    this.customCalendarSource.next(message)
  }

}