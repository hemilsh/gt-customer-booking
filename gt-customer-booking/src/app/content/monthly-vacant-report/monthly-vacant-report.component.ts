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
import { kill } from 'process';
declare var moment: any;

@Component({
  selector: 'app-monthly-vacant-report',
  templateUrl: './monthly-vacant-report.component.html',
  styleUrls: ['./monthly-vacant-report.component.scss']
})
export class MonthlyVacantReportComponent implements OnInit {
  monthView;
  hotelView;
  yearView;
  yearList = [];
  selectedDate;
  monthList = [{ key: 1, value: 'January' }, { key: 2, value: 'February' }, { key: 3, value: 'March' }, { key: 4, value: 'April' }, { key: 5, value: 'May' }, { key: 6, value: 'June' }, { key: 7, value: 'July' }, { key: 8, value: 'August' }, { key: 9, value: 'September' }, { key: 10, value: 'October' }, { key: 11, value: 'November' }, { key: 12, value: 'December' }];
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('checkAvailabilityBtn') checkAvailabilityBtnBlockUI: NgBlockUI
  hotelList: any = [];
  isMonthlyVacantReportDisplay = false;
  @ViewChild('nav', { static: false }) ds: NgImageSliderComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private customCalenderService: DataService,
    private vps: ViewportScroller
  ) {
    this.customCalenderService.monthlyVacantReportSelectedDateMessage.subscribe(message => {
      if (message != '') {
        this.selectedDate = message['mDate'];
        if(!message['first']){
          this.vps.scrollToAnchor('bookHotelId');
        }
        // this.selectedTourPrice = message['price'];
      }
    });
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.hotelList = this.route.snapshot.data['resolveValue']['list'];
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.hotelList = [];
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
  }

  ngOnInit() {
    this.checkYearValidity();
  }

  /**
   * This Method is use to rediract to hotel view page with selected hotel and date
   */
  goToView(){
    var roomValue = [{
      id: 1, adultsValue: 2, childrenValue: 0, childrenAgeList: []
  }];
    localStorage.setItem('roomsAndGuestsInfo', JSON.stringify(roomValue));
    this.router.navigate(['/' + AppUrlConstants.hotelModule + AppUrlConstants.viewOpration + this.hotelView.id],
    {
        queryParams: {
            'destination': this.hotelView.name,
            'check-in-date': moment(this.selectedDate).format('YYYY/MM/DD'),
            'check-out-date': moment(this.selectedDate).add(1, 'day').format('YYYY/MM/DD'),
            'rooms': 1,
            'adults': 2,
            'children': 0
        }
    });
  }
  /**
  * This section is use to check availability of tour.
  */
  checkAvailability() {
    if (this.hotelView == undefined) { this.toastr.error("Please enter hotel", 'Error !'); return; }
    if (this.monthView == undefined) { this.toastr.error("Please enter month", 'Error !'); return; }
    if (this.yearView == undefined) { this.toastr.error("Please enter year", 'Error !'); return; }
    this.checkAvailabilityBtnBlockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-month-report?hotelId=` + this.hotelView.id + `&month=` + this.monthView.key + `&year=` + this.yearView.value).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.isMonthlyVacantReportDisplay = true;
        var monthlyVacantReportList = [];
        response['list'][0].hotelInventoryViews.forEach(element => {
          var tempJson:any = {}; 
          tempJson.date = element.inventoryDate;
          tempJson.roomTypeList = [];
          monthlyVacantReportList.push(tempJson);
        });
        response['list'].forEach(element => {
          element.hotelInventoryViews.forEach(hotelInventoryView => {
            var tempJson:any = {}; 
            tempJson.name = element.name;
            tempJson.totalRoom = hotelInventoryView.totalRoom;
            tempJson.availableRoom = hotelInventoryView.availableRoom;
            monthlyVacantReportList.forEach(monthlyVacantReport => {
              if(monthlyVacantReport.date == hotelInventoryView.inventoryDate){
                monthlyVacantReport.roomTypeList.push(tempJson)
              }
              });
            });
        });
        this.customCalenderService.changeCustomCalendar(monthlyVacantReportList)
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.checkAvailabilityBtnBlockUI.stop();
    }, err => {
      this.checkAvailabilityBtnBlockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });


  }
  checkYearValidity() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/hotel/search-hotel-configuration`).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        var tempYearList = [];
        response['list'].forEach(element => {
          if(element.key == 'HOTEL_SEARCH_END_DATE'){
            var currentYear = new Date(element.value).getFullYear();
            for (let i = 0; i < 51; i++) {
              if (currentYear >= 2020) {
                tempYearList.push({ key: i + 1, value: currentYear })
              }
              currentYear--;
            }
          }
        });
        this.yearList = tempYearList;
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });


  }

}