import { Component, OnInit } from '@angular/core';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as Long from 'long';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
declare var moment: any;
class FilterArray {
  public id: Long = new Long(null);
  public categoryList: any = [];
  public typeList: any = [];
  public reviewView: any = {};
  constructor(view: any = {}) {
    this.id = view.id;
    this.categoryList = view.categoryList;
    this.typeList = view.typeList;
    this.reviewView = view.reviewView;
  }
}

class selectedHotelView {
  public id: string = '';
  public name: string = '';
  public type: any = {};
  public total: string = '';
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
    this.type = view.type;
    this.total = view.total;
  }
}

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  searchHotelPlaceHolder = "Enter City/Hotel/Area/";
  keyword = 'name';
  public roomsAndGuestsList = [
    {
      id: 1, adultsValue: 2, childrenValue: 0, childrenAgeList: []
    }
  ];
  categoryFilterValue: any = { id: 0, name: 0 };
  isDestinationSelected = false;
  roomValue = 1;
  adultsValue = 2;
  childrenValue = 0;
  adultMaxRooms = 0;
  childrenMaxRooms = 0;
  categoryView = [];
  typeView = [];
  filterPrice = 500;
  hotelList = [];
  hotelTypeList = [];
  hotelOrderList = [];
  hotelCategoryList = [];
  hotelReviewList = [{ id: 1, name: '4.5 & above (Excellent)' }, { id: 2, name: '4 & above (Very Good)' }, { id: 3, name: '3 & above (Good)' }];
  hotelDropdownList = [];
  displaySeletedHotel = { id: '', name: '', type: {}, total: 0 }
  budgetViews = [];
  budgetList = [{ id: 1, name: '500 INR - 999 INR', min: 500, max: 999 }, { id: 2, name: '1000 INR - 4999 INR', min: 1001, max: 4999 }, { id: 3, name: '5000 INR - 9999 INR', min: 5000, max: 9999 }, { id: 4, name: '10000 INR - More', min: 10000, max: 250000000 }];
  hotelTypeValue = 5;
  hotelReviewValue = 5;
  budgetFilterValue = 5;
  // this.hotelModel = new Hotel(view);
  filterArray: FilterArray = new FilterArray();
  reviewView = [];
  minimumPrice = 0;
  isMoreHotelLoding = false;
  moreHotelStartIndex = 0;
  moreHotelRecordSize = 10;
  moreHotelNoData = false;
  maximumPrice = 5000;
  isAllFilterRemoved = false;
  selectedHotel: any = {};
  selectedItem: any = { id: 8, name: "Mbvv" };
  inputChanged: any = '';
  startDate: any = moment().add(2, 'day');
  endDate: any = moment().add(3, 'day');
  wikiItems: any[] = [];
  maxValuePerRoom = {};
  cityId;
  area;
  tentHotelFlag:any = false;
  pipe = new DatePipe('en-US');
  isRemoveAll = false;
  config2: any = { 'class': 'test', 'max': 10, 'placeholder': 'Where are you going?', 'sourceField': ['name'] };
  public imgDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelImage;
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

  getSeletedHotel(item) {
    let json = {};
    if (item != undefined) {
      json['id'] = item.id;
      json['name'] = item.name;
      json['type'] = item.type;
      json['total'] = item.total;
      return json;
    }
    return false;
  }

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

  public singleDate: any;
  public eventLog = '';
  constructor(
    private daterangepickerOptions: DaterangepickerConfig,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {
    if (this.router['currentUrlTree'].queryParams.destination != undefined) {
      if (this.router['currentUrlTree'].queryParams.cityView != undefined) {
        this.selectedHotel = {
          name: this.router['currentUrlTree'].queryParams.destination
          , id: this.router['currentUrlTree'].queryParams.cityView,
          type: { 'key': 2, 'value': 'City' }, total: this.router['currentUrlTree'].queryParams.totalDestination
        };

      }
      if (this.router['currentUrlTree'].queryParams.area != undefined) {
        this.selectedHotel = {
          name: this.router['currentUrlTree'].queryParams.area
          , id: null,
          type: { 'key': 3, 'value': 'Area' }, total: this.router['currentUrlTree'].queryParams.totalDestination
        };

      }

    } else {
      this.selectedHotel.name = '';
    }
    if (this.router['currentUrlTree'].queryParams['check-in-date'] != undefined) {
      this.startDate = moment(this.router['currentUrlTree'].queryParams['check-in-date'], 'DD/MM/YYYY');
      this.mainInput.start = moment(this.router['currentUrlTree'].queryParams['check-in-date'], 'DD/MM/YYYY');
    } else {
      this.startDate = moment().add(2, 'day');
      this.mainInput.start = moment().add(2, 'day');

    }
    if (this.router['currentUrlTree'].queryParams['check-out-date'] != undefined) {
      this.endDate = moment(this.router['currentUrlTree'].queryParams['check-out-date'], 'DD/MM/YYYY');
      this.mainInput.end = moment(this.router['currentUrlTree'].queryParams['check-out-date'], 'DD/MM/YYYY');
    } else {
      this.endDate = moment().add(3, 'day');
      this.mainInput.end = moment().add(3, 'day');
    }
    if (this.router['currentUrlTree'].queryParams.rooms != undefined) {
      this.roomValue = parseInt(this.router['currentUrlTree'].queryParams.rooms);
    }
    if (this.router['currentUrlTree'].queryParams.tentHotel != undefined) {
      this.tentHotelFlag = this.router['currentUrlTree'].queryParams.tentHotel;
    }
    if (this.router['currentUrlTree'].queryParams.adults != undefined) {
      this.adultsValue = parseInt(this.router['currentUrlTree'].queryParams.adults);
    }
    if (this.router['currentUrlTree'].queryParams.children != undefined) {
      this.childrenValue = parseInt(this.router['currentUrlTree'].queryParams.children);
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
        this.hotelList = this.route.snapshot.data['resolveValue']['list'];

        if (this.route.snapshot.data['resolveValue']['records'] <= this.route.snapshot.data['resolveValue']['list'].length) {
          this.moreHotelNoData = true;
        }
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.hotelList = [];
        this.moreHotelNoData = true;
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
    if (e.event.type == 'apply') {
      document.getElementById("dropdownMenuButton").click();
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
   * This section is use to check availability of hotel.
   */
  checkAvailability() {
    if (this.selectedHotel.type != undefined) {
      if (this.selectedHotel.type != undefined && this.selectedHotel.type.key == 1) {
        this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + this.selectedHotel.id],
          {
            queryParams: {
              'destination': this.selectedHotel.name,
              'check-in-date': moment(this.startDate).format('YYYY/MM/DD'),
              'check-out-date': moment(this.endDate).format('YYYY/MM/DD'),
              'rooms': this.roomValue,
              'adults': this.adultsValue,
              'childern': this.childrenValue
            }
          });
      } else {
        var cityView = null;
        var area = null;
        if (this.selectedHotel.type != undefined) {
          if (this.selectedHotel.type.key == 2) {
            cityView = {
              "key": this.selectedHotel.id
            };
          }
          if (this.selectedHotel.type.key == 3) {
            area = this.selectedHotel.name;
          }
        }
        let categoryViews = [];
        for (let i = 0; i <= this.categoryView.length; i++) {
          if (this.categoryView[i] == true) {
            categoryViews.push({ id: i })
          }
        }
        let minimumPrice = this.minimumPrice;
        let maximumPrice = this.maximumPrice;

        let minAverage = null;
        if (this.filterArray['reviewView'] != undefined) {
          if (this.filterArray['reviewView'].id == 1) {
            minAverage = 4.5
          }
          if (this.filterArray['reviewView'].id == 2) {
            minAverage = 4
          }
          if (this.filterArray['reviewView'].id == 3) {
            minAverage = 3
          }
        }
        let typeViews = [];
        for (let i = 0; i <= this.typeView.length; i++) {
          if (this.typeView[i] == true) {
            typeViews.push({ id: i })
          }
        }


        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=10`, {
          cityView: cityView,
          area: area,
          typeViews: typeViews,
          categoryViews: categoryViews,
          minAverage: minAverage,
          maxAverage: 5,
          minimumPrice: minimumPrice,
          maximumPrice: maximumPrice,
          startDate: moment(this.startDate).format('DD/MM/YYYY'),
          endDate: moment(this.endDate).format('DD/MM/YYYY'),
          numberOfRoom: this.roomValue,
          numberOfAdults: this.adultsValue,
          numberOfChildren: this.childrenValue,
        }).subscribe(response => {
          this.blockUI.stop();
          if (response['code'] >= 1000 && response['code'] < 2000) {
            this.hotelList = response['list'];
            if (!this.isAllFilterRemoved) {
              if (this.selectedHotel.type != undefined) {
                if (this.selectedHotel.type.key == 2) {
                  this.cityId = this.selectedHotel.id;
                } else {
                  this.cityId = null;
                }
                if (this.selectedHotel.type.key == 3) {
                  this.area = this.selectedHotel.name;
                } else {
                  this.area = null;
                }
              }
              this.router.navigate(['/' + AppUrlConstants.hotelModule],
                {
                  queryParams: {
                    'destination': this.selectedHotel.name,
                    'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                    'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
                    'rooms': this.roomValue,
                    'adults': this.adultsValue,
                    'childern': this.childrenValue,
                    'cityView': this.cityId,
                    'area': this.area
                  }
                });
            } else {
              this.router.navigate(['/' + AppUrlConstants.hotelModule],
                {
                  queryParams: {
                    'destination': this.selectedHotel.name,
                    'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                    'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
                    'rooms': this.roomValue,
                    'adults': this.adultsValue,
                    'childern': this.childrenValue,
                    'cityView': this.cityId,
                    'area': this.area
                  }
                });
            }
          } else if (response['code'] == 2006) {
            // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
            this.hotelList = [];
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

  /**
   * This section is use to get hotel list.
   */
  loadHotelList() {
    if (this.selectedHotel != null) {
      this.hotelDropdownList.push(this.selectedHotel);
      this.displaySeletedHotel = this.selectedHotel;
    } else {
      this.blockUI.start();
      this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=10`, {
        fullTextSearch: ''
      }).subscribe(response => {
        this.blockUI.stop();
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.hotelDropdownList = [];
          for (let i = 0; i < response['list'].length; i++) {
            this.hotelDropdownList.push({ name: response['list'][i].name, id: response['list'][i].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 });
          }
          this.selectedHotel = this.hotelDropdownList[0];
          this.getSeletedHotel(this.hotelDropdownList[0])
          this.displaySeletedHotel = { name: response['list'][0].name, id: response['list'][0].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 };
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
    }
  }
  /**
   * This method is use to go to book hotel
   * * @param hotel 
   */
  bookNow(hotel) {
    this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + hotel.id], {
      queryParams: {
        'destination': this.selectedHotel.name,
        'check-in-date': moment(this.startDate).format('YYYY/MM/DD'),
        'check-out-date': moment(this.endDate).format('YYYY/MM/DD'),
        'rooms': this.roomValue,
        'adults': this.adultsValue,
        'childern': this.childrenValue
      }
    });
  }
  /**
   * This section is use to get type droupdown list.
   */
  loadTypeList() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/type/dropdown`).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.hotelTypeList = response['list'];
      } else if (response['code'] == 2006) {
        this.hotelTypeList = [];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }

  /**
   * This Method is use to get order droupdown list.
   */
  loadOrderList() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/dropdown-order`).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.hotelOrderList = response['list'];
      } else if (response['code'] == 2006) {
        this.hotelOrderList = [];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This section is use to get category droupdown list.
   */
  loadCategoryList() {
    return
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/dropdown-category`).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.hotelCategoryList = response['list'];
      } else if (response['code'] == 2006) {
        this.hotelCategoryList = [];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }
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
    this.filterChange(this.categoryFilterValue.id, this.categoryFilterValue.name);
  }
  budgetFilterChange(id) {
    for (let i = 0; i < this.budgetViews.length; i++) {
      if (i == id) {
        this.budgetViews[i] = true;
      } else {
        this.budgetViews[i] = false;
      }
    }
    this.filterChange(this.categoryFilterValue.id, this.categoryFilterValue.name);
  }
  filterChange(id, name) {
    // let json = {};
    if (id != 0 && name != 0) {
      this.categoryFilterValue = {};
      this.categoryFilterValue.id = id;
      this.categoryFilterValue.name = name;
      var isDuplicateEntry = false;
      if(this.filterArray['categoryList'] != undefined && this.filterArray['categoryList'].length != 0){
        for (let i = 0; i < this.filterArray['categoryList'].length; i++) {
          if (this.filterArray['categoryList'][i].id == id) {
            isDuplicateEntry = true;
          }
        }
      }
      if (this.filterArray['categoryList'] == undefined) {
        this.filterArray['categoryList'] = [];
      }
      if (!isDuplicateEntry) {
        this.filterArray['categoryList'].push(this.categoryFilterValue);
      }
    }
    let json = this.setFilter();
    var url = 'public/hotel/search-hotel?start=0&recordSize=10';
    if (this.tentHotelFlag == true || this.tentHotelFlag == 'true') {
      url = 'public/hotel/search-fair-festival?start=0&recordSize=10';
    }
    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}`+url, json).subscribe(response => {
      this.isRemoveAll = true;
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.hotelList = response['list'];
      } else if (response['code'] == 2006) {
        this.hotelList = [];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }
  /**
   * This method is use to remove filter.
   * @param value 
   */
  removeReviewFilter(value) {
    delete this.reviewView[value.id];
    delete this.filterArray['reviewView'];
    this.filterChange(this.categoryFilterValue.id, this.categoryFilterValue.name);
  }
  removeTypeFilter(value) {
    delete this.typeView[value.id];
    this.filterArray['typeList'].splice(this.filterArray['typeList'].findIndex(x => x.id === value.id), 1);
    this.filterChange(this.categoryFilterValue.id, this.categoryFilterValue.name);
  }
  removeCategoryFilter(value) {
    delete this.categoryView[value.id];
    // this.filterArray['categoryList'] = [];
    this.filterArray['categoryList'].splice(this.filterArray['categoryList'].findIndex(x => x.id === value.id), 1);
    this.categoryFilterValue = { id: 0, name: 0 };
    this.filterChange(this.categoryFilterValue.id, this.categoryFilterValue.name);
  }
  /**
   * This method is use to get Max value of rooms
   */
  loadMaxRoom() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-configuration`).subscribe(response => {
      this.blockUI.stop();
      let minDate = '';
      let maxDate = '';
      if (response['code'] >= 1000 && response['code'] < 2000) {
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
  onMoreType() {
    if (this.hotelTypeValue == 5) {
      this.hotelTypeValue = this.hotelTypeList.length;
    } else {
      this.hotelTypeValue = 5;
    }
  }
  onMoreReview() {
    if (this.hotelReviewValue == 5) {
      this.hotelReviewValue = this.hotelReviewList.length;
    } else {
      this.hotelReviewValue = 5;
    }
  }
  onMoreBudget() {
    if (this.budgetFilterValue == 5) {
      this.budgetFilterValue = this.budgetList.length;
    } else {
      this.budgetFilterValue = 5;
    }
  }
  ngOnInit() {
    var interval = setInterval(function(){ 
      $('.daterangepicker.dropdown-menu').addClass('date-range-picker-menu');
      if($('.daterangepicker.dropdown-menu') != null){
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
    this.loadCategoryList();
    this.loadTypeList();
    this.loadOrderList();
  }
  ngOnDestroy(){
    $('.daterangepicker.dropdown-menu').removeClass('date-range-picker-menu');
  }
  setFilter() {
    let json = {};
    if (this.filterArray['categoryList'] != undefined && this.filterArray['categoryList'].length != 0) {
      json['categoryViews'] = [];
      json['categoryViews'] = this.filterArray['categoryList'];
    }
    json['typeViews'] = [];
    this.budgetViews.forEach((val: any, key: any) => {
      if (val) {
        let tempView: any = this.budgetList.find(j => j.id === key)
        json['minimumPrice'] = tempView.min;
        json['maximumPrice'] = tempView.max;
      }
    });
    this.filterArray['typeList'] = [];
    if (this.filterArray['reviewView'] != undefined) {
      let minAverage;
      if (this.filterArray['reviewView'].id == 1) {
        minAverage = 4.5
      }
      if (this.filterArray['reviewView'].id == 2) {
        minAverage = 4
      }
      if (this.filterArray['reviewView'].id == 3) {
        minAverage = 3
      }
      json['minAverage'] = minAverage;
      json['maxAverage'] = 5;
    } else {
      delete json['minAverage'];
      delete json['maxAverage'];
    }
    for (let i = 0; i <= this.typeView.length; i++) {
      if (this.typeView[i] == true) {
        json['typeViews'].push({ id: i })
        this.filterArray['typeList'].push(this.hotelTypeList.find(j => j.id === i));
      }
    }


    if (this.selectedHotel != null) {
      if (this.selectedHotel.type != undefined) {
        if (this.selectedHotel.type.key == 2) {
          var cityView = null;
          cityView = {
            "key": this.selectedHotel.id
          };
          json['cityView'] = cityView;
        }
        if (this.selectedHotel.type.key == 3) {
          var area = null;
          area = this.selectedHotel.name;
          json['area'] = area;
        }
      }
    }

    if (this.startDate != null) {
      json['startDate'] = moment(this.startDate).format('DD/MM/YYYY');
    }
    if (this.startDate != null) {
      json['endDate'] = moment(this.endDate).format('DD/MM/YYYY');
    }
    if (this.roomValue != null) {
      json['numberOfRoom'] = this.roomValue;
    }
    if (this.adultsValue != null) {
      json['numberOfAdults'] = this.adultsValue;
    }
    if (this.childrenValue != null) {
      json['numberOfChildren'] = this.childrenValue;
    }
    return json;
  }
  loadMoreHotels() {
    if (!this.isMoreHotelLoding && !this.moreHotelNoData) {
      var json = this.setFilter();
      this.isMoreHotelLoding = true;
      this.moreHotelStartIndex += this.moreHotelRecordSize;
      this.blockUI.start();
      this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=` + this.moreHotelStartIndex + `&recordSize=` + this.moreHotelRecordSize, json).subscribe(response => {
        if (response['code'] >= 1000 && response['code'] < 2000) {
          for (let i = 0; i < response['list'].length; i++) {
            this.hotelList.push(response['list'][i])
          }
          this.moreHotelNoData = false;
        } else if (response['code'] == 2006) {
          this.moreHotelNoData = true;
        } else {
          this.toastr.error(response['message'], 'Error !');
        }
        this.blockUI.stop();
        this.isMoreHotelLoding = false;
      }, err => {
        this.toastr.error(err['message'], 'Error !');
      });
    }
  }
  // constructor(private service: WikipediaService) {}

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


  search(term: string) {
    //   this.service.search(term).subscribe(e => this.wikiItems = e, error => console.log(error));
  }

  /**
   * This method is use to remove all filter
   */
  removeAllFilter() {
    // if (document.getElementById('closeFilter') != undefined && document.getElementById('closeFilter') != null) {
    //   document.getElementById('closeFilter').click();
    // }
    this.isAllFilterRemoved = true;
    this.categoryView = [];
    this.typeView = [];
    this.budgetViews = [];
    this.reviewView = [];
    this.filterArray = new FilterArray();
    this.checkAvailability();
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

  onHotelInputCleared() {
    this.selectedHotel = {};
  }
}
