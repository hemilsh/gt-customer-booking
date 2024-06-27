import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgImageSliderComponent } from 'ng-image-slider';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, NgForm } from '@angular/forms';
import { HeaderComponent } from 'src/app/_layout/header/header.component';
import { SharedService } from 'src/app/_services/share.services';
import { ViewportScroller, DatePipe } from '@angular/common';
import { DataService } from 'src/app/_services/data.service';
import * as $ from 'jquery';
declare var moment: any;
class Hotel {
  public id: string = '';
  public name: string = '';
  public stateView: any = {};
  public stateName: string = '';
  public cityView: any = {};
  public cityName: string = '';
  public average: number = null;
  public totalRattings: string = '';
  public galleryFileViews: any = [];
  public description: string = '';
  public defaultHotelAmenitiesViews: any = [];
  public rules: string = '';
  public hotelRattingCountView: any = [];
  public hotelRattingAverageViews: any = {};
  public reviewRattingTypeViews: any = [];
  public isReviewGiven: boolean = null;
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
    this.stateView = view.stateView;
    this.stateName = view.stateName;
    this.cityView = view.cityView;
    this.cityName = view.cityName;
    this.average = view.average;
    this.totalRattings = view.totalRattings;
    this.galleryFileViews = view.galleryFileViews;
    this.description = view.description;
    this.defaultHotelAmenitiesViews = view.defaultHotelAmenitiesViews;
    this.rules = view.rules;
    this.hotelRattingCountView = view.hotelRattingCountView;
    this.hotelRattingAverageViews = view.hotelRattingAverageViews;
    this.reviewRattingTypeViews = view.reviewRattingTypeViews;
    this.isReviewGiven = view.isReviewGiven;

  }
}
class Review {
  public title: string = '';
  public content: string = '';
  public hotelRattingViews0: string = '';
  public hotelRattingViews1: string = '';
  public hotelRattingViews2: string = '';
  public hotelRattingViews3: string = '';
  public hotelRattingViews4: string = '';
  public hotelRattingViews5: string = '';
  public hotelRattingViews6: string = '';
  constructor(view: any = {}) {
    this.content = view.content;
    this.title = view.title;
    this.hotelRattingViews0 = view.hotelRattingViews0;
    this.hotelRattingViews1 = view.hotelRattingViews1;
    this.hotelRattingViews2 = view.hotelRattingViews2;
    this.hotelRattingViews3 = view.hotelRattingViews3;
    this.hotelRattingViews4 = view.hotelRattingViews4;
    this.hotelRattingViews5 = view.hotelRattingViews5;
    this.hotelRattingViews6 = view.hotelRattingViews6;

  }
}
class RattingList {
  public id: string = '';
  public name: string = '';
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
  }
}
@Component({
  selector: 'app-hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrls: ['./hotel-view.component.scss']
})
export class HotelViewComponent implements OnInit {
  keyword = 'name';
  hotelDropdownList = [];
  genderList = [{ key: 1, value: 1 }, { key: 2, value: 2 }, { key: 3, value: 3 }, { key: 4, value: 4 }, { key: 5, value: 5 }, { key: 6, value: 6 }, { key: 7, value: 7 }, { key: 8, value: 8 }, { key: 9, value: 9 }, { key: 10, value: 10 }, { key: 11, value: 11 }, { key: 12, value: 12 }, { key: 13, value: 13 }, { key: 14, value: 14 }, { key: 15, value: 15 }, { key: 16, value: 16 }, { key: 17, value: 17 }];
  searchHotelPlaceHolder = "Enter City/Hotel/Area/";
  currentSliderImage = 0;
  currentSliderActiveClass = false;
  slideIndex = 1;
  p: number = 1;
  collection: any[];
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('saveReviewBtn') saveReviewBtnBlockUI: NgBlockUI
  @BlockUI('checkAvailabilityBtn') checkAvailabilityBtnBlockUI: NgBlockUI
  @BlockUI('bookRoomBtn') bookRoomBtnBlockUI: NgBlockUI
  @ViewChild('review', { read: true, static: false }) floatingLabelForm: NgForm;
  hotel: Hotel = new Hotel();
  @ViewChild('nav', { static: false }) ds: NgImageSliderComponent;
  showSlider = true;
  roomValue = 1;
  rooms = 0;
  adultsValue = 2;
  childrenValue = 0;
  adultMaxRooms = 0;
  childrenMaxRooms = 0;
  sliderWidth: Number = 940;
  sliderImageWidth: Number = 250;
  sliderImageHeight: Number = 200;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = false;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Boolean = false;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 1;
  imageObject: any = [];
  imageList: any = [];
  reviewList: any = [];
  roomTypeList: any = [];
  hotelRattingViews: any = [];
  // reviewRattingTypeViews: RattingList = new RattingList();
  public roomsAndGuestsList: any = [
    {
      id: 1, adultsValue: 2, childrenValue: 0, childrenAgeList: []
    }
  ];
  selectedHotel: any = {};
  displaySeletedHotel = { id: '', name: '', type: {}, total: 0 }
  cityId;
  area;
  reviewRattingTypeViews: any = {};
  currentCustomerUser: any;
  startDate: any;
  endDate: any;
  saveReviewForm: any;
  isRoomTypeFound: any;
  items: any = [];
  message: string;
  reviewRecords = 0;
  pageSize = 10;
  start = 0;
  tentHotelFlag: false;
  isReviewSummited = false;
  isReviewGiven = false;
  tentHotel;
  reviewModel: Review = new Review();

  public singleDate: any;
  public eventLog = '';
  public imgUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelImage;
  public roomImgUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadRoomImage;
  public hotelAmenitiesImage = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelAmenitiesImage;
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
    start: moment().add(2, 'day'),
    end: moment().add(3, 'day')
    // start: moment().subtract(12, 'month'),
    // end: moment().subtract(6, 'month')
  }

  public singlePicker = {
    singleDatePicker: true,
    showDropdowns: true,
    opens: "left"
  }
  constructor(
    private route: ActivatedRoute,
    public daterangepickerOptions: DaterangepickerConfig,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private vps: ViewportScroller,
    private data: DataService
  ) {
    if (document.getElementById("myNav") != null) {
      document.getElementById("myNav").style.width = "0%";
    }
    this.saveReviewForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      hotelRattingViews0: [''],
      hotelRattingViews1: [''],
      hotelRattingViews2: [''],
      hotelRattingViews3: [''],
      hotelRattingViews4: [''],
      hotelRattingViews5: [''],
      hotelRattingViews6: ['']
    });
    this.daterangepickerOptions.settings = {
      startDate: moment().add(2, 'day'),
      endDate: moment().add(3, 'day'),
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      // ranges: {
      //    'Last Month': [moment().subtract(1, 'month'), moment()],
      //    'Last 3 Months': [moment().subtract(4, 'month'), moment()],
      //    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
      //    'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      // }
    };
    if (this.router['currentUrlTree'].queryParams['check-in-date'] != undefined) {
      this.startDate = moment(this.router['currentUrlTree'].queryParams['check-in-date'], 'YYYY/MM/DD');
      // this.daterangepickerOptions.settings.startDate = moment(this.router['currentUrlTree'].queryParams['check-in-date']);
      this.mainInput.start = moment(this.router['currentUrlTree'].queryParams['check-in-date'], 'YYYY/MM/DD');
    } else {
      this.startDate = moment().add(2, 'day');
      this.mainInput.start = moment().add(2, 'day');

    }

    // if (sharedService.getOption() != undefined) {
    //   this.currentCustomerUser = sharedService.getOption();
    // }
    if (this.router['currentUrlTree'].queryParams.tentHotel != undefined) {
      this.tentHotelFlag = this.router['currentUrlTree'].queryParams.tentHotel;
    }
    if (this.router['currentUrlTree'].queryParams['check-out-date'] != undefined) {
      this.endDate = moment(this.router['currentUrlTree'].queryParams['check-out-date'], 'YYYY/MM/DD');
      // this.daterangepickerOptions.settings.endDate = moment(this.router['currentUrlTree'].queryParams['check-out-date']);
      this.mainInput.end = moment(this.router['currentUrlTree'].queryParams['check-out-date'], 'YYYY/MM/DD');
    } else {
      this.endDate = moment().add(3, 'day');
      this.mainInput.end = moment().add(3, 'day');
    }
    if (this.router['currentUrlTree'].queryParams.rooms != undefined) {
      this.roomValue = parseInt(this.router['currentUrlTree'].queryParams.rooms);
    }
    if (this.router['currentUrlTree'].queryParams.adults != undefined) {
      this.adultsValue = parseInt(this.router['currentUrlTree'].queryParams.adults);
    }
    if (this.router['currentUrlTree'].queryParams.childern != undefined) {
      this.childrenValue = parseInt(this.router['currentUrlTree'].queryParams.childern);
    }
    if (localStorage.getItem('currentCustomerUser') != undefined) {
      this.currentCustomerUser = JSON.parse(localStorage.getItem('currentCustomerUser'));
    }
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.hotel = new Hotel(this.route.snapshot.data['resolveValue']['view']);
        this.selectedHotel = {
          id: this.hotel.id,
          name: this.hotel.name,
          total: 1,
          type: { value: "Hotel", key: 1 }
        };
        if (this.hotel['galleryFileViews'] != undefined) {
          for (var i = 0; i < this.hotel['galleryFileViews'].length; i++) {
            var object = {};
            object['image'] = this.imgUrl + this.hotel['galleryFileViews'][i].galleryFileView.fileId;
            object['thumbImage'] = this.imgUrl + this.hotel['galleryFileViews'][i].galleryFileView.fileId;
            object['title'] = this.hotel['galleryFileViews'][i].type;
            object['alt'] = this.hotel['galleryFileViews'][i].galleryFileView.name;
            this.imageObject.push(object);
          }
        } else {
          var object = {};
          object['image'] = 'assets/images/defaultImage.jpg';
          object['thumbImage'] = 'assets/images/defaultImage.jpg';
          object['title'] = '';
          object['alt'] = 'default';
          this.imageObject.push(object);
          this.imageObject.push(object);
          this.imageObject.push(object);
        }
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.hotel = new Hotel({});
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test test test tyes test tesrt tesrt tesrt tesrt ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test test test tyes test tesrt tesrt tesrt tesrt ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test ');


    this.singleDate = moment().add(1, 'day');
  }

  ngOnInit() {
    var interval = setInterval(function () {
      $('.daterangepicker.dropdown-menu').addClass('date-range-picker-menu');
      if ($('.daterangepicker.dropdown-menu') != null) {
        clearInterval(interval);
      }
    }, 500);
    if (localStorage.getItem('roomsAndGuestsInfo') != undefined && localStorage.getItem('roomsAndGuestsInfo') != null) {
      this.roomsAndGuestsList = JSON.parse(localStorage.getItem('roomsAndGuestsInfo'));
    } else {
      localStorage.setItem('roomsAndGuestsInfo', JSON.stringify(this.roomsAndGuestsList));
    }
    this.loadHotelList();
    this.loadMaxRoom();
    this.loadReviewList();
    // this.loadRoomTypeList();
    this.showSlides(this.slideIndex);
    this.data.currentMessage.subscribe(message => {
      if (message != '' && message != 'delete') {
        this.currentCustomerUser = message
      }
    });
    this.onCheckAvailability(false, null, null, false);

    if (this.router['currentUrlTree'].queryParams['goToReview'] != undefined && this.router['currentUrlTree'].queryParams['goToReview'] == 'true') {
      setTimeout(
        function () {
          $('html, body').animate({
            scrollTop: $("#reviewFormId").offset().top - 60
          }, 1000);
          //scrollToRoom('reviewFormId');
        }, 800);

    }
  }
  /**
  * This section is use to get hotel list.
  */

  loadHotelList() {
    // if (this.selectedHotel != null) {
    //   this.hotelDropdownList.push(this.selectedHotel);
    //   this.displaySeletedHotel = this.selectedHotel;
    // } else {
    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=10`, {
      fullTextSearch: ''
    }).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.hotelDropdownList = [];
        for (let i = 0; i < response['list'].length; i++) {
          if (this.route.snapshot.params.id == response['list'][i].id) {
            this.hotelDropdownList.push({ name: response['list'][i].name, id: response['list'][i].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 });
          }
        }
        for (let i = 0; i < response['list'].length; i++) {
          if (this.route.snapshot.params.id != response['list'][i].id) {
            this.hotelDropdownList.push({ name: response['list'][i].name, id: response['list'][i].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 });
          }
        }
        // this.selectedHotel = this.hotelDropdownList[0];
        // this.displaySeletedHotel = { name: response['list'][0].name, id: response['list'][0].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 };
      } else if (response['code'] == 2006) {
        this.hotelDropdownList = [];
        var length = this.hotelDropdownList.length;
        for (let i = 0; i < length; i++) {
          this.hotelDropdownList.splice(0, 1);
        }
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
    // }
  }
  openModal(images) {
    this.imageList = images.roomTypeGalleryViews;
    // this.imageList = this.hotel.galleryFileViews;
    document.getElementById("myModal").style.display = "block";
  }
  closeModal() {
    this.imageList = [];
    document.getElementById("myModal").style.display = "none";
  }


  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length != 0) {
      if (n > slides.length) { this.slideIndex = 1 }
      if (n < 1) { this.slideIndex = slides.length }
      if (i == undefined) {
      }
      for (i = 0; i < slides.length; i++) {
        slides[i]['style'].display = "none";
      }
      slides[this.slideIndex - 1]['style'].display = "block";
    }
    if (document.getElementById("mySlides1") != null) {
      document.getElementById("mySlides1").classList.remove("display-block");
    }
  }
  imageOnClick(index) {
    console.log('index', index);
  }

  arrowOnClick(event) {
    console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
    console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }

  /**
      * This method is use to show selected date
      * @param value 
      * @param dateInput 
      */
  public selectedDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    this.startDate = this.pipe.transform(value.start, 'yyyy-MM-ddT00:00:00') + ".000Z";
    dateInput.end = value.end;
    this.endDate = this.pipe.transform(value.end, 'yyyy-MM-ddT00:00:00') + ".000Z";
  }

  /**
   * This method is use to select single date
   * @param value 
   */
  private singleSelect(value: any) {
    this.singleDate = value.start;
  }

  /**
   * This method is use to apply date
   * @param value 
   * @param dateInput 
   */
  private applyDate(value: any, dateInput: any) {
    dateInput.start = value.start;
    dateInput.end = value.end;
  }

  public calendarEventsHandler(e: any) {
    console.log(e);
    this.eventLog += '\nEvent Fired: ' + e.event.type;
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
    document.getElementById('closeModel').click();
    localStorage.setItem('roomsAndGuestsInfo', JSON.stringify(this.roomsAndGuestsList));
  }

  /**
   * This method is use to get total amount
   */
  getRoomTypeCharges() {
    let total = 0;
    for (let i = 0; i < this.roomTypeList.length; i++)
      if (this.roomTypeList[i].rooms != 0 && this.roomTypeList[i].roomTypeChargesView != undefined) {
        total += parseFloat(this.roomTypeList[i].roomCharges);
      }
    return total;
  }
  /**
   * This method is use to change value of room
   * @param isPluseOrMinus 
   */
  changeBookRoom(isPluseOrMinus, index) {
    if (isPluseOrMinus == 0) {
      this.roomTypeList[index].rooms -= 1
      // this.rooms -= 1
    } else if (isPluseOrMinus == 1) {
      this.roomTypeList[index].rooms += 1
      // this.rooms += 1
    }
  }
  get review() { return this.saveReviewForm.controls; }
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
          if (response['list'][j].key == 'HOTEL_SEARCH_START_DATE') {
            minDate = response['list'][j].value
          }
          if (response['list'][j].key == 'HOTEL_SEARCH_END_DATE') {
            maxDate = response['list'][j].value;
          }
        }
        if (maxDate != '' && minDate != '') {
          this.daterangepickerOptions.settings = {
            startDate: this.startDate,
            endDate: this.endDate,
            maxDate: new Date(maxDate),
            minDate: new Date(minDate)
          };
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
     * This method is use to get max value of room, adults and childrens
     */
  onCheckAvailability(isScrollToRoom, id, isPluseOrMinus, typeNeed) {
    let json: any = {};
    json.hotelView = {};
    json.hotelView.id = this.hotel.id;
    json.startDate = this.pipe.transform(this.startDate, 'yyyy-MM-ddT00:00:00') + ".000Z";
    json.endDate = this.pipe.transform(this.endDate, 'yyyy-MM-ddT00:00:00') + ".000Z";
    json.totalRooms = this.roomsAndGuestsList.length;
    json.roomViews = [];
    json.roomBookingViews = [];

    if (typeNeed) {
      this.roomTypeList.forEach(element => {
        // if(element.rooms != undefined && element.rooms != 0){
        let tempJson: any = {};
        tempJson.roomTypeView = {};
        tempJson.roomTypeView.id = element.id;
        tempJson.rooms = element.rooms;
        json.roomBookingViews.push(tempJson);
        // }
      });
    }
    this.roomsAndGuestsList.forEach(element => {
      let tempJson: any = {};
      tempJson.adults = element.adultsValue;
      tempJson.children = element.childrenValue;
      json.roomViews.push(tempJson);
    });
    // this.isRoomTypeFound = false;
    // this.checkAvailabilityBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/hotel-booking/room-validation`, json).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        if (this.roomTypeList.length == 0) {
          this.roomTypeList = response['list'];
        }
        response['list'].forEach((element, key) => {
          if (this.roomTypeList.length != 0 && this.roomTypeList[key].id == element.id) {
            this.roomTypeList[key].maxGuestCapacity = element.maxGuestCapacity;
            this.roomTypeList[key].nights = element.nights;
            this.roomTypeList[key].name = element.name;
            this.roomTypeList[key].roomCharges = element.roomCharges;
            this.roomTypeList[key].roomTypeChargesView = element.roomTypeChargesView;
            this.roomTypeList[key].rooms = element.rooms;
            this.roomTypeList[key].totalAvailableRooms = element.totalAvailableRooms;
          }
          if (element.rooms == undefined) {
            element.rooms = 0;
          } else {
            element.rooms = element.rooms
          }
        });
        if (isScrollToRoom) {
          this.scrollToRoom('room-category');
        }
      } else {
        //   this.hotelList = [];
        if (id != undefined && isPluseOrMinus != undefined) {
          this.roomTypeList.forEach(element => {
            if (element.id == id) {
              if (isPluseOrMinus == 'pluse') {
                element.rooms = element.rooms - 1;
              } else if (isPluseOrMinus == 'minus') {
                element.rooms = element.rooms + 1;
              }
            }
          });
        }
        this.toastr.error(response['message'], 'Error !');
      }
      this.isRoomTypeFound = true;
      // this.checkAvailabilityBtnBlockUI.stop();
    }, err => {
      this.isRoomTypeFound = true;
      // this.checkAvailabilityBtnBlockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This method is use to get list of review.
   */
  loadRoomTypeList() {
    this.isRoomTypeFound = false;
    this.checkAvailabilityBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/room-type/search?start=0&recordSize=10`, { "hotelView": { "id": this.route.snapshot.params.id } }).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.roomTypeList = response['list'];
        for (let i = 0; i < response['list'].length; i++) {
          if (i == 0) {
            this.roomTypeList[i].rooms = 1;
          } else {
            this.roomTypeList[i].rooms = 0;
          }
        }
      } else if (response['code'] == 2006) {
        this.roomTypeList = [];
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
      this.checkAvailabilityBtnBlockUI.stop();
      this.isRoomTypeFound = true;
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This method is use to get list of review.
   */
  loadReviewList() {
    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/hotel/hotel-review-search?start=` + this.start + `&recordSize=` + this.pageSize, { "hotelView": { "id": this.route.snapshot.params.id } }).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.reviewList = response['list'];
        this.reviewList.forEach((vals: any) => {
          if (vals.userView.id === this.currentCustomerUser.id) {
            this.isReviewGiven = true;
          }
        });
        this.reviewRecords = response['records'];
      } else if (response['code'] == 2006) {
        this.reviewList = [];
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This method is use to save review.
   */
  onSubmitReview(formId) {
    this.isReviewSummited = true;
    if (this.saveReviewForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = (this.reviewModel);
    body['hotelView'] = {};
    body['hotelView'].id = this.route.snapshot.params.id;
    let temp = [];
    this.hotelRattingViews.forEach((vals: any, keys: any) => {
      if (vals) {
        temp.push({ reviewRattingTypeView: { id: keys }, value: vals })
      }
      // value.checked = parentChecked;
    });
    body['hotelRattingViews'] = temp;
    this.saveReviewBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/hotel/review`, body).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.toastr.success(response['message'], 'Success');
        this.isReviewSummited = false;
        this.reviewModel.title = null;
        this.reviewModel.content = null;
        this.reviewModel.hotelRattingViews0 = undefined;
        this.reviewModel.hotelRattingViews1 = undefined;
        this.reviewModel.hotelRattingViews2 = undefined;
        this.reviewModel.hotelRattingViews3 = undefined;
        this.reviewModel.hotelRattingViews4 = undefined;
        this.reviewModel.hotelRattingViews5 = undefined;
        this.reviewModel.hotelRattingViews6 = undefined;
        this.hotelRattingViews = [];
        this.loadReviewList();
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.saveReviewBtnBlockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }

  /**
   * This method is go to payment page.
   */
  pipe = new DatePipe('en-US');
  goToPayment() {
    if (localStorage.getItem('currentCustomerUser') == undefined || localStorage.getItem('currentCustomerUser') == null) {
      this.toastr.error('Please login for book the hotel', 'Error !');
      document.getElementById("login").style.width = "100%";
      return;
    }
    let json: any = {};
    if (this.route.snapshot.params.id != undefined) {
      json['hotelView'] = {};
      json['hotelView'].id = this.route.snapshot.params.id;
    }
    json['totalRooms'] = this.roomsAndGuestsList.length;
    // json['totalAdults'] = this.adultsValue;
    // json['totalChildren'] = this.childrenValue;
    json.roomViews = [];
    for (let j = 0; j < this.roomsAndGuestsList.length; j++) {
      let tempObject: any = {};
      tempObject.adults = this.roomsAndGuestsList[j].adultsValue;
      tempObject.children = this.roomsAndGuestsList[j].childrenValue;
      json.roomViews.push(tempObject);
    }
    if (this.startDate != undefined && this.endDate != undefined) {
      json['startDate'] = moment(this.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      json['endDate'] = moment(this.endDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    }
    json['roomBookingViews'] = [];
    for (let i = 0; i < this.roomTypeList.length; i++) {
      if (this.roomTypeList[i].rooms != 0 && this.roomTypeList[i].rooms != null && this.roomTypeList[i].rooms != undefined) {
        // && this.roomTypeList[i].rooms.key != undefined && this.roomTypeList[i].rooms.key != 0
        let tempJson: any = {};
        tempJson['rooms'] = this.roomTypeList[i].rooms;
        if (this.roomTypeList[i].rooms != undefined && this.roomTypeList[i].rooms.key != undefined) {
          tempJson['rooms'] = this.roomTypeList[i].rooms.key;
        }

        tempJson.roomTypeView = {};
        tempJson.roomTypeView.id = this.roomTypeList[i].id;
        tempJson['numberExtraBed'] = 0;
        json['roomBookingViews'].push(tempJson);
      }
    }
    this.bookRoomBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/hotel-booking/book`, json).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.toastr.success(response['message'], 'Success');
        this.router.navigateByUrl(AppUrlConstants.paymentTempModule + response['view'].referenceNumber);
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.bookRoomBtnBlockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }

  scrollToRoom(id) {
    this.vps.scrollToAnchor(id);
  }
  scrollToReview(id) {
    this.vps.scrollToAnchor(id);
  }
  pageChanged(page: number) {
    this.vps.scrollToAnchor('target');
    this.start = this.pageSize * (page - 1);
    this.loadReviewList();
  }
  nextImg() {
    this.currentSliderImage += 5;
  }
  prevImg() {
    this.currentSliderImage -= 5;
  }
  nextMainSlider(length) {
    let getId = parseInt((document.getElementsByClassName("carousel-item active")[0].id).split('_')[1])
    console.log(getId)
    console.log(getId / 5)
    if (getId % 5 == 4) {
      // if(this.currentSliderImage+5 >= 13){
      //   this.currentSliderImage -= 5;
      // }else{
      //   this.currentSliderImage += 5;
      // }
    }
    this.currentSliderImage = (parseInt(((getId + 1) / 5).toString().split('.')[0])) * 5
    if (getId == length - 1) {
      this.currentSliderImage = 0;
    }
    // if()
  }
  prevMainSlider(length) {
    let getId = parseInt((document.getElementsByClassName("carousel-item active")[0].id).split('_')[1])
    this.currentSliderImage = (parseInt(((getId - 1) / 5).toString().split('.')[0])) * 5
    if (getId == 0) {
      this.currentSliderImage = parseInt((length / 5).toString().split('.')[0]) * 5;
    }
  }
  setSliderMainImage(index) {
    var removeClassElement = document.getElementsByClassName("carousel-item active")[0];
    removeClassElement.classList.remove("active");

    var addClassElement = document.getElementById("id_" + index);
    addClassElement.classList.add("active");

    var removeClassElement = document.getElementsByClassName("slider-li active")[0];
    console.log(removeClassElement.classList);
    removeClassElement.classList.remove("active");

    var addClassElement = document.getElementById("slider_id_" + index);
    addClassElement.classList.add("active");
  }
  checkAvailability() {
    if (this.selectedHotel != undefined && this.selectedHotel.id != undefined && this.hotel.id != this.selectedHotel.id) {
      this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + this.selectedHotel.id],
          {
            queryParams: {
              'destination': this.selectedHotel.name,
              'check-in-date': this.pipe.transform(this.startDate, 'YYYY/MM/DD'),
              'check-out-date': this.pipe.transform(this.endDate, 'YYYY/MM/DD'),
              'rooms': this.roomValue,
              'adults': this.adultsValue,
              'children': this.childrenValue,
              'cityView': this.cityId,
              'area': this.area
            }
          })
      });
      return;
    }
    if (this.selectedHotel.type != undefined) {
      if (this.selectedHotel.type.key == 1) {
        console.log(this.pipe.transform(this.endDate, 'yyyy-MM-dd'));
        console.log(this.endDate);
        this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + this.selectedHotel.id],
          {
            queryParams: {
              'destination': this.selectedHotel.name,
              'check-in-date': this.pipe.transform(this.startDate, 'yyyy/MM/dd'),
              'check-out-date': this.pipe.transform(this.endDate, 'yyyy/MM/dd'),
              'rooms': this.roomValue,
              'adults': this.adultsValue,
              'children': this.childrenValue
            }
          });
        this.onCheckAvailability(true, null, null, false);
      } else {
        var cityView = null;
        var area = null;
        if (this.selectedHotel.type.key == 2) {
          cityView = {
            "key": this.selectedHotel.id
          };
        }
        if (this.selectedHotel.type.key == 3) {
          area = this.selectedHotel.name;
        }
        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=10`, {
          cityView: cityView,
          area: area,
          startDate: this.pipe.transform(this.startDate, 'DD/MM/YYYY'),
          endDate: this.pipe.transform(this.endDate, 'DD/MM/YYYY'),
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
              this.area = this.selectedHotel.name;
            }
            this.router.navigate(['/' + AppUrlConstants.hotelModule],
              {
                queryParams: {
                  'destination': this.selectedHotel.name,
                  'check-in-date': this.pipe.transform(this.startDate, 'YYYY/MM/DD'),
                  'check-out-date': this.pipe.transform(this.endDate, 'YYYY/MM/DD'),
                  'rooms': this.roomValue,
                  'adults': this.adultsValue,
                  'children': this.childrenValue,
                  'cityView': this.cityId,
                  'area': this.area
                }
              });
          } else if (response['code'] == 2006) {
            if (this.selectedHotel.type.key == 2) {
              this.cityId = this.selectedHotel.id;
            }
            if (this.selectedHotel.type.key == 3) {
              this.area = this.selectedHotel.name;
            }
            this.router.navigate(['/' + AppUrlConstants.hotelModule],
              {
                queryParams: {
                  'destination': this.selectedHotel.name,
                  'check-in-date': this.pipe.transform(this.startDate, 'YYYY/MM/DD'),
                  'check-out-date': this.pipe.transform(this.endDate, 'YYYY/MM/DD'),
                  'rooms': this.roomValue,
                  'adults': this.adultsValue,
                  'children': this.childrenValue,
                  'cityView': this.cityId,
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
  onHotelInputCleared() {
    this.selectedHotel = {};
    this.loadHotelList();
  }
  onInputChangedEvent(val: string) {

    // this.inputChanged = val;
    if (val != '') {
      // this.blockUI.start();
      this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-param?searchParam=` + val + "&tentHotel=" + this.tentHotelFlag).subscribe(response => {
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
    } else {
      this.selectedHotel = {};
    }
  }
  onSelect(item: any) {
    this.selectedHotel = item;
    // document.getElementById("datePicker").click();
  }
  /**
    * This method is use to get total room
     */
  getTotalRoom() {
    var total = 0
    if (localStorage.getItem('roomsAndGuestsInfo') != undefined) {
      total = JSON.parse(localStorage.getItem('roomsAndGuestsInfo')).length;
    }
    return total;
  }
  /**
   * This method is use to get total guest
   */
  getTotalGuest() {
    var total = 0;
    if (localStorage.getItem('roomsAndGuestsInfo') != undefined) {
      JSON.parse(localStorage.getItem('roomsAndGuestsInfo')).forEach(element => {
        total += element.adultsValue;
        total += element.childrenValue;
      });
    }
    return total;
  }
}