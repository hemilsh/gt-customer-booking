import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as $ from 'jquery';
import { interval, Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CarBookingModel } from '../car-booking.class';
import * as moment from "moment";
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '/';

  fromModel(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return result;
  }

  toModel(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      result = ((date.day <= 9) ? '0' + date.day : date.day) + this.DELIMITER +
        (date.month <= 9 ? '0' + date.month : date.month) + this.DELIMITER + date.year;
    }
    return result;
  }
}
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      result = ((date.day <= 9) ? '0' + date.day : date.day) + this.DELIMITER +
        (date.month <= 9 ? '0' + date.month : date.month) + this.DELIMITER + date.year;
    }
    return result;
  }
}
@Component({
  selector: 'app-car-payment',
  templateUrl: './carpayment.component.html',
  styleUrls: ['./carpayment.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class CarPaymentComponent implements OnInit {
  accordionId = '';
  subAccordionId = '';
  subscription: Subscription;
  @BlockUI() blockUI: NgBlockUI
  carBookingModel: CarBookingModel = new CarBookingModel({});
  isFormSubmitted: boolean = false;
  termsUrl = '/' + AppUrlConstants.termsAndConditionUrl;
  bookingForm: any;
  bookingOfficer = false;
  paymentModes = [{ key: 1, value: "Cash" }, { key: 2, value: "Card" }, { key: 3, value: "Cheque" }, { key: 4, value: "Bank Transfer" }, { key: 5, value: "Other" }];
  newDate = new Date();
  maxDate: NgbDateStruct = { year: 2020, month: 1, day: 5 };
  minDate: NgbDateStruct = { year: 2020, month: 1, day: 1 };
  @Input() required: boolean;
  constructor(
    private appComponent: AppComponent,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.bookingForm = this.formBuilder.group({
      id: new FormControl(null, []),
      termsAndConditions: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z ]$/), Validators.maxLength(100)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/), Validators.maxLength(100)]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', []),
      kilometers: new FormControl(null, []),
      hours: new FormControl(null, []),
      cars: new FormControl(null, [Validators.required]),
      paymentModeTBI: new FormControl('', []),
      remarks: new FormControl('', []),
    });
    // this.maxDate = { year: 2020, month: 1, day: 15 };
    // this.minDate = { year: 2020, month: 1, day: 10 };
    this.carBookingModel.termsAndConditions = true;
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.carBookingModel = new CarBookingModel();
        this.carBookingModel.carView = this.route.snapshot.data['resolveValue']['view'];
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.carBookingModel = new CarBookingModel({});
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
      this.carBookingModel.termsAndConditions = true;
      // this.calculateAmount(this.carBookingModel);
    }
  }

  get f() { return this.bookingForm.controls; }

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
    this.loadConfiguration();
  }

  loadConfiguration() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}public/car/search-configuration`).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        for (let j = 0; j < response['list'].length; j++) {
          if (response['list'][j].key == 'CAR_KILOMETER_MINIMUM_LIMIT') {
            this.carBookingModel.kilometers = response['list'][j].value;
          }
          if (response['list'][j].key == 'CAR_SEARCH_START_DATE') {
            let date = moment(response['list'][j].value);
            this.minDate = { year: date.year(), month: (date.month() + 1), day: date.day() };
          }
          if (response['list'][j].key == 'CAR_SEARCH_END_DATE') {
            let date = moment(response['list'][j].value);
            this.maxDate = { year: date.year(), month: (date.month() + 1), day: date.day() };
          }
        }
      }
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
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
      });
    });
    if (totalError == 0) {
      return false;
    } else {
      return true;
    }
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  calculateAmount(carBookingModel) {
    let body = this.carBookingModel;
    // if (this.carBookingModel.startDate != undefined) {
    //   let startDate;
    //   startDate = this.carBookingModel.startDate;
    //   var tamp = startDate.split('/');
    //   tamp[0] = ((tamp[0] <= 9) && !tamp[0].includes('0') ? '0' + tamp[0] : tamp[0]);
    //   tamp[1] = ((tamp[1] <= 9) && !tamp[1].includes('0') ? '0' + tamp[1] : tamp[1]);
    //   this.carBookingModel.startDate = startDate;
    // }
    // if (this.carBookingModel.endDate != undefined) {
    //   let endDate;
    //   endDate = this.carBookingModel.endDate;
    //   var tamp1 = endDate.split('/');
    //   tamp1[0] = ((tamp1[0] <= 9) && !tamp1[0].includes('0') ? '0' + tamp1[0] : tamp1[0]);
    //   tamp1[1] = ((tamp1[1] <= 9) && !tamp1[1].includes('0') ? '0' + tamp1[1] : tamp1[1]);
    //   this.carBookingModel.endDate = endDate;
    // }
    this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/booking-calculation`, body).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.carBookingModel = response['view'];
        if (this.carBookingModel.startDate != undefined) {
          this.carBookingModel.startDate = this.carBookingModel.startDate;
        }
        if (this.carBookingModel.endDate != undefined) {
          this.carBookingModel.endDate = this.carBookingModel.endDate;
        }
        this.carBookingModel.termsAndConditions = true;
      } else {
        this.carBookingModel = new CarBookingModel({});
      }
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err['message'], 'Error !');
    });
  }

  redirectToPayment(formId) {
    this.isFormSubmitted = true;
    if (this.bookingForm.invalid) {
      this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const source = interval(100);
    this.subscription = source.subscribe(val => {
      if (this.carBookingModel.termsAndConditions) {
        this.blockUI.start();
        // let startDate;
        // startDate = this.carBookingModel.startDate;
        // var tamp = startDate.split('/');
        // tamp[0] = ((tamp[0] <= 9) && !tamp[0].includes('0') ? '0' + tamp[0] : tamp[0]);
        // tamp[1] = ((tamp[1] <= 9) && !tamp[1].includes('0') ? '0' + tamp[1] : tamp[1]);
        // this.carBookingModel.startDate = startDate;
        // let endDate;
        // endDate = this.carBookingModel.endDate;
        // var tamp1 = endDate.split('/');
        // tamp1[0] = ((tamp1[0] <= 9) && !tamp1[0].includes('0') ? '0' + tamp1[0] : tamp1[0]);
        // tamp1[1] = ((tamp1[1] <= 9) && !tamp1[1].includes('0') ? '0' + tamp1[1] : tamp1[1]);
        // this.carBookingModel.endDate = endDate;
        this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/book`, this.carBookingModel).subscribe(response => {
          if (response['code'] >= 1000 && response['code'] < 2000) {
            this.carBookingModel = response['view'];
            if (response['code'] == 1046) {
              this.router.navigate(["/" + AppUrlConstants.carModule + "/" + AppUrlConstants.carSuccessPaymentModule + this.carBookingModel.referenceNumber]);
            } else {
              window.location.href = environment.paymentGatewayUrl +
                '&merchant_id=' + response['view'].merchatId + '&encRequest='
                + response['view'].orderURL + '&access_code=' + response['view'].accessCode + '&order_id=' + response['view'].referenceNumber
                + '&amount=' + response['view'].totalAmount;
            }
          } else if (response['code'] == 2006) {

          } else {
            this.toastr.error(response['message'], 'Error !');
          }
          this.blockUI.stop();
        }, err => {
          this.blockUI.stop();
          this.toastr.error(err['message'], 'Error !');
        });
      } else {
        this.toastr.error("Please accept Terms And Conditions", 'Error !');
      }
      this.subscription.unsubscribe();
    });

  }
  changeCars(isPluseOrMinus) {
    if (isPluseOrMinus == 0) {
      this.carBookingModel.cars -= 1;
    } else if (isPluseOrMinus == 1) {
      this.carBookingModel.cars += 1;
    }
  }
}