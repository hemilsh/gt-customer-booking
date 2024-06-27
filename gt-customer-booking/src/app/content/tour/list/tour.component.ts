import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as Long from 'long';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePickerDirective, IDatePickerConfig } from 'ng2-date-picker';
declare var moment: any;

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('tourList') tourListBlockUI: NgBlockUI
  @ViewChild('dateDirectivePicker', null) datePickerDirective: DatePickerDirective;
  config: IDatePickerConfig = {
    format: 'MMM, YYYY',
    disableKeypress: true
  };
  close() { this.datePickerDirective.api.close(); }
  // @ViewChild( {read: IgxMonthPickerComponent} ,null) public monthPicker: IgxMonthPickerComponent;
  searchTourPlaceHolder = "Enter Tour";
  // selectedDateAndMonth: Date = null;
  keyword = 'name';
  isDestinationSelected = false;
  isTourListFound = true;
  seatsValue = 1;
  maxSeats = 0;
  tourDropdownList = [];
  tourFilterDropdownView;
  tourFilterDropdownList = [];
  // tourPackageTypeList = [];
  public reviewView: any = [];
  // public tourPackageView: any = [];
  minimumPrice = 0;
  minimumDay = 0;
  tourList = [];
  filterArray: any = [];
  isMoreTourLoding = false;
  moreTourStartIndex = 0;
  moreTourRecordSize = 10;
  moreTourNoData = false;
  maximumPrice = 5000;
  maximumDay = 10;
  selectedTour: any = {};
  tourLocationId:any;
  selectedItem: any = {};
  inputChanged: any = '';
  startDate: any = '';
  endDate: any = '';
  privateTourFlag: boolean = false;
  @BlockUI('filterTourList') filterTourListBlockUI: NgBlockUI;
  public isFilterTourFound: boolean = true;
  config2: any = { 'class': 'test', 'max': 10, 'placeholder': 'Where are you going?', 'sourceField': ['name'] };
  hotelReviewList = [{ id: 1, name: '4.5 & above (Excellent)' }, { id: 2, name: '4 & above (Very Good)' }, { id: 3, name: '3 & above (Good)' }];
  public imgDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadTourImage;
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

  public singleDate: any;
  public eventLog = '';
  constructor(
    private daterangepickerOptions: DaterangepickerConfig,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {
    let total = this.router['currentUrlTree'].queryParams.total;
    let destination = this.router['currentUrlTree'].queryParams.destination;
    let privateFlag = this.router['currentUrlTree'].queryParams.privateTourFlag;
    if(privateFlag == "true"){
      this.privateTourFlag = true;
    }else{
      this.privateTourFlag = false;
    }
    let type = {
      'key': this.router['currentUrlTree'].queryParams.typeKey,
      'value': this.router['currentUrlTree'].queryParams.typeValue
    }
    this.tourLocationId = this.router['currentUrlTree'].queryParams.tourLocationViewId;
    this.selectedTour = {
      'id': this.router['currentUrlTree'].queryParams.tourLocationViewId,
      name: destination,
      type: type,
      total: total
    }
    if (this.router['currentUrlTree'].queryParams.destination == undefined) {
      this.selectedTour.name = '';
    }
    if (this.router['currentUrlTree'].queryParams['checkindate'] != undefined) {
      this.startDate = moment(this.router['currentUrlTree'].queryParams['checkindate'], 'DD/MM/YYYY');
      this.mainInput.start = moment(this.router['currentUrlTree'].queryParams['checkindate'], 'DD/MM/YYYY');
    } else {
      this.startDate = moment().add(1, 'day');
      this.mainInput.start = moment().add(1, 'day');

    }
    if (this.router['currentUrlTree'].queryParams['checkoutdate'] != undefined) {
      this.endDate = moment(this.router['currentUrlTree'].queryParams['checkoutdate'], 'DD/MM/YYYY');
      this.mainInput.end = moment(this.router['currentUrlTree'].queryParams['checkoutdate'], 'DD/MM/YYYY');
    } else {
      this.endDate = moment().add(2, 'day');
      this.mainInput.end = moment().add(2, 'day');
    }
    if (this.router['currentUrlTree'].queryParams.seat != undefined) {
      this.seatsValue = parseInt(this.router['currentUrlTree'].queryParams.seat);
    }
    if (this.router['currentUrlTree'].queryParams.monthAndYear != undefined) {
      // this.selectedDateAndMonth = moment(new Date(this.router['currentUrlTree'].queryParams.monthAndYear), 'MMM, YYYY');;
    }
    if (this.router['currentUrlTree'].queryParams.tourFilterViewKey != undefined && this.router['currentUrlTree'].queryParams.tourFilterViewKey != '') {
      this.tourFilterDropdownView = {};
      this.tourFilterDropdownView.key = this.router['currentUrlTree'].queryParams.tourFilterViewKey;
    }
    if (this.router['currentUrlTree'].queryParams.tourFilterViewValue != undefined && this.router['currentUrlTree'].queryParams.tourFilterViewValue != '') {
      this.tourFilterDropdownView.value = this.router['currentUrlTree'].queryParams.tourFilterViewValue;
    }
    this.daterangepickerOptions.settings = {
      startDate: this.startDate,
      endDate: this.endDate,
      locale: { format: 'DD/MM/YYYY' },
      alwaysShowCalendars: false,
      // ranges: {
      //    'Last Month': [moment().subtract(1, 'month'), moment()],
      //    'Last 3 Months': [moment().subtract(4, 'month'), moment()],
      //    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
      //    'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      // }
    };


    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.tourList = this.route.snapshot.data['resolveValue']['list'];
        // this.selectedTour.name = '';
        if (this.route.snapshot.data['resolveValue']['records'] <= this.route.snapshot.data['resolveValue']['list'].length) {
          this.moreTourNoData = true;
        }
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.tourList = [];
        this.moreTourNoData = true;
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
    this.singleDate = moment().add(1, 'day');
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
   * This method is use to change value of seat
   * @param isPluseOrMinus 
   */
  changeSeats(isPluseOrMinus) {
    if (isPluseOrMinus == 0) {
      this.seatsValue -= 1
    } else if (isPluseOrMinus == 1) {
      this.seatsValue += 1
    }
  }

  /**
   * This section is use to check availability of tour.
   */
  checkAvailability() {
    if (this.tourFilterDropdownView != undefined) {
      let tourKey = '';
      let tourValue = '';
      if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.key != undefined) { tourKey = this.tourFilterDropdownView.key }
      if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.value != undefined) { tourValue = this.tourFilterDropdownView.value }
      this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + this.tourFilterDropdownView.key],
        {
          queryParams: {
            'destination': this.selectedTour.name,
            'tourLocationViewId': this.selectedTour.id,
            'typeKey': this.selectedTour.type.key,
            'typeValue': this.selectedTour.type.value,
            'seat': this.seatsValue,
            // 'monthAndYear': this.selectedDateAndMonth,
            'tourFilterViewKey': tourKey,
            'tourFilterViewValue': tourValue,
            'privateTourFlag':this.privateTourFlag
          }
        });
    } else if (this.tourFilterDropdownView == undefined) {
      var cityView = null;
      var area = null;
      if (this.selectedTour.type.key == 2) {
        cityView = {
          "key": this.selectedTour.id
        };
      }
      if (this.selectedTour.type.key == 3) {
        area = this.selectedTour.name;
      }
      let minimumAverage = 0;
      if (this.filterArray['reviewView'] != undefined) {
        if (this.filterArray['reviewView'].id == 1) {
          minimumAverage = 4.5
        }
        if (this.filterArray['reviewView'].id == 2) {
          minimumAverage = 4
        }
        if (this.filterArray['reviewView'].id == 3) {
          minimumAverage = 3
        }
      }
      // let tourPackageView = null;
      // if (this.filterArray.tourPackageView != undefined) {
      //   tourPackageView = this.filterArray.tourPackageView;
      // }
      this.tourListBlockUI.start();
      this.isTourListFound = false;
      let url = 'search-tour';
      if(this.privateTourFlag){
        url = 'search-private-tour';
      }
      this.http.post(`${AppConfigConstants.baseUrl}public/tour/`+url+`?start=0&recordSize=10`, {
        tourLocationView: this.selectedTour,
        // startDate: moment(this.startDate).format('DD/MM/YYYY'),
        // endDate: moment(this.endDate).format('DD/MM/YYYY'),
        numberOfSeats: this.seatsValue,
        minimumDay: this.minimumDay,
        maximumDay: this.maximumDay,
        minimumPrice: this.minimumPrice,
        maximumPrice: this.maximumPrice,
        // month: new Date(this.selectedDateAndMonth).getMonth() + 1,
        // year: new Date(this.selectedDateAndMonth).getFullYear(),
        minimumAverage: minimumAverage,
        maximumAverage: 5,
        // tourPackageTypeView: tourPackageView
      }).subscribe(response => {
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.tourList = response['list'];
        } else if (response['code'] == 2006) {
          // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
          this.tourList = [];
        } else {
          this.toastr.error(response['message'], 'Error !');
        }
        this.isTourListFound = true;
        this.tourListBlockUI.stop();
      }, err => {
        this.isTourListFound = true;
        this.tourListBlockUI.stop();
        this.toastr.error(err['message'], 'Error !');
      });
    }

  }

  /**
   * This section is use to get tour list.
   */
  loadTourList() {
    this.tourDropdownList = [];
    if (this.selectedTour != null) {
      this.tourDropdownList.push(this.selectedTour);
      this.getFilterTour(this.selectedTour.id);
    } else {
      let body = {};
      if(this.tourLocationId != null){
        body = {"tourLocationView":{"id":this.tourLocationId}};
      }
      this.blockUI.start();
      let url = 'search-tour';
      if(this.privateTourFlag){
        url = 'search-private-tour';
      }
      this.http.post(`${AppConfigConstants.baseUrl}public/tour/`+url+`?start=0&recordSize=10`, body).subscribe(response => {
        this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.tourFilterDropdownList = response['list'];
          let list = [];
          for (let i = 0; i < response['records']; i++) {
            list.push({ value: response['list'][i].name, key: response['list'][i].id });
          }
          this.tourFilterDropdownList = list;
        } else if (response['code'] == 2006) {
          this.tourFilterDropdownList = [];
          var length = this.tourDropdownList.length;
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
  /**
   * This method is use to go to book tour
   * * @param tour 
   */
  bookNow(tour) {
    this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + tour.id],
      {
        queryParams: {
          'destination': this.selectedTour.name,
          'seat': this.seatsValue,
          // 'monthAndYear': this.selectedDateAndMonth,
          'tourFilterDropdownView': this.tourFilterDropdownView,
          'tourLocationViewId': this.selectedTour.id,
          'typeKey': this.selectedTour.type.key,
          'typeValue': this.selectedTour.type.value,
          'privateTourFlag':this.privateTourFlag
        }
      });
  }


  filterChangePlus() {
    if(this.minimumPrice > this.maximumPrice){
      this.maximumPrice = this.minimumPrice + 1000;
      if(this.maximumPrice > 30000){
        this.maximumPrice = 30000;
      }
    }
    this.checkAvailability()
  }

  filterChangeMinus() {
    if(this.maximumPrice < this.minimumPrice){
      this.minimumPrice = this.maximumPrice - 1000;
      if(this.minimumPrice < 0){
        this.minimumPrice = 0;
      }
    }
    this.checkAvailability()
  }

  dayWiseFilterChangePlus() {
    if(this.minimumDay > this.maximumDay){
      this.maximumDay = this.minimumDay + 10;
      if(this.maximumDay > 100){
        this.maximumDay = 100;
      }
    }
    this.checkAvailability()
  }

  dayWiseFilterChangeMinus() {
    if(this.maximumDay < this.minimumDay){
      this.minimumDay = this.maximumDay - 10;
      if(this.minimumDay < 0){
        this.minimumDay = 0;
      }
    }
    this.checkAvailability()
  }

  /**
   * This method is use to get Max value of rooms
   */
  ngOnInit() {
    this.loadTourList();
    // this.loadMaxRoom();
    // this.onTourPackageType();
  }
  loadMoreTours() {
    if (!this.isMoreTourLoding && !this.moreTourNoData) {
      this.isMoreTourLoding = true;
      this.moreTourStartIndex += this.moreTourRecordSize;
      let body = {};
      if(this.tourLocationId != null){
        body = {"tourLocationView":{"id":this.tourLocationId}};
      }
      this.blockUI.start();
      let url = 'search-tour';
      if(this.privateTourFlag){
        url = 'search-private-tour';
      }
      this.http.post(`${AppConfigConstants.baseUrl}public/tour/`+url+`?start=` + this.moreTourStartIndex + `&recordSize=` + this.moreTourRecordSize, body).subscribe(response => {
        if (response['code'] >= 1000 && response['code'] < 2000) {
          for (let i = 0; i < response['list'].length; i++) {
            this.tourList.push(response['list'][i])
          }
          this.moreTourNoData = false;
        } else if (response['code'] == 2006) {
          this.moreTourNoData = true;
        } else {
          this.toastr.error(response['message'], 'Error !');
        }
        this.blockUI.stop();
        this.isMoreTourLoding = false;
      }, err => {
        this.toastr.error(err['message'], 'Error !');
      });
    }
  }
  // constructor(private service: WikipediaService) {}

  onSelect(item: any) {
    this.selectedTour = item;
    if (this.isDestinationSelected) {
      // document.getElementById("datePicker").click();
    }
    if (item != undefined && item.id != undefined) {
      this.getFilterTour(item.id)
    }
    this.isDestinationSelected = true;
  }

  onInputChangedEvent(val: string) {

    this.inputChanged = val;
    if (val != '') {
      let body = {};
      if(this.tourLocationId != null){
        body = {"tourLocationView":{"id":this.tourLocationId}};
      }
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

  onTourInputCleared() {
    this.loadTourList();
}

  // onTourPackageType() {
  //   this.blockUI.start();
  //   this.http.get(`${AppConfigConstants.baseUrl}public/tour-package-type/dropdown`).subscribe(response => {
  //     if (response['code'] >= 1000 && response['code'] < 2000) {
  //       this.tourPackageTypeList = response['list'];
  //     } else if (response['code'] == 2006) {

  //     } else {
  //       this.toastr.error(response['message'], 'Error !');
  //     }
  //     this.blockUI.stop();
  //   }, err => {
  //     this.blockUI.stop();
  //     this.toastr.error(err['message'], 'Error !');
  //   });
  // }
  /**
     * This method is use to apply filter.
     * @param value 
     */
  filterReviewChange(data, value) {
    let json = {};
    json['reviewView'] = [];
    if (this.reviewView.length > 0) {
      for (let i = 0; i <= this.reviewView.length; i++) {
        if (i != data.id) {
          delete this.reviewView[i]
        }
      }
    }
    for (let i = 0; i <= this.reviewView.length; i++) {
      if (this.reviewView[i] == true) {
        // json['ReviewView'].push({ id: i })
      }
    }
    if (value) {
      this.filterArray['reviewView'] = (data);
    } else {
      delete this.filterArray['reviewView'];
    }
    this.checkAvailability();
  }
  /**
     * This method is use to apply filter.
     * @param value 
     */
  // filterPackageChange(data, value) {
  //   let json = {};
  //   json['tourPackageView'] = [];
  //   if (this.tourPackageView.length > 0) {
  //     for (let i = 0; i <= this.tourPackageView.length; i++) {
  //       if (i != data.id) {
  //         delete this.tourPackageView[i]
  //       }
  //     }
  //   }
  //   for (let i = 0; i <= this.tourPackageView.length; i++) {
  //     if (this.tourPackageView[i] == true) {
  //       // json['tourPackageView'].push({ id: i })
  //     }
  //   }
  //   if (value) {
  //     this.filterArray['tourPackageView'] = (data);
  //   } else {
  //     delete this.filterArray['tourPackageView'];
  //   }
  //   this.checkAvailability();
  // }

  search(term: string) {
    //   this.service.search(term).subscribe(e => this.wikiItems = e, error => console.log(error));
  }
  /**
     * This method is use to get popular tour
     */
  getFilterTour(id) {
    this.isFilterTourFound = false;
    this.filterTourListBlockUI.start();
    let url = 'dropdown';
      if(this.privateTourFlag){
        url = 'dropdown-private-tour';
      }
    this.http.get(`${AppConfigConstants.baseUrl}public/tour/`+url+`?locationId=` + id).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.tourFilterDropdownList = response['list'];
      } else if (response['code'] == 2006) {
        this.tourFilterDropdownList = [];
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