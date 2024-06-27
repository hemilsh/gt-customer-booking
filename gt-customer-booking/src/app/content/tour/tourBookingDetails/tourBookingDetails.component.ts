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
class Booking {
  referenceNumber: String = '';
  startDateSearch: String = '';
  endDateSearch: String = '';
  status: any = [];
  constructor(view: any = {}) {
    this.referenceNumber = view.referenceNumber;
    this.startDateSearch = view.startDateSearch;
    this.endDateSearch = view.endDateSearch;
    this.status = view.status;
  }
}
@Component({
  selector: 'app-tourBookingDetails',
  templateUrl: './tourBookingDetails.component.html',
  styleUrls: ['./tourBookingDetails.component.scss']
})
export class TourBookingDetailsComponent implements OnInit {
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
  searchModel: Booking = new Booking();
  p: number = 1;
  searchHotelPlaceHolder = "Enter City/Hotel/Area/";
  keyword = 'name';
  isDestinationSelected = false;
  startDate;
  endDate;
  startDateSearch;
  endDateSearch;
  public eventLog = '';
  public adultMaxRooms;
  public childrenMaxRooms;
  public maxGuest;
  roomValue = 1;
  seatValue = 1;
  adultsValue = 2;
  childrenValue = 0;
  cityId;
  landmark;
  area;
  inputChanged: any = '';
  public roomsAndGuestsList: any = [
    {
      id: 1, adultsValue: 2, childrenValue: 0, childrenAgeList: []
    }
  ];
  displaySeletedHotel = { id: '', name: '', type: {}, total: 0 }
  selectedHotel: any = {};
  config2: any = { 'class': 'test', 'max': 10, 'placeholder': 'Where are you going?', 'sourceField': ['name'] };
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
      status: [[], []]
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
    var interval = setInterval(function () {
      $('.daterangepicker.dropdown-menu').addClass('right-align-date-range-picker-menu');
      $('.daterangepicker.dropdown-menu').removeClass('date-range-picker-menu');
      if ($('.daterangepicker.dropdown-menu') != null) {
        clearInterval(interval);
      }
    }, 500);
    this.getBookingStatus();
    this.loadMaxRoom();
    this.startDate = moment().add(1, 'day');
    this.endDate = moment().add(2, 'day');
    // this.startDateSearch = moment().add(1, 'day');
    // this.endDateSearch = moment().add(2, 'day');
  }
  getBookingStatus() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/hotel-booking/dropdown-booking-status`).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.bookingStatusList = response['list'];
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

  onChangeStatus(key) {
    this.bookingStatusList.forEach(element => {
      if(element.key == key){
        this.statusViews[key] = true;
      }else{
        this.statusViews[element.key] = false;
        // document.getElementById("statusId"+element.key).checked = false;
      }
    });
    // document.getElementById("statusId"+key).checked = true;
    this.onSubmit('searchUsingNumber', 0, this.totalItemDisplay);
  }

  onSubmit(formId, start, record) {
    this.isFilterFormSubmitted = true;
    if (this.searchUsingNumber.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    if (this.searchModel.referenceNumber != undefined) {
      this.isSearchUsingNumber = true;
    }
    // if(this.searchModel.status != undefined){
    this.statusViews.forEach((val: any, key: any) => {
      if (val) {
        let tempView: any = this.bookingStatusList.find(j => j.key === key)
        this.searchModel.status = tempView;
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
    this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/customer-bookings?start=` + start + "&recordSize=" + record, this.searchModel).subscribe(response => {
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
    delete this.searchModel.status;
    this.statusViews = [];
    this.isFilterFormSubmitted = false;
    this.isSearchUsingStatus = false;
    this.onSubmit('searchUsingNumber', 0, 10);
  }
  openStatusList() {
    // this.statusViews = [];
  }
  goToPaymentRecipt(bookingDetails) {
    if (bookingDetails.status != undefined && bookingDetails.status.key == 2) {
      this.router.navigateByUrl(AppUrlConstants.tourModule + AppUrlConstants.successPaymentModule + bookingDetails.referenceNumber);
    }
    if(bookingDetails.status != undefined &&  bookingDetails.status.key == 4){
      this.router.navigateByUrl(AppUrlConstants.tourModule + AppUrlConstants.tourCancelBookingTempDetails + bookingDetails.referenceNumber);
    }
    // else if (bookingDetails.status != undefined && bookingDetails.status.key == 1) { 
    //   this.router.navigateByUrl(AppUrlConstants.successPaymentModule + bookingDetails.referenceNumber);
    // }
  }
  onFullTourCancellation(bookingDetails) {
    this.blockUI.start();
    return this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/booking-cancel-calculation?referenceNumber=`, { referenceNumber: bookingDetails.referenceNumber })
      .subscribe(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
          this.router.navigate(['/' + AppUrlConstants.tourModule + '/' + AppUrlConstants.cancellationModule + bookingDetails.referenceNumber]);
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      });
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
     * This method is use to change value of adults
     * @param isPluseOrMinus 
     */
  changeAdults(roomAndGuest, isPluseOrMinus) {
    this.roomsAndGuestsList.forEach(element => {
      if (element.id == roomAndGuest.id) {
        if (isPluseOrMinus == 0) {
          element.adultsValue -= 1
        } else if (isPluseOrMinus == 1) {
          element.adultsValue += 1
        }
      }
    });
  }

  /**
   * This method is use to change value of children
   * @param isPluseOrMinus 
   */
  changeChildren(roomAndGuest, isPluseOrMinus) {
    this.roomsAndGuestsList.forEach(element => {
      if (element.id == roomAndGuest.id) {
        if (isPluseOrMinus == 0) {
          element.childrenValue -= 1
          element.childrenAgeList.splice((element.childrenAgeList.length - 1), 1);
        } else if (isPluseOrMinus == 1) {
          element.childrenValue += 1
          element.childrenAgeList.push({ childrenAge: { key: 8, value: 8 } });
        }
      }
      // element.childrenAgeList = [];
      // for (let i = 0; i < element.childrenValue; i++) {

      // }
    });
  }

  /**
     * This method is use to get max value of room, adults and childrens
     */
  loadMaxRoom() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-configuration`).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        let minDate = '';
        let maxDate = '';
        for (let j = 0; j < response['list'].length; j++) {
          if (response['list'][j].key == 'MAX_ALLOWED_ADULTS_PER_ROOM') {
            this.adultMaxRooms = response['list'][j].value;
          }
          if (response['list'][j].key == 'MAX_ALLOWED_CHILDREN_PER_ROOM') {
            this.childrenMaxRooms = response['list'][j].value;
          }
          if (response['list'][j].key == 'MAX_ALLOWED_GUEST_PER_ROOM') {
            this.maxGuest = response['list'][j].value;
          }
          if (response['list'][j].key == 'HOTEL_SEARCH_START_DATE') {
            minDate = response['list'][j].value
          }
          if (response['list'][j].key == 'HOTEL_SEARCH_END_DATE') {
            maxDate = response['list'][j].value;
          }
        }
        if (maxDate != '' && minDate != '') {
          this.daterangepickerOptions.maxDate = new Date(maxDate)
          this.daterangepickerOptions.minDate = new Date(minDate)
        }
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }


  /**
   * This method is use to change value of adults
   * @param isPluseOrMinus 
   */
  // changeAdults(isPluseOrMinus) {
  //     if (isPluseOrMinus == 0) {
  //         this.adultsValue -= 1
  //     } else if (isPluseOrMinus == 1) {
  //         this.adultsValue += 1
  //     }
  // }

  // /**
  //  * This method is use to change value of children
  //  * @param isPluseOrMinus 
  //  */
  // changeChildren(isPluseOrMinus) {
  //     if (isPluseOrMinus == 0) {
  //         this.childrenValue -= 1
  //     } else if (isPluseOrMinus == 1) {
  //         this.childrenValue += 1
  //     }
  // }


  /**
    * This section is use to check availability of hotel.
    */
  checkAvailability() {
    if (this.selectedHotel.type != undefined) {
      if (this.selectedHotel.type.key == 1) {
        this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + this.selectedHotel.id],
          {
            queryParams: {
              'destination': this.selectedHotel.name,
              'check-in-date': moment(this.startDate).format('YYYY/MM/DD'),
              'check-out-date': moment(this.endDate).format('YYYY/MM/DD'),
              'rooms': this.roomValue,
              'adults': this.adultsValue,
              'children': this.childrenValue
            }
          });
      } else {
        var cityView = null;
        var landmark = null;
        var area = null;
        if (this.selectedHotel.type.key == 2) {
          cityView = {
            "key": this.selectedHotel.id
          };
        }
        if (this.selectedHotel.type.key == 3) {
          landmark = this.selectedHotel.name;
        }
        if (this.selectedHotel.type.key == 4) {
          area = this.selectedHotel.name;
        }
        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}private/hotel/search-hotel?start=0&recordSize=10`, {
          cityView: cityView,
          landmark: landmark,
          area: area,
          startDate: moment(this.startDate).format('DD/MM/YYYY'),
          endDate: moment(this.endDate).format('DD/MM/YYYY'),
          numberOfRoom: this.roomValue,
          numberOfAdults: this.adultsValue,
          numberOfChildren: this.childrenValue,
        }).subscribe(response => {
          this.blockUI.stop();
          if (response['code'] >= 1000 && response['code'] < 2000) {
            // this.hotelList = response['list'];
            if (this.selectedHotel.type.key == 2) {
              this.cityId = this.selectedHotel.id;
            }
            if (this.selectedHotel.type.key == 3) {
              this.landmark = this.selectedHotel.name;
            }
            if (this.selectedHotel.type.key == 4) {
              this.area = this.selectedHotel.name;
            }
            this.router.navigate(['/' + AppUrlConstants.hotelModule],
              {
                queryParams: {
                  'destination': this.selectedHotel.name,
                  'checkindate': moment(this.startDate).format('DD/MM/YYYY'),
                  'checkoutdate': moment(this.endDate).format('DD/MM/YYYY'),
                  'rooms': this.roomValue,
                  'adults': this.adultsValue,
                  'children': this.childrenValue,
                  'cityView': this.cityId,
                  'landmark': this.landmark,
                  'area': this.area
                }
              });
          } else if (response['code'] == 2006) {
            if (this.selectedHotel.type.key == 2) {
              this.cityId = this.selectedHotel.id;
            }
            if (this.selectedHotel.type.key == 3) {
              this.landmark = this.selectedHotel.name;
            }
            if (this.selectedHotel.type.key == 4) {
              this.area = this.selectedHotel.name;
            }
            this.router.navigate(['/' + AppUrlConstants.hotelModule],
              {
                queryParams: {
                  'destination': this.selectedHotel.name,
                  'checkindate': moment(this.startDate).format('DD/MM/YYYY'),
                  'checkoutdate': moment(this.endDate).format('DD/MM/YYYY'),
                  'rooms': this.roomValue,
                  'adults': this.adultsValue,
                  'children': this.childrenValue,
                  'cityView': this.cityId,
                  'landmark': this.landmark,
                  'area': this.area
                }
              });
            // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
            // this.hotelList = [];
          } else {
            this.toastr.error(response['message'], 'Error !');
          }
        }, err => {
          this.toastr.error(err['message'], 'Error !');
        });
      }
    } else {
      this.toastr.error("Please Enter Destination", 'Error !');
    }

  }
  onSelect(item: any) {
    this.selectedHotel = item;
    if (this.isDestinationSelected) {
      document.getElementById("datePicker").click();
    }
    this.isDestinationSelected = true;
  }
  /**
     * This method is use to add room
     */
  addRoom() {
    let json: any = {}
    json.id = this.roomsAndGuestsList.length + 1; json.adultsValue = 1; json.childrenValue = 0; json.childrenAgeList = [];
    this.roomsAndGuestsList.push(json)
  }
  /**
   * This method is use to remove room
   */
  removeRoom(json) {
    if (this.roomsAndGuestsList.length == 1) {
      return
    }
    let list = [];
    this.roomsAndGuestsList.forEach(element => {
      if (element.id != json.id) {
        list.push(element)
      }
    });
    this.roomsAndGuestsList = list
  }
  /**
   * This method is use to scroll to given id
   * @param id 
   */
  scrollTo(id) {
    // this.vps.scrollToAnchor(id);
    $('#' + id).scrollTop(0);
  }
  /**
   * This method is use to update Room And Guest
   */
  onAddRoomAndGuest() {
    localStorage.setItem('roomsAndGuestsInfo', JSON.stringify(this.roomsAndGuestsList));
    document.getElementById('closeModel').click();
  }
  goToHome() {
    this.router.navigate([AppUrlConstants.home]);
  }
}
