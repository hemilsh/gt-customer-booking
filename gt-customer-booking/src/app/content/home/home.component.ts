import { Component, OnInit, ViewChild } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfigConstants, AppUrlConstants } from '../../appconfig';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { FormGroup } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { ViewportScroller, DatePipe } from '@angular/common';
import { template } from 'ng-block-ui/components/block-ui-content/block-ui-content.component.template';
import * as $ from 'jquery';
import { DataService } from 'src/app/_services/data.service';
import { IDatePickerConfig, DatePickerDirective } from 'ng2-date-picker';
import { iif } from 'rxjs';
import { retry } from 'rxjs/operators';
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
declare var moment: any;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    keyword = 'name';
    @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
    public hotelDropdownList = [];
    public tourDropdownList = [];
    public popularTourList = [];
    public privateTourList = [];
    public tentHotelList = [];
    public roomsAndGuestsList: any = [
        {
            id: 1, adultsValue: 2, childrenValue: 0, childrenAgeList: []
        }
    ];
    public adultMaxRooms;
    public childrenMaxRooms;
    public maxGuest;
    public isPopularTourFound: boolean = true;
    public isTentHotelFound: boolean = true;
    public isFilterTourFound: boolean = true;
    genderList = [{ key: 1, value: 1 }, { key: 2, value: 2 }, { key: 3, value: 3 }, { key: 4, value: 4 }, { key: 5, value: 5 }, { key: 6, value: 6 }, { key: 7, value: 7 }, { key: 8, value: 8 }, { key: 9, value: 9 }, { key: 10, value: 10 }, { key: 11, value: 11 }, { key: 12, value: 12 }, { key: 13, value: 13 }, { key: 14, value: 14 }, { key: 15, value: 15 }, { key: 16, value: 16 }, { key: 17, value: 17 }];
    tourFilterDropdownList = [];
    tourFilterDropdownView;
    roomValue = 1;
    seatValue = 1;
    adultsValue = 2;
    childrenValue = 0;
    startDate;
    endDate;
    startTourDate;
    endTourDate;
    tab = 1;
    isDestinationSelected = false;
    searchHotelPlaceHolder = "Enter City/Hotel/Area/";
    searchTourPlaceHolder = "Enter City/Tour/Area/";
    cityId;
    area;
    pipe = new DatePipe('en-US');

    carLocationFilterDropdownList = [];
    carLocationFilterDropdownView;
    carList = [];

    public imgDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelImage;
    public tourImgDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadTourImage;
    @ViewChild('dateDirectivePicker', null) datePickerDirective: DatePickerDirective;
    config: IDatePickerConfig = {
        format: 'MMM, YYYY',
        disableKeypress: true
    };
    @BlockUI() blockUI: NgBlockUI
    @BlockUI('popularTourList') popularTourListBlockUI: NgBlockUI
    @BlockUI('tentHotelList') tentHotelListBlockUI: NgBlockUI
    @BlockUI('filterTourList') filterTourListBlockUI: NgBlockUI
    ngOnInit() {
        if (this.router['currentUrlTree'].queryParams['search'] != undefined) {
            var tabname = this.router['currentUrlTree'].queryParams['search'];
            if(tabname == 'hotels'){
                this.tab = 1
            }
            if(tabname == 'tcgl-tours'){
                this.tab = 2
            }
            if(tabname == 'tcgl-supported-tour'){
                this.tab = 3
            }
            if(tabname == 'fairs-festivals'){
                this.tab = 4
            }
            if(tabname == 'rent-car'){
                this.tab = 5
            }
        }
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
        this.getPopularTour();
        this.loadTourList();
        this.loadCarLocationList();
        this.getPrivateTour();
        this.getTentHotel();
        this.loadMaxRoom();
        this.startDate = moment().add(2, 'day');
        this.endDate = moment().add(3, 'day');
        this.startTourDate = moment().add(1, 'day');
        this.endTourDate = moment().add(2, 'day');
        this.checkCarAvailability();
    }

    ngOnDestroy() {
        // $('.date-range-picker-menu').removeClass('date-range-picker-menu');
    }
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
    public mainInput2 = {
        start: moment().add(2, 'day'),
        end: moment().add(3, 'day')
        // start: moment().subtract(12, 'month'),
        // end: moment().subtract(6, 'month')
    }
    public tourMainInput = {
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
    public hotelList = []
    selectedHotel: any = {};
    selectedTour: any = {};
    // selectedDateAndMonth;
    displaySeletedHotel = { id: '', name: '', type: {}, total: 0 }
    inputChanged: any = '';
    wikiItems: any[] = [];
    constructor(
        // private daterangepickerOptions: DaterangepickerConfig,
        private _sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private vps: ViewportScroller,
        private data: DataService
    ) {
        if (document.getElementById("myNav") != null) {
            document.getElementById("myNav").style.width = "0%";
        }
        if (this.route.snapshot.data['resolveValue']['list'] != undefined) {
            if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
                this.hotelList = this.route.snapshot.data['resolveValue']['list'];
                this.hotelDropdownList = [];
                for (let i = 0; i < this.route.snapshot.data['resolveValue']['list'].length; i++) {
                    this.hotelDropdownList.push({ name: this.route.snapshot.data['resolveValue']['list'][i].name, id: this.route.snapshot.data['resolveValue']['list'][i].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 });
                }
            } else {
                this.hotelList = [];
                this.toastr.error(this.route.snapshot.data['resolveValue'].message, 'Error !');
            }
        }
        // this.daterangepickerOptions.settings = {
        //     startDate: moment().add(1, 'day'),
        //     endDate: moment().add(2, 'day'),
        //     startTourDate: moment().add(1, 'day'),
        //     endTourDate: moment().add(2, 'day'),
        //     locale: { format: 'YYYY-MM-DD' },
        //     alwaysShowCalendars: false,
        //     // ranges: {
        //     //    'Last Month': [moment().subtract(1, 'month'), moment()],
        //     //    'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        //     //    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        //     //    'Last 12 Months': [moment().subtract(12, 'month'), moment()],
        //     // }
        // };
        // this.tourDaterangepickerOptions = {
        //     startTourDate: moment().add(1, 'day'),
        //     endTourDate: moment().add(2, 'day'),
        //     locale: { format: 'YYYY-MM-DD' },
        //     alwaysShowCalendars: false,
        // };

        this.singleDate = moment().add(1, 'day');
    }
    public daterangepickerOptions = {
        startDate: moment().add(2, 'day'),
        endDate: moment().add(3, 'day'),
        maxDate: new Date(),
        minDate: new Date(),
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,
    };
    public tourDaterangepickerOptions: any = {
        startDate: moment().add(1, 'day'),
        endDate: moment().add(2, 'day'),
        // startTourDate: moment().add(1, 'day'),
        // endTourDate: moment().add(2, 'day'),
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,
    };
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
     * This method is use to show selected date for tour
     * @param value 
     * @param dateInput 
     */
    public selectedTourDate(value: any, dateInput: any) {
        dateInput.start = value.start;
        this.startDate = this.pipe.transform(value.start, 'yyyy-MM-ddT00:00:00') + ".000Z";
        dateInput.end = value.end;
        this.endDate = this.pipe.transform(value.end, 'yyyy-MM-ddT00:00:00') + ".000Z";
    }


    /**
     * This method is use to apply date
     * @param value 
     * @param dateInput 
     */
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
    }
    public tourEventsHandler(e: any) {
        this.eventLog += '\nEvent Fired: ' + e.event.type;
        if (e.event.type == 'apply') {
            document.getElementById("dropdownMenuButton").click();
        }
    }

    /**
     * This method is use to change value of seat
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
     * this section is use for auto complete
     */
    loadTourList() {
        this.blockUI.start();
        let url = 'search-tour';
        if (this.tab == 2) {
            url = 'search-tour';
        } else if (this.tab == 3) {
            url = 'search-private-tour';
        }
        this.http.post(`${AppConfigConstants.baseUrl}public/tour/` + url + `?start=0&recordSize=`, {}).subscribe(response => {
            this.blockUI.stop();
            if (response['code'] >= 1000 && response['code'] < 2000) {
                // this.tourFilterDropdownList = response['list'];
                let list = [];
                for (let i = 0; i < response['records']; i++) {
                    if (response['list'][i].id) {
                        let data: any = {};
                        data.key = response['list'][i].id;
                        if (response['list'][i].name) {
                            data.value = response['list'][i].name;
                        }
                        list.push(data);
                    }
                }
                this.tourFilterDropdownList = list;
            } else if (response['code'] == 2006) {
                this.tourFilterDropdownList = [];
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
    /**
    * end of auto complete
    */

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
    onHotelInputCleared() {
        this.hotelDropdownList = [];
        for (let i = 0; i < this.hotelList.length; i++) {
            this.hotelDropdownList.push({ name: this.hotelList[i].name, id: this.hotelList[i].id, type: { 'key': 1, 'value': 'Hotel' }, total: 0 });
        }
        this.selectedHotel = {};
    }
    onTourInputCleared() {
        this.loadTourList();
    }
    /**
      * This section is use to check availability of hotel.
      */
    checkAvailability() {
        var tentHotelFlag = false;
        if (this.tab == 1) {
            tentHotelFlag = false;
        } else if (this.tab == 4) {
            tentHotelFlag = true;
        }
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
                            'children': this.childrenValue,
                            'tentHotel': tentHotelFlag,
                            'totalDestination': this.selectedHotel.total
                        }
                    });
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
                    startDate: moment(this.startDate).format('DD/MM/YYYY'),
                    endDate: moment(this.endDate).format('DD/MM/YYYY'),
                    numberOfRoom: this.roomValue,
                    numberOfAdults: this.adultsValue,
                    numberOfChildren: this.childrenValue
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
                                    'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                                    'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
                                    'rooms': this.roomValue,
                                    'adults': this.adultsValue,
                                    'children': this.childrenValue,
                                    'cityView': this.cityId,
                                    'area': this.area,
                                    'tentHotel': tentHotelFlag,
                                    'totalDestination': this.selectedHotel.total
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
                                    'check-in-date': moment(this.startDate).format('DD/MM/YYYY'),
                                    'check-out-date': moment(this.endDate).format('DD/MM/YYYY'),
                                    'rooms': this.roomValue,
                                    'adults': this.adultsValue,
                                    'children': this.childrenValue,
                                    'cityView': this.cityId,
                                    'area': this.area,
                                    'tentHotel': tentHotelFlag,
                                    'totalDestination': this.selectedHotel.total
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
    /**
      * This section is use to check availability of tour.
      */
    checkTourAvailability() {
        var privateTourFlag = false, url;
        if (this.tab == 2) {
            url = AppConfigConstants.baseUrl + 'public/tour/search-tour'
            privateTourFlag = false;
        } else if (this.tab == 3) {
            url = AppConfigConstants.baseUrl + 'public/tour/search-private-tour'
            privateTourFlag = true;
        }
        if (this.selectedTour != undefined && this.selectedTour.type != undefined) {
            if (this.tourFilterDropdownView != undefined) {
                let tourKey = '';
                let tourValue = '';
                if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.key != undefined) { tourKey = this.tourFilterDropdownView.key }
                if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.value != undefined) { tourValue = this.tourFilterDropdownView.value }
                this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + this.tourFilterDropdownView.key],
                    {
                        queryParams: {
                            'destination': this.selectedTour.name,
                            // 'monthAndYear': this.selectedDateAndMonth,
                            'tourFilterViewKey': tourKey,
                            'tourFilterViewValue': tourValue,
                            'tourLocationViewId': this.selectedTour.id,
                            'typeKey': this.selectedTour.type.key,
                            'typeValue': this.selectedTour.type.value,
                            'total': this.selectedTour.total,
                            'privateTourFlag': privateTourFlag
                        }
                    });
            } else if (this.tourFilterDropdownView == undefined) {

                this.blockUI.start();
                this.http.post(url + `?start=0&recordSize=10`, {
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
                                    'privateTourFlag': privateTourFlag

                                }
                            });
                    } else if (response['code'] == 2006) {
                        // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
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
                                    'privateTourFlag': privateTourFlag

                                }
                            });
                    } else {
                        this.toastr.error(response['message'], 'Error !');
                    }
                }, err => {
                    this.toastr.error(err['message'], 'Error !');
                });
            }
        } else if (this.tourFilterDropdownView != undefined) {
            let tourKey = '';
            let tourValue = '';
            if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.key != undefined) { tourKey = this.tourFilterDropdownView.key }
            if (this.tourFilterDropdownView != undefined && this.tourFilterDropdownView.value != undefined) { tourValue = this.tourFilterDropdownView.value }
            this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + this.tourFilterDropdownView.key],
                {
                    queryParams: {
                        'privateTourFlag': privateTourFlag
                    }
                    //     'destination': this.selectedTour.name,
                    //     // 'monthAndYear': this.selectedDateAndMonth,
                    //     'tourFilterViewKey': tourKey,
                    //     'tourFilterViewValue': tourValue,
                    //     'tourLocationViewId': this.selectedTour.id,
                    //     'typeKey': this.selectedTour.type.key,
                    //     'typeValue': this.selectedTour.type.value,
                    //     'total': this.selectedTour.total,
                    // }
                });
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
    onTourSelect(item: any) {
        this.selectedTour = item;
        if (this.isDestinationSelected) {
            // document.getElementById("tourDatePicker").click();
        }
        this.isDestinationSelected = true;
        if (item != undefined && item.id != undefined) {
            this.getFilterTour(item.id)
        }
    }

    onInputChangedEvent(val: string) {
        var tentHotelFlag = false;
        if (this.tab == 1) {
            tentHotelFlag = false;
        } else if (this.tab == 4) {
            tentHotelFlag = true;
        }
        this.inputChanged = val;
        if (val != '') {
            // this.blockUI.start();
            this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-param?searchParam=` + val + "&tentHotel=" + tentHotelFlag).subscribe(response => {
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
    onTourInputChangedEvent(val: string) {

        this.inputChanged = val;
        if (val != '') {
            // this.blockUI.start();
            this.http.get(`${AppConfigConstants.baseUrl}public/tour/search-tour-param?searchParam=` + val).subscribe(response => {
                if (response['code'] >= 1000 && response['code'] < 2000) {
                    this.tourDropdownList = response['list'];
                } else if (response['code'] == 2006) {

                } else {
                    this.toastr.error(response['message'], 'Error !');
                }
                // this.blockUI.stop();
            }, err => {
                this.toastr.error(err['message'], 'Error !');
            });
        }
    }

    search(term: string) {
        //   this.service.search(term).subscribe(e => this.wikiItems = e, error => console.log(error));
    }

    /**
     * This method is use to tab selection
     */
    selectTab(tab,tabname) {
        this.tab = tab;
        this.router.navigate(['/'],
            {
                queryParams: {
                    'search': tabname
                }
            });
    }

    /**
     * This method is use to go to hotel view page
     * @param hotel 
     */
    goToHoteViewPage(hotel) {
        var tentHotelFlag = false;
        if (this.tab == 1) {
            tentHotelFlag = false;
        } else if (this.tab == 4) {
            tentHotelFlag = true;
        }
        this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + hotel.id],
            {
                queryParams: {
                    'tentHotel': tentHotelFlag
                }
            });
    }
    /**
     * This method is use to go to tour view page
     * @param tour 
     */
    goToTourViewPage(tour) {
        let privateTour = false;
        if (this.tab == 3) {
            privateTour = true
        }
        this.router.navigate(['/' + AppUrlConstants.tourModule + AppUrlConstants.viewOpration + tour.id], {
            queryParams: {
                'privateTourFlag': privateTour
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
     * This method is use to get popular tour
     */
    getPopularTour() {
        this.isPopularTourFound = false;
        this.popularTourListBlockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}public/tour/popular-tour?start=0&recordSize=10`).subscribe(response => {
            if (response['code'] >= 1000 && response['code'] < 2000) {
                this.popularTourList = response['list'];
            } else if (response['code'] == 2006) {
                this.popularTourList = [];
            } else {
                this.toastr.error(response['message'], 'Error !');
            }
            this.isPopularTourFound = true;
            this.popularTourListBlockUI.stop();
        }, err => {
            this.isPopularTourFound = true;
            this.popularTourListBlockUI.stop();
            this.toastr.error(err['message'], 'Error !');
        });
    }
    /**
    * This method is use to get private tour
    */
    getPrivateTour() {
        this.isPopularTourFound = false;
        this.popularTourListBlockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}public/tour/private-tour?start=0&recordSize=10`).subscribe(response => {
            if (response['code'] >= 1000 && response['code'] < 2000) {
                this.privateTourList = response['list'];
            } else if (response['code'] == 2006) {
                this.privateTourList = [];
            } else {
                this.toastr.error(response['message'], 'Error !');
            }
            this.isPopularTourFound = true;
            this.popularTourListBlockUI.stop();
        }, err => {
            this.isPopularTourFound = true;
            this.popularTourListBlockUI.stop();
            this.toastr.error(err['message'], 'Error !');
        });
    }
    /**
     * This method is use to get popular tour
     */
    getTentHotel() {
        this.isTentHotelFound = false;
        this.tentHotelListBlockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-fair-festival?start=0&recordSize=10`, {}).subscribe(response => {
            if (response['code'] >= 1000 && response['code'] < 2000) {
                this.tentHotelList = response['list'];
            } else if (response['code'] == 2006) {
                this.tentHotelList = [];
            } else {
                this.toastr.error(response['message'], 'Error !');
            }
            this.isTentHotelFound = true;
            this.tentHotelListBlockUI.stop();
        }, err => {
            this.isTentHotelFound = true;
            this.tentHotelListBlockUI.stop();
            this.toastr.error(err['message'], 'Error !');
        });
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
    /**
     * This method is use to get popular tour
     */
    getFilterTour(id) {
        let url = 'public/tour/dropdown';
        if (this.tab == 2) {
            url = 'public/tour/dropdown';
        } else if (this.tab == 3) {
            url = 'public/tour/dropdown-private-tour';
        }
        this.isFilterTourFound = false;
        this.filterTourListBlockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}` + url + `?locationId=` + id).subscribe(response => {
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

    //Car
    loadCarLocationList() {
        this.blockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}public/car/dropdown-location`).subscribe(response => {
            this.blockUI.stop();
            if (response['code'] >= 1000 && response['code'] < 2000) {
                this.carLocationFilterDropdownList = response['list'];
            } else if (response['code'] == 2006) {
                this.carLocationFilterDropdownList = [];
            } else {
                this.toastr.error(response['message'], 'Error !');
            }
        }, err => {
            this.toastr.error(err.message, 'Error !');
        });
    }

    checkCarAvailability() {
        let body = {
            'carLocationView': this.carLocationFilterDropdownView
        };

        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}public/car/search-car` + `?start=0&recordSize=10`, body).subscribe(response => {
            this.blockUI.stop();
            if (response['code'] >= 1000 && response['code'] < 2000) {
                this.carList = response['list'];
            } else if (response['code'] == 2006) {
                // this.toaster.show('error', 'Error!', "Sorry, we couldn't find any matches.");
                this.carList = [];
            } else {
                this.toastr.error(response['message'], 'Error !');
            }
        }, err => {
            this.toastr.error(err['message'], 'Error !');
        });

    }

    goToPayment(car) {
        if (localStorage.getItem('currentCustomerUser') == undefined || localStorage.getItem('currentCustomerUser') == null) {
            this.toastr.error('Please login for book the car', 'Error !');
            document.getElementById("login").style.width = "100%";
            return;
        }
        this.router.navigateByUrl(AppUrlConstants.carModule + AppUrlConstants.carBookingModule + car.id);
    }

}