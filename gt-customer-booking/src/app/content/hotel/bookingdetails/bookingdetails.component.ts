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
  isPendingBooking: boolean = null;
  paid: any = [];
  constructor(view: any = {}) {
    this.referenceNumber = view.referenceNumber;
    this.startDateSearch = view.startDateSearch;
    this.endDateSearch = view.endDateSearch;
    this.paid = view.paid;
    this.isPendingBooking = view.isPendingBooking;
  }
}
class genderView {
  public key: string = '';
  public value: string = '';
  constructor(view: any = {}) {
    this.key = view.key;
    this.value = view.value;
  }
}
class guestInformation {
  public name: string = '';
  public gender: genderView = new genderView();
  public age: string = '';
  public seniorCitizen: boolean = null;
  public totalAdult: number = 0;
  public totalChildren: number = 0;
  public totalAdultList: any = [];
  public totalChildrenList: any = [];
  public childAge: any = [];
  constructor(view: any = {}) {
    this.name = view.name;
    this.gender = view.gender;
    this.age = view.age;
    this.seniorCitizen = view.seniorCitizen;
    this.totalAdult = view.totalAdult;
    this.totalChildren = view.totalChildren;
    this.totalAdultList = view.totalAdultList;
    this.totalChildrenList = view.totalChildrenList;
    this.childAge = view.childAge;
  }
}
@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.component.html',
  styleUrls: ['./bookingdetails.component.scss']
})
export class BookingdetailsComponent implements OnInit {
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
  guestForm: any;
  bookingModel: any = {};
  accordionId = '';
  subAccordionId = '';
  isFormSubmitted: boolean = false;
  guestInformationViews = [];
  genderList = [{ key: 1, value: 'Male' }, { key: 2, value: 'Female' }];
  remarks:string= '';
  bookingOfficer = false;
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
      paid: [[], []]
    });

    this.guestForm = this.formBuilder.group({
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
    this.http.get(`${AppConfigConstants.baseUrl}private/hotel-booking/dropdown-booking-status`).subscribe(response => {
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
    this.searchModel.isPendingBooking = true;
    this.isBookingDetalisFound = false;
    this.bookingDivBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/hotel-booking/customer-bookings?start=` + start + "&recordSize=" + record, this.searchModel).subscribe(response => {
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
    return this.http.post(`${AppConfigConstants.baseUrl}private/hotel-booking/booking-cancel-calculation?referenceNumber=`, { referenceNumber: data.referenceNumber })
      .subscribe(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
          this.router.navigate(['/' + AppUrlConstants.cancelPaymentTempDetails + '/' + data.referenceNumber]);
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
      this.router.navigateByUrl(AppUrlConstants.cancelBookingTempDetails + bookingDetails.referenceNumber);
    }
    if (bookingDetails.paid != undefined && bookingDetails.paid.key == 2) {
      this.router.navigateByUrl(AppUrlConstants.successPaymentModule + bookingDetails.referenceNumber);
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
  public hotelDropdownList = [];

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
                  'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                  'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
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
                  'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                  'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
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
      this.toastr.error('Please Enter Destination', 'Error !');
    }

  }
  onSelect(item: any) {
    this.selectedHotel = item;
    if (this.isDestinationSelected) {
      document.getElementById("datePicker").click();
    }
    this.isDestinationSelected = true;
  }
  onInputChangedEvent(val: string) {

    this.inputChanged = val;
    if (val != '') {
      // this.blockUI.start();
      this.http.get(`${AppConfigConstants.baseUrl}private/hotel/search-hotel-param?searchParam=` + val).subscribe(response => {
        // this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.hotelDropdownList = response['list'];
        } else if (response['code'] == 2006) {

        } else {
          this.toastr.error(response['message'], 'Error !');
        }
      }, err => {
        this.toastr.error(err['message'], 'Error !');
      });
    }
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

  updateBooking(booking) {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/hotel-booking/view-booking-information?referenceNumber=` + booking.referenceNumber).subscribe(response => {
     
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.bookingModel = response['view'];
        this.bookingModel.roomBookingViews.forEach(element => {
          let guestInformationViews = []
          let tempGuestInformationViews = [];
          for (let i = 0; i < element.rooms; i++) {
            tempGuestInformationViews.push({ room: i + 1, guestInfo: [] })
          }
          element.guestInformationViews.forEach(element => {
            tempGuestInformationViews.forEach(roomWise => {
              if (element.room == roomWise.room) {
                roomWise.guestInfo.push(element);
              }
            });
          });
          var guestInfo = {};
          element.guestInformationViews = [];
          tempGuestInformationViews.forEach(roomWise => {
            guestInfo = roomWise.guestInfo[0];
            var otherInfo = [];
            for (let i = 1; i < roomWise.guestInfo.length; i++) {
              otherInfo.push(roomWise.guestInfo[i]);
            }
            if (otherInfo.length != 0) {
              roomWise.guestInfo[0].otherGuestInformationViews = otherInfo;
            }
           
            element.guestInformationViews.push(roomWise.guestInfo[0]);
          });
        });
                this.accordionId = this.bookingModel.roomBookingViews[0].id + '0'

        document.getElementById("guestInfo").style.width = "100%";
      } else if (response['code'] == 2006) {
        this.bookingModel = null;
      } else {
        //   this.hotelList = [];
        
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });

  }

  /**
 * This method is use to log user
 * @param formId 
 */
  onSave(formId) {
    this.bookingModel.remarksForUpdate = this.remarks;
    this.bookingModel.roomBookingViews.forEach(element => {
      let guestInformationViews = [];
      element.guestInformationViews.forEach(info => {
       if(info.otherGuestInformationViews){
        info.otherGuestInformationViews.forEach(other => {
          element.guestInformationViews.push(other);
        });
       }
      });
    });
    const body = JSON.stringify(this.bookingModel);
    this.loginBtnBlockUI.start();
    this.http.put(`${AppConfigConstants.baseUrl}private/hotel-booking/update-guest-information`, this.bookingModel).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.toastr.success(response['message'], 'Success !');
        this.closeGuest();
        this.loginBtnBlockUI.stop();
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.loginBtnBlockUI.stop();
    }, err => {
      this.loginBtnBlockUI.stop();
    });

  }

  closeGuest() {
    document.getElementById("guestInfo").style.width = "0%";
  }

  get l() { return this.guestForm.controls; }


  getGuestInformationViews(totalMember) {
    this.guestInformationViews = [];
    for (let i = 0; i < totalMember; i++) {
      this.guestInformationViews.push(new guestInformation());
    }
    return this.guestInformationViews;
  }
  setAccordionId(id) {
    this.accordionId = id;
  }
  beforeChange(event) {
    this.accordionId = event.panelId;
  }
  setNextAccordionId(roomView, i) {
    this.accordionId = this.bookingModel.roomBookingViews[0].id + '0';
    if (roomView.rooms == (i + 1)) {
      this.bookingModel.roomBookingViews.forEach((element, key) => {
        if (element == roomView) {
          this.accordionId = this.bookingModel.roomBookingViews[key + 1].id + '' + 0;
        }
      });
    } else {
      this.accordionId = roomView.id + '' + (i + 1);
    }
    console.log(this.bookingModel.roomBookingViews)
    // this.accordionId = i;
  }
  checkMandatoryError(data) {
    if (data != '' && data != undefined) { return false } else if (data == false) { return false } else { return true }
  }
  checkMaxLengthError(data, length) {
    if (data != '' && data != undefined && data.length > length) { return true } else { return false }
  }
  checkRegexError(data, regexName) {
    var regex = /^[a-zA-Z .]+$/;
    if (regexName == 'ALPHABETS_WITH_SPACE') {
      regex = /^[a-zA-Z ]+$/;
    } else if (regexName == 'Email') {
      regex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    } else if (regexName == 'PHONE_NUMBER') {
      regex = /^((\\+[1-9]?[0-9])|0)?[1-9][0-9]{9}$/;
    }
    if (data != '' && data != undefined && regex.test(data)) { return false } else if (data == '' || data == undefined) { return false } else { return true }
  }
  checkValidation(data) {
    // this.accordionId = 'testets1';
    var totalError = 0;
    data.forEach(element => {
      element.guestInformationViews.forEach(guestInformation => {
        if (this.checkMandatoryError(guestInformation.name) || this.checkMandatoryError(guestInformation.email) || this.checkMandatoryError(guestInformation.mobile) || this.checkMandatoryError(guestInformation.gender) || this.checkMandatoryError(guestInformation.age) || this.checkMandatoryError(guestInformation.totalAdult) || this.checkMandatoryError(guestInformation.totalChildren) || this.checkMandatoryError(guestInformation.seniorCitizen)) {
          totalError++;
        }
        if (this.checkMaxLengthError(guestInformation.name, 100) || this.checkMaxLengthError(guestInformation.email, 100) || this.checkMaxLengthError(guestInformation.mobile, 15)) {
          totalError++;
        }
        if (this.checkRegexError(guestInformation.name, 'ALPHABETS_WITH_SPACE') || this.checkRegexError(guestInformation.email, 'Email') || this.checkRegexError(guestInformation.mobile, 'PHONE_NUMBER')) {
          totalError++;
        }
        if (guestInformation.childAge != undefined) {
          guestInformation.childAge.forEach(childAgeElement => {
            if (this.checkMandatoryError(childAgeElement)) {
              totalError++;
            }
          });
        }
        // if (guestInformation.otherGuestInformationViews != undefined) {
        //   guestInformation.otherGuestInformationViews.forEach(otherGuestInformation => {
        //     if (this.checkMandatoryError(otherGuestInformation.name) || this.checkMandatoryError(otherGuestInformation.email) || this.checkMandatoryError(otherGuestInformation.mobile) || this.checkMandatoryError(otherGuestInformation.gender) || this.checkMandatoryError(otherGuestInformation.age) || this.checkMandatoryError(otherGuestInformation.totalAdult) || this.checkMandatoryError(otherGuestInformation.totalChildren) || this.checkMandatoryError(otherGuestInformation.seniorCitizen)) {
        //       totalError++;
        //     }
        //     if (this.checkMaxLengthError(otherGuestInformation.name, 100) || this.checkMaxLengthError(otherGuestInformation.email, 100) || this.checkMaxLengthError(otherGuestInformation.mobile, 15)) {
        //       totalError++;
        //     }
        //     if (this.checkRegexError(otherGuestInformation.name, 'ALPHABETS_WITH_SPACE') || this.checkRegexError(otherGuestInformation.email, 'Email') || this.checkRegexError(otherGuestInformation.mobile, 'PHONE_NUMBER')) {
        //       totalError++;
        //     }
        //   });
        // }
      });
    });
    if (totalError == 0) {
      return false;
    } else {
      return true;
    }
  }
}
