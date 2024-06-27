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
import { ViewportScroller } from '@angular/common';
import { DataService } from 'src/app/_services/data.service';
import * as $ from 'jquery';
import { IDatePickerConfig } from 'ng2-date-picker';
import { responseView } from 'src/app/_layout/classes/response.class';
declare var moment: any;
class Tour {
  public name: string = '';
  public days: any = null;
  public nights: any = null;
  public availableSeats: any = null;
  public useExistingCancellationPolicy: boolean = null;
  public terms: string = '';
  public description: string = '';
  public defaultHotelAmenitiesViews: any = [];
  public inclusion: string = '';
  public average: any = null;
  public exclusion: string = '';
  public totalTourRattings: string = '';
  public information: string = '';
  public tourIternityViews: any = [];
  public tourLocationViews: any = [];
  public tourReviewRattingTypeViews: any = [];
  public tourGalleryViews: any = [];
  public tourRattingCountView: any = {};
  public tourRattingAverageViews: any = [];
  public tourPriceView: any = {};
  public totalRattings: string = '';
  constructor(view: any = {}) {
    this.name = view.name;
    this.days = view.days;
    this.nights = view.nights;
    this.availableSeats = view.availableSeats;
    this.useExistingCancellationPolicy = view.useExistingCancellationPolicy;
    this.average = view.average;
    this.exclusion = view.exclusion;
    this.totalTourRattings = view.totalTourRattings;
    this.terms = view.terms;
    this.information = view.information;
    this.description = view.description;
    this.defaultHotelAmenitiesViews = view.defaultHotelAmenitiesViews;
    this.tourLocationViews = view.tourLocationViews;
    this.tourIternityViews = view.tourIternityViews;
    this.inclusion = view.inclusion;
    this.tourGalleryViews = view.tourGalleryViews;
    this.tourReviewRattingTypeViews = view.tourReviewRattingTypeViews;
    this.tourRattingCountView = view.tourRattingCountView;
    this.tourRattingAverageViews = view.tourRattingAverageViews;
    this.tourPriceView = view.tourPriceView;
    this.totalRattings = view.totalRattings;
  }
}
class Review {
  public title: string = '';
  public content: string = '';
  public tourRattingViews0: string = '';
  public tourRattingViews1: string = '';
  public tourRattingViews2: string = '';
  public tourRattingViews3: string = '';
  public tourRattingViews4: string = '';
  public tourRattingViews5: string = '';
  public tourRattingViews6: string = '';
  constructor(view: any = {}) {
    this.content = view.content;
    this.title = view.title;
    this.tourRattingViews0 = view.tourRattingViews0;
    this.tourRattingViews1 = view.tourRattingViews1;
    this.tourRattingViews2 = view.tourRattingViews2;
    this.tourRattingViews3 = view.tourRattingViews3;
    this.tourRattingViews4 = view.tourRattingViews4;
    this.tourRattingViews5 = view.tourRattingViews5;
    this.tourRattingViews6 = view.tourRattingViews6;

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
  selector: 'app-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.scss']
})
export class TourViewComponent implements OnInit {
  isIternityAccordionOpen = false;
  tourStartDate;
  tourEndDate;
  tourDropdownList = [];
  searchTourPlaceHolder = "Enter Tour";
  currentSliderImage = 0;
  currentSliderActiveClass = false;
  slideIndex = 1;
  p: number = 1;
  collection: any[];
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('saveReviewBtn') saveReviewBtnBlockUI: NgBlockUI
  @BlockUI('checkAvailabilityBtn') checkAvailabilityBtnBlockUI: NgBlockUI
  @BlockUI('tourBookBtn') tourBookBtnBlockUI: NgBlockUI
  @ViewChild('review', { read: true, static: false }) floatingLabelForm: NgForm;
  tour: Tour = new Tour();
  @ViewChild('nav', { static: false }) ds: NgImageSliderComponent;
  showSlider = true;
  roomValue = 0;
  bookRoomValue = 0;
  seatValue = 1;
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
  tourRattingViews: any = [];
  // reviewRattingTypeViews: RattingList = new RattingList();
  reviewRattingTypeViews: any = {};
  selectedTour: any = {};
  inputChanged: any = '';
  keyword = 'name';
  tourFilterDropdownView: any = [];
  // selectedDateAndMonth: Date = null;
  public isFilterTourFound: boolean = true;
  tourFilterDropdownList = [];
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
  isReviewSummited = false;
  selectedTourDate;
  selectedTourPrice;
  reviewModel: Review = new Review();
  @BlockUI('filterTourList') filterTourListBlockUI: NgBlockUI;
  config: IDatePickerConfig = {
    format: 'MMM, YYYY',
    disableKeypress: true
  };
  config2: any = { 'class': 'test', 'max': 10, 'placeholder': 'Where are you going?', 'sourceField': ['name'] };

  tourId;
  privateTourFlag: boolean = false;


  public singleDate: any;
  public eventLog = '';
  public imgUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadTourImage;
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

  public singlePicker = {
    singleDatePicker: true,
    showDropdowns: true,
    opens: "left"
  }
  scroll = (event): void => {
    let tourDetailsDivId = document.getElementById('tourDetailsDivId');

    console.log(tourDetailsDivId.offsetTop, window.pageYOffset)
    if ((tourDetailsDivId.offsetTop + 102) <= window.pageYOffset) {
      tourDetailsDivId.classList.add('stick')
    } else {
      tourDetailsDivId.classList.remove('stick')
    }
    //handle your scroll here
    //notice the 'odd' function assignment to a class field
    //this is used to be able to remove the event listener
  };
  constructor(
    private route: ActivatedRoute,
    private daterangepickerOptions: DaterangepickerConfig,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private vps: ViewportScroller,
    private data: DataService
  ) {
    window.addEventListener('scroll', this.scroll, true);
    this.saveReviewForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      tourRattingViews0: [''],
      tourRattingViews1: [''],
      tourRattingViews2: [''],
      tourRattingViews3: [''],
      tourRattingViews4: [''],
      tourRattingViews5: [''],
      tourRattingViews6: ['']
    });
    if (this.router['currentUrlTree'].queryParams['check-in-date'] != undefined) {
      this.startDate = moment(this.router['currentUrlTree'].queryParams['check-in-date']);
      this.mainInput.start = this.router['currentUrlTree'].queryParams['check-in-date'];
    } else {
      this.startDate = moment().add(1, 'day');
      this.mainInput.start = moment().add(1, 'day');
    }
    let total = this.router['currentUrlTree'].queryParams.total;
    let destination = this.router['currentUrlTree'].queryParams.destination;
    let type = {
      'key': this.router['currentUrlTree'].queryParams.typeKey,
      'value': this.router['currentUrlTree'].queryParams.typeValue
    }

    this.selectedTour = {
      id: this.router['currentUrlTree'].queryParams.tourLocationViewId,
      name: destination,
      type: type,
      total: total
    }
    this.tourId = this.route.snapshot.paramMap.get('id');
    // if (id != undefined && id != null) {
    //   this.tourFilterDropdownView = {
    //     "key": id
    //   }
    // }
    if (this.router['currentUrlTree'].queryParams.destination == undefined) {
      this.selectedTour = null;
    }
    console.log(this.selectedTour);
    // if (sharedService.getOption() != undefined) {
    //   this.currentCustomerUser = sharedService.getOption();
    // }
    if (this.router['currentUrlTree'].queryParams['check-out-date'] != undefined) {
      this.endDate = moment(this.router['currentUrlTree'].queryParams['check-out-date']);
      this.mainInput.end = moment(this.router['currentUrlTree'].queryParams['check-out-date']);
    } else {
      this.endDate = moment().add(2, 'day');
      this.mainInput.end = moment().add(2, 'day');
    }
    if (this.router['currentUrlTree'].queryParams.rooms != undefined) {
      this.roomValue = parseInt(this.router['currentUrlTree'].queryParams.rooms);
    }
    if (this.router['currentUrlTree'].queryParams.monthAndYear != undefined) {
      // this.selectedDateAndMonth = moment(new Date(this.router['currentUrlTree'].queryParams.monthAndYear), 'MMM, YYYY');;
    }
    if (this.router['currentUrlTree'].queryParams.tourFilterViewKey != undefined && this.router['currentUrlTree'].queryParams.tourFilterViewKey != '') {
      this.tourFilterDropdownView.key = this.router['currentUrlTree'].queryParams.tourFilterViewKey;
    }
    if (this.router['currentUrlTree'].queryParams.tourFilterViewValue != undefined && this.router['currentUrlTree'].queryParams.tourFilterViewValue != '') {
      this.tourFilterDropdownView.value = this.router['currentUrlTree'].queryParams.tourFilterViewValue;
    }
    if (localStorage.getItem('currentCustomerUser') != undefined) {
      this.currentCustomerUser = JSON.parse(localStorage.getItem('currentCustomerUser'));
    }
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.tour = new Tour(this.route.snapshot.data['resolveValue']['view']);
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.tour = new Tour({});
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test test test tyes test tesrt tesrt tesrt tesrt ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test test test tyes test tesrt tesrt tesrt tesrt ');
    // this.toaster.show('error', 'Error!', 'test test tyes test tesrt tesrt tesrt tesrt test ');
    this.daterangepickerOptions.settings = {
      startDate: moment().add(1, 'day'),
      endDate: moment().add(2, 'day'),
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      // ranges: {
      //    'Last Month': [moment().subtract(1, 'month'), moment()],
      //    'Last 3 Months': [moment().subtract(4, 'month'), moment()],
      //    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
      //    'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      // }
    };

    this.singleDate = moment().add(1, 'day');
    let privateFlag = this.router['currentUrlTree'].queryParams.privateTourFlag;
    if (privateFlag == "true") {
      this.privateTourFlag = true;
    } else {
      this.privateTourFlag = false;
    }
  }

  ngOnInit() {
    this.loadTourList();
    this.loadMaxRoom();
    this.loadReviewList();
    this.showSlides(this.slideIndex);
    this.data.currentMessage.subscribe(message => {
      if (message != '' && message != 'delete') {
        this.currentCustomerUser = message
      }
    });
    this.data.tourSelectedDateMessage.subscribe(message => {
      if (message != '') {
        this.selectedTourDate = message['mDate'];
        this.selectedTourPrice = message['price'];
      }
    });
  }
  openModal(images) {
    this.imageList = images.roomGalleryimages.roomImageFileViews;
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
    this.startDate = value.start;
    dateInput.end = value.end;
    this.endDate = value.end;
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
    * This method is use to change value of room
    * @param isPluseOrMinus 
    */
  changeRooms(isPluseOrMinus) {
    if (isPluseOrMinus == 0) {
      this.roomValue -= 1
    } else if (isPluseOrMinus == 1) {
      this.roomValue += 1
    }
  }

  /**
   * This method is use to change value of children
   * @param isPluseOrMinus 
   */
  changeSeats(isPluseOrMinus) {
    if (isPluseOrMinus == 0) {
      this.seatValue -= 1
    } else if (isPluseOrMinus == 1) {
      this.seatValue += 1
    }
  }

  /**
   * This method is use to get total amount
   */
  getTotalAmount(amount) {
    let total = 0;
    if (amount != undefined) {
      total = parseFloat(amount) * this.seatValue
    }
    return total;
  }
  get review() { return this.saveReviewForm.controls; }
  /**
     * This method is use to get max value of room, adults and childrens
     */
  loadMaxRoom() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-configuration`).subscribe((response: responseView) => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        response.list.forEach(element => {
          if (element.key == 'TOUR_SEARCH_START_DATE') {
            this.tourStartDate = element.value
          }
          if (element.key == 'TOUR_SEARCH_END_DATE') {
            this.tourEndDate = element.value
          }
        });
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
     * This method is use to check room availability.
     */
  onCheckAvailability() {
    this.isRoomTypeFound = false;
    this.checkAvailabilityBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/room-type/search?start=0&recordSize=10`, {
      "hotelView": { "id": this.route.snapshot.params.id },
      startDate: moment(this.startDate).format('DD/MM/YYYY'),
      endDate: moment(this.endDate).format('DD/MM/YYYY'),
      totalRooms: this.roomValue
    }).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        // this.roomTypeList = response['list'];
      } else {
        //   this.hotelList = [];
        this.toastr.error(response['message'], 'Error !');
      }
      this.isRoomTypeFound = true;
      this.checkAvailabilityBtnBlockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This method is use to get list of review.
   */
  loadReviewList() {
    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}public/tour/tour-review-search?start=` + this.start + `&recordSize=` + this.pageSize, { "tourView": { "id": this.route.snapshot.params.id } }).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.reviewList = response['list'];
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
  loadTour() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/tour/view?id=` + this.route.snapshot.params.id).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.tour = new Tour(response['view']);
      } else if (response['code'] == 2006) {
        this.tour = new Tour({});
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
    body['tourView'] = {};
    body['tourView'].id = this.route.snapshot.params.id;
    let temp = [];
    this.tourRattingViews.forEach((vals: any, keys: any) => {
      if (vals) {
        temp.push({ tourReviewRattingTypeView: { id: keys }, value: vals })
      }
      // value.checked = parentChecked;
    });
    body['tourRattingViews'] = temp;
    this.saveReviewBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/tour/review`, body).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.toastr.success(response['message'], 'Success');
        this.isReviewSummited = false;
        this.reviewModel.title = null;
        this.reviewModel.content = null;
        this.reviewModel.tourRattingViews0 = undefined;
        this.reviewModel.tourRattingViews1 = undefined;
        this.reviewModel.tourRattingViews2 = undefined;
        this.reviewModel.tourRattingViews3 = undefined;
        this.reviewModel.tourRattingViews4 = undefined;
        this.reviewModel.tourRattingViews5 = undefined;
        this.reviewModel.tourRattingViews6 = undefined;
        this.tourRattingViews = [];
        this.loadReviewList();
        this.loadTour();
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
  goToPayment() {
    if (localStorage.getItem('currentCustomerUser') == undefined || localStorage.getItem('currentCustomerUser') == null) {
      this.toastr.error("Please login for book the hotel", 'Error !');
      document.getElementById("login").style.width = "100%";
      return;
    }
    if (this.selectedTourDate == undefined) {
      this.toastr.error("Please Select Date", 'Error !');
      document.getElementById("customCalendar").click();
      this.scrollTo('selectDate')
      return;
    }
    let json = {};
    if (this.route.snapshot.params.id != undefined) {
      json['tourView'] = {};
      json['tourView'].id = this.route.snapshot.params.id;
    }
    json['totalSeats'] = this.seatValue;
    if (this.startDate != undefined) {
      json['startDate'] = moment(this.selectedTourDate._d).format('YYYY-MM-DDT00:00:00.SSS') + 'Z';
    }

    this.tourBookBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/book`, json).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.toastr.success(response['message'], 'Success');
        this.router.navigateByUrl(AppUrlConstants.tourModule + AppUrlConstants.bookModule + response['view'].referenceNumber);
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.tourBookBtnBlockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }

  scrollTo(id) {
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
  //   toggleIcon(e) {
  //     $(e.target)
  //         .prev('.panel-heading')
  //         .find(".more-less")
  //         .toggleClass('glyphicon-plus glyphicon-minus');
  // }


  onInputChangedEvent(val: string) {

    this.inputChanged = val;
    if (val != '') {
      // this.blockUI.start();
      this.http.get(`${AppConfigConstants.baseUrl}public/tour/search-tour-param?searchParam=` + val).subscribe(response => {
        // this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.tourDropdownList = response['list'];
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
  * This section is use to get tour list.
  */
  loadTourList() {
    if (this.selectedTour != null) {
      this.tourDropdownList.push(this.selectedTour);
      this.getFilterTour(this.selectedTour.id);
    } else {
      this.blockUI.start();
      let url = 'search-tour';
      if (this.privateTourFlag == true) {
        url = 'search-private-tour';
      }
      this.http.post(`${AppConfigConstants.baseUrl}public/tour/` + url + `?start=0&recordSize=10`, {}).subscribe(response => {
        this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.tourFilterDropdownList = response['list'];
          let list = [];
          for (let i = 0; i < response['records']; i++) {
            list.push({ value: response['list'][i].name, key: response['list'][i].id });
          }
          this.tourFilterDropdownList = list;
          if (this.tourId != null) {
            for (let i = 0; i < list.length; i++) {
              if (list[i].key == this.tourId) {
                this.tourFilterDropdownView = list[i];
              }
            }
          }
        } else if (response['code'] == 2006) {
          this.tourFilterDropdownList = [];
          this.tourFilterDropdownView = null;
          var length = this.tourFilterDropdownList.length;
          for (let i = 0; i < length; i++) {
            this.tourFilterDropdownList.splice(0, 1);
          }
        } else {
          this.toastr.error(response['message'], 'Error !');
        }
      }, err => {
        this.toastr.error(err.message, 'Error !');
      });
    }
  }

  onSelect(item: any) {
    this.selectedTour = item;
    if (item != undefined && item.id != undefined) {
      this.getFilterTour(item.id)
    }
  }
  /**
     * This method is use to get popular tour
     */
  getFilterTour(id) {
    this.isFilterTourFound = false;
    this.filterTourListBlockUI.start();
    let url = 'dropdown';
    if (this.privateTourFlag == true) {
      url = 'dropdown-private-tour';
    }
    this.http.get(`${AppConfigConstants.baseUrl}public/tour/` + url + `?locationId=` + id).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.tourFilterDropdownList = response['list'];
        if (this.tourId != null) {
          for (let i = 0; i < this.tourFilterDropdownList.length; i++) {
            if (this.tourFilterDropdownList[i].key == this.tourId) {
              this.tourFilterDropdownView = this.tourFilterDropdownList[i];
            }
          }
        }
      } else if (response['code'] == 2006) {
        this.tourFilterDropdownList = [];
        this.tourFilterDropdownView = null;
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
  /**
  * This section is use to check availability of tour.
  */
  checkAvailability() {
    let tourKey = '';
    let tourValue = '';
    if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.key != undefined) { tourKey = this.tourFilterDropdownView.key }
    if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.value != undefined) { tourValue = this.tourFilterDropdownView.value }
    // if (this.selectedTour.type != undefined) {
    var params = {};
    if (this.selectedTour != null) {
      params = {
        'destination': this.selectedTour.name,
        // 'monthAndYear': this.selectedDateAndMonth,
        'tourLocationViewId': this.selectedTour.id,
        'typeKey': this.selectedTour.type.key,
        'typeValue': this.selectedTour.type.value,
        'total': this.selectedTour.total,
        'tourFilterViewKey': tourKey,
        'tourFilterViewValue': tourValue,
        'privateTourFlag': this.privateTourFlag
      }
    } else {
      params = {
        'privateTourFlag': this.privateTourFlag
      }
    }
    if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.key != undefined) {
     
      this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + this.tourFilterDropdownView.key],
        {
          queryParams: params
        });
      });
      
    } else if (this.tourFilterDropdownView == undefined) {

      this.blockUI.start();
      let url = 'search-tour';
      if (this.privateTourFlag == true) {
        url = 'search-private-tour';
      }
      this.http.post(`${AppConfigConstants.baseUrl}public/tour/` + url + `?start=0&recordSize=10`, {
        tourLocationView: this.selectedTour,
        startDate: moment(this.startDate).format('DD/MM/YYYY'),
        endDate: moment(this.endDate).format('DD/MM/YYYY'),
        numberOfSeats: this.seatValue,
      }).subscribe(response => {
        this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          // this.hotelList = response['list'];
          this.router.navigate(['/' + AppUrlConstants.tourModule],
            {
              queryParams: {
                'destination': this.selectedTour.name,
                // 'monthAndYear': this.selectedDateAndMonth,
                'seat': this.seatValue,
                'tourLocationViewId': this.selectedTour.id,
                'typeKey': this.selectedTour.type.key,
                'typeValue': this.selectedTour.type.value,
                'total': this.selectedTour.total,
                'tourFilterViewKey': tourKey,
                'tourFilterViewValue': tourValue,
                'privateTourFlag': this.privateTourFlag
              }
            });
        } else if (response['code'] == 2006) {
          // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
          this.router.navigate(['/' + AppUrlConstants.tourModule],
            {
              queryParams: params
            });
        } else {
          this.toastr.error(response['message'], 'Error !');
        }
      }, err => {
        this.toastr.error(err['message'], 'Error !');
      });
    }
    // } else {
    //   this.toastr.error("Please Enter Destination", 'Error !');
    // }

  }

}