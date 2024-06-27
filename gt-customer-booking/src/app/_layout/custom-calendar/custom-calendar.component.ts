
import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as range from 'lodash.range';
import { DataService } from 'src/app/_services/data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
class ManageTourBooking {
  public id: string = '';
  public name: string = '';
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
  }
}
export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  price: String;
}

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.css']
})
export class CustomCalendarComponent implements OnInit, OnChanges {
  public currentDate: moment.Moment;
  @Input() tourStartDate;
  @Input() tourEndDate;
  public namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public weeks: Array<CalendarDate[]> = [];
  manageTourBookingView: ManageTourBooking = new ManageTourBooking();
  public selectedDate;
  public show: boolean;
  public isFilterTourFound: boolean = true;
  isMonthlyVacantReportPage: boolean = false;
  monthlyVacantReportList: any = [];
  isTourViewPage: boolean = false;
  @BlockUI('filterTourList') filterTourListBlockUI: NgBlockUI;
  dayWisePriceList = [];
  @ViewChild('calendar', { static: true }) calendar;

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      // this.show = true;
    }
  }

  constructor(
    private eRef: ElementRef,
    private data: DataService,
    private http: HttpClient,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private customCalenderService: DataService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tourStartDate.currentValue != undefined) {
      this.tourStartDate = moment(changes.tourStartDate.currentValue)
    }
    if (changes.tourEndDate.currentValue != undefined) {
      this.tourEndDate = moment(changes.tourEndDate.currentValue)
    }
  }

  ngOnInit() {
    if (window.location.href.indexOf(AppUrlConstants.tourModule + AppUrlConstants.viewOpration) > -1) {
      this.getDayWisePrice(new Date());
      this.isTourViewPage = true;
    }
    if (window.location.href.indexOf(AppUrlConstants.monthlyVacantReportModule) > -1) {
      this.isMonthlyVacantReportPage = true;
      this.onClick(this.show)
    }
    this.currentDate = moment();
    if (this.isMonthlyVacantReportPage) {
      var date: any = {}
      date.mDate = this.currentDate;
      date.first = true;
      this.data.changeMonthlyVacantReportSelectedDateMessage(date);
    }
    this.selectedDate = null;
    this.customCalenderService.currentCustomCalendar.subscribe(message => {
      if (message != '') {
        console.log(message)
        this.monthlyVacantReportList = message;
        this.generateCalendar();
        this.currentDate = moment(new Date(this.monthlyVacantReportList[0].date));
      }
    });
  }
  private generateCalendar(): void {
    var dates = [];
    if (this.isMonthlyVacantReportPage) {
      dates = this.fillDates(moment(new Date(this.monthlyVacantReportList[0].date)));
    } else if (this.isTourViewPage) {
      dates = this.fillDates(this.currentDate);
    }
    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    weeks.forEach(element => {
      element.forEach(dayList => {

        if (this.isTourViewPage) {
          this.dayWisePriceList.forEach(dayWisePrice => {
            if (new Date(dayWisePrice.date).getMonth() == new Date(dayList.mDate).getMonth()) {
              if (new Date(dayWisePrice.date).getDate() == new Date(dayList.mDate).getDate()) {
                if (dayWisePrice.price != undefined) {
                  dayList.price = dayWisePrice.price;
                }
              }
            }
          });
        }
        if (this.isMonthlyVacantReportPage) {
          this.monthlyVacantReportList.forEach(monthlyVacantReport => {
            if (monthlyVacantReport.date.split("-")[1] == new Date(dayList.mDate).getMonth() + 1) {
              if (monthlyVacantReport.date.split("-")[2] == new Date(dayList.mDate).getDate()) {
                if (monthlyVacantReport.roomTypeList != undefined) {
                  dayList.roomTypeList = monthlyVacantReport.roomTypeList;
                }
              }
            }
          });
        }
      });
    });
    this.weeks = weeks;
  }

  private fillDates(currentMoment: moment.Moment) {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth, 'days').add(7, 'days');
    const startCalendar = firstDayOfGrid.date();

    return range(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
      };
    });
  }
  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }
  private isSelected(date: moment.Moment): boolean {
    return moment(this.selectedDate).isSame(date);
  }

  public prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.getDayWisePrice(this.currentDate['_d']);
  }

  public nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    console.log(this.currentDate)
    this.getDayWisePrice(this.currentDate['_d']);
  }

  public isDisabledMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, 'months');
  }
  public isDisabledPrevMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isAfter(today, 'months');
  }

  public isSelectedMonth(date: moment.Moment): boolean {
    const today = moment();
    return true;
    // return moment(date).isBefore(this.selectedEndWeek) && moment(date).isAfter(this.selectedStartWeek)
    //   || moment(date.format('YYYY-MM-DD')).isSame(this.selectedStartWeek.format('YYYY-MM-DD'))
    //   || moment(date.format('YYYY-MM-DD')).isSame(this.selectedEndWeek.format('YYYY-MM-DD'));
  }
  public isBeforeCurrentDate(date) {
    const today = new Date(moment().format('MM-DD-YYYY'));
    console.log(today, new Date(date))
    if (today <= new Date(date)) {
      return true;
    } else {
      return false
    }
  }
  public selectDate(date: CalendarDate) {
    if (moment(date.mDate) < this.tourStartDate) {
      return;
    }
    this.selectedDate = moment(date.mDate);
    if (!this.isMonthlyVacantReportPage) {
      this.show = !this.show;
    }
    date.selected = true;
    if (this.isTourViewPage) {
      this.data.changeTourSelectedDateMessage(date);
    }
    if (this.isMonthlyVacantReportPage) {
      this.data.changeMonthlyVacantReportSelectedDateMessage(date);
    }
    this.generateCalendar();
  }

  public isDayBeforeLastSat(date: moment.Moment): boolean {
    const lastSat = moment().weekday(-1);
    return moment(date).isSameOrBefore(lastSat);
  }
  onClick(value) {
    this.show = !value;
    console.log("test")
  }

  /**
     * This method is use to get popular tour
     */
  getDayWisePrice(date) {
    this.isFilterTourFound = false;
    this.filterTourListBlockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/tour/tour-price-search?id=` + this.activatedRoute.snapshot.params.id + `&month=` + (date.getMonth() + 1) + `&year=` + date.getFullYear()).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.dayWisePriceList = response['list'];
        this.generateCalendar();
      } else if (response['code'] == 2006) {
        this.dayWisePriceList = [];
        this.generateCalendar();
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.isFilterTourFound = true;
      this.filterTourListBlockUI.stop();
    }, err => {
      this.isFilterTourFound = true;
      this.filterTourListBlockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }
}
