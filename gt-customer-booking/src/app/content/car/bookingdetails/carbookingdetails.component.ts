import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { HttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/_services/data.service';
declare var moment: any;
import * as $ from 'jquery';
import { CarBookingModel } from '../car-booking.class';
@Component({
  selector: 'app-car-booking-details',
  templateUrl: './carbookingdetails.component.html',
  styleUrls: ['./carbookingdetails.component.scss']
})
export class CarBookingDetailsComponent implements OnInit {
  @BlockUI('loginBtn') loginBtnBlockUI: NgBlockUI
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('bookingDiv') bookingDivBlockUI: NgBlockUI
  isBookingDetalisFound = true;
  isSearchUsingNumber = false;
  isSearchUsingStatus = false;
  isFilterFormSubmitted = false;
  bookingList = [];
  statusViews = [];
  bookingStatusList = [];
  bookingRecords = 0;
  start = 0;
  totalItemDisplay = 10;
  pageSize = 100;
  searchUsingNumber: any;
  searchModel: CarBookingModel = new CarBookingModel();
  p: number = 1;
  keyword = 'name';
  startDate;
  endDate;
  startDateSearch;
  endDateSearch;
  bookingOfficer = false;
  eventLog;
  public dateInputs: any = [
    {
      start: moment().subtract(12, 'month'),
      end: moment().subtract(6, 'month')
    },
    {
      start: moment().subtract(9, 'month'),
      end: moment().subtract(6, 'month')
    },
    {
      start: moment().subtract(4, 'month'),
      end: moment()
    },
    {
      start: moment(),
      end: moment().add(5, 'month'),
    }
  ];
  public mainInput = {
    start: moment().add(1, 'day'),
    end: moment().add(2, 'day')
    // start: moment().subtract(12, 'month'),
    // end: moment().subtract(6, 'month')
  }
  public filterInput = {
    start: moment(),
    end: moment()
    // start: moment().subtract(12, 'month'),
    // end: moment().subtract(6, 'month')
  }

  public singlePicker = {
    singleDatePicker: true,
    showDropdowns: true,
    opens: "left"
  }

  public singleDate: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private vps: ViewportScroller,
    private router: Router,
    private data: DataService) {
    this.searchUsingNumber = this.formBuilder.group({
      referenceNumber: ['', []],
      paid: [[], []]
    });

    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.bookingList = this.route.snapshot.data['resolveValue']['list'];
        this.bookingRecords = this.route.snapshot.data['resolveValue']['records'];
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.bookingList = [];
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
  }
  get f() { return this.searchUsingNumber.controls; }
  ngOnInit() {
    if (localStorage.getItem('currentCustomerUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentCustomerUser'));
      let bookingOfficer = false;
      currentUser.roleViews.forEach(function (roleKey, roleValue) {
        if (roleKey.type.key == 7) {
          bookingOfficer = true;
        }
      });
      this.bookingOfficer = bookingOfficer;
    }
    var interval = setInterval(function () {
      $('.daterangepicker.dropdown-menu').addClass('right-align-date-range-picker-menu');
      $('.daterangepicker.dropdown-menu').removeClass('date-range-picker-menu');
      if ($('.daterangepicker.dropdown-menu') != null) {
        clearInterval(interval);
      }
    }, 500);
    this.getBookingStatus();
  }
  ngOnDestroy() {
    // $('.daterangepicker.dropdown-menu').removeClass('right-align-date-range-picker-menu');
    // this.subscription.unsubscribe();
  }
  getBookingStatus() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/car-booking/dropdown-booking-status`).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.bookingStatusList = [];
        response['list'].forEach(element => {
          if (element.key != 1) {
            this.bookingStatusList.push(element);
          }
        });
      } else if (response['code'] == 2006) {
        this.bookingStatusList = [];
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  onSubmit(formId, start, record) {
    this.p = 1
    this.isFilterFormSubmitted = true;
    if (this.searchUsingNumber.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    if (this.searchModel.referenceNumber != undefined) {
      this.isSearchUsingNumber = true;
    }
    // if(this.searchModel.paid != undefined){
    this.statusViews.forEach((val: any, key: any) => {
      if (val) {
        let tempView: any = this.bookingStatusList.find(j => j.key === key)
        this.searchModel.paid = tempView;
        this.isSearchUsingStatus = true;
      }
    });
    if (this.startDateSearch != undefined && this.endDateSearch != undefined) {
      this.searchModel.startDateSearch = moment(this.startDateSearch).add(1, 'day');
      this.searchModel.endDateSearch = this.endDateSearch;
    }
    // }
    this.isBookingDetalisFound = false;
    this.bookingDivBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/customer-bookings?start=` + start + "&recordSize=" + record, this.searchModel).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.bookingList = response['list'];
        this.bookingRecords = response['records'];
      } else if (response['code'] == 2006) {
        this.bookingList = [];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.isBookingDetalisFound = true
      this.bookingDivBlockUI.stop();
    }, err => {
      this.bookingDivBlockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }
  cancelBooking(data) {
    this.blockUI.start();
    return this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/booking-cancel-calculation?referenceNumber=`, { referenceNumber: data.referenceNumber })
      .subscribe(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
          this.router.navigate(['/' + AppUrlConstants.carCancelBookingTempDetails + '/' + data.referenceNumber]);
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      });
  }


  removeFilter() {
    this.isFilterFormSubmitted = false;
    this.isSearchUsingNumber = false;
    delete this.searchModel.referenceNumber;
    this.onSubmit('searchUsingNumber', 0, 10);
  }
  removeDateFilter() {
    delete this.startDateSearch;
    delete this.endDateSearch;
    delete this.searchModel.startDateSearch;
    delete this.searchModel.endDateSearch;
    this.onSubmit('searchUsingNumber', 0, 10);
  }
  removeStatusFilter() {
    delete this.searchModel.paid;
    this.statusViews = [];
    this.isFilterFormSubmitted = false;
    this.isSearchUsingStatus = false;
    this.onSubmit('searchUsingNumber', 0, 10);
  }
  openStatusList() {
    // this.statusViews = [];
  }
  onChangeStatus(key) {
    this.bookingStatusList.forEach(element => {
      if (element.key == key) {
        this.statusViews[key] = true;
      } else {
        this.statusViews[element.key] = false;
        // document.getElementById("statusId"+element.key).checked = false;
      }
    });
    // document.getElementById("statusId"+key).checked = true;
    this.onSubmit('searchUsingNumber', 0, this.totalItemDisplay);
  }
  goToPaymentRecipt(bookingDetails) {
    if (bookingDetails.paid != undefined && bookingDetails.paid.key == 4) {
      this.router.navigate(["/" + AppUrlConstants.carCancelBookingTempDetails + bookingDetails.referenceNumber]);
    }
    if (bookingDetails.paid != undefined && bookingDetails.paid.key == 2) {
      this.router.navigate(["/" + AppUrlConstants.carModule + "/" + AppUrlConstants.carSuccessPaymentModule + bookingDetails.referenceNumber]);
    }
  }

  pageChanged(value) {
    this.p = value;
    this.start = value - 1;
    this.onSubmit('searchUsingNumber', this.totalItemDisplay * (value - 1), this.totalItemDisplay);
  }
  /**
     * this section is use for auto complete
     */

  public daterangepickerOptions = {
    startDate: moment().add(1, 'day'),
    endDate: moment().add(2, 'day'),
    maxDate: new Date(),
    minDate: new Date(),
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };
  public searchDateRangePickerOptions = {
    startDate: moment(),
    endDate: moment(),
  };
  public selectedDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    this.startDate = value.start;
    dateInput.end = value.end;
    this.endDate = value.end;
  }
  public selectedFilterDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    this.startDateSearch = value.start;
    dateInput.end = value.end;
    this.endDateSearch = value.end;
  }
  private applyDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    this.startDate = value.start;
    dateInput.end = value.end;
    this.endDate = value.end;
  }
  public calendarEventsHandler(e: any) {
    this.eventLog += '\nEvent Fired: ' + e.event.type;
    if (e.event.type == 'apply') {
      document.getElementById("dropdownMenuButton").click();
    }
    console.log(e)
  }
  public calendarFilterEventsHandler(e: any) {
    this.eventLog += '\nEvent Fired: ' + e.event.type;
    if (e.event.type == 'apply') {
      this.startDateSearch = e.picker.startDate;
      this.endDateSearch = e.picker.endDate;
      this.onSubmit(null, 0, this.totalItemDisplay);
    }
    console.log(e)
  }
  /**
   * This method is use to scroll to given id
   * @param id 
   */
  scrollTo(id) {
    // this.vps.scrollToAnchor(id);
    $('#' + id).scrollTop(0);
  }
  goToHome() {
    this.router.navigate([AppUrlConstants.home]);
  }
}
