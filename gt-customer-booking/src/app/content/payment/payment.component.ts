import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as $ from 'jquery';
import { interval, Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
class PaymentInfo {
  public hotelView: any = {};
  public startDate: string = '';
  public endDate: string = '';
  public totalAmount: string = '';
  public netAmount: string = '';
  public totalRooms: number = null;
  public totalAdults: number = null;
  public totalChildren: number = null;
  public roomBookingViews: any = [];
  public roomTypeViews: any = [];
  public referenceNumber: any = [];
  public guestInformationViews: any = [];
  public guestInformationList: any = [];
  public seniorCitizenDiscount: string = '';
  public digitalPayDiscount: string = '';
  public extraAmount: string = '';
  public applicantView: any = {};
  constructor(view: any = {}) {
    this.hotelView = view.hotelView;
    this.startDate = view.startDate;
    this.endDate = view.endDate;
    this.totalAmount = view.totalAmount;
    this.netAmount = view.netAmount;
    this.totalRooms = view.totalRooms;
    this.totalAdults = view.totalAdults;
    this.totalChildren = view.totalChildren;
    this.roomBookingViews = view.roomBookingViews;
    this.referenceNumber = view.referenceNumber;
    this.roomTypeViews = view.roomTypeViews;
    this.guestInformationViews = view.guestInformationViews;
    this.guestInformationList = view.guestInformationList;
    this.seniorCitizenDiscount = view.seniorCitizenDiscount;
    this.digitalPayDiscount = view.digitalPayDiscount;
    this.extraAmount = view.extraAmount;
    this.applicantView = view.applicantView;
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
class genderView {
  public key: string = '';
  public value: string = '';
  constructor(view: any = {}) {
    this.key = view.key;
    this.value = view.value;
  }
}
class applicantView {
  public name: string = '';
  public email: string = '';
  public mobile: string = '';
  public countryCode: any = {};
  public address: string = '';
  public landmark: string = '';
  public countryView: string = '';
  public stateView: string = '';
  public stateName: string = '';
  public cityView: any = {};
  public cityName: string = '';
  public pincode: string = '';
  public termsAndConditions: string = '';
  public paymentMode:any = {};
  public remarks:string = '';
  constructor(view: any = {}) {
    this.name = view.name;
    this.email = view.email;
    this.mobile = view.mobile;
    this.countryCode = view.countryCode;
    this.address = view.address;
    this.landmark = view.landmark;
    this.countryView = view.countryView;
    this.stateView = view.stateView;
    this.stateName = view.stateName;
    this.cityView = view.cityView;
    this.cityName = view.cityName;
    this.pincode = view.pincode;
    this.termsAndConditions = view.termsAndConditions;
     this.paymentMode = view.paymentMode;
    this.remarks = view.remarks;
  }
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  accordionId = '';
  subAccordionId = '';
  subscription: Subscription;
  @BlockUI() blockUI: NgBlockUI
  paymentInfo;
  seniorCitizenNumber: number = 0;
  isFormSubmitted: boolean = false;
  guestInformationViews = [];
  applicantForm: any;
  applicantModel: any = new applicantView();
  seniorCitizenList = [{ id: true, value: 'Yes' }, { id: false, value: 'No' }]
  childAgeList = [{ key: 0, value: 0 }, { key: 1, value: 1 }, { key: 2, value: 2 }, { key: 3, value: 3 }, { key: 4, value: 4 }, { key: 5, value: 5 }, { key: 6, value: 6 }, { key: 7, value: 7 }, { key: 8, value: 8 }, { key: 9, value: 9 }, { key: 10, value: 10 }, { key: 11, value: 11 }, { key: 12, value: 12 }]
  countryViews = [];
  stateViews = [];
  cityViews = [];
  genderList = [{ key: 1, value: 'Male' }, { key: 2, value: 'Female' }];
  ageList = [];
  otherGuestInfoAgeList = [];
  hotelImageDownload = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelImage;

  termsUrl = '/' + AppUrlConstants.termsAndConditionUrl;

  bookingOfficer = false;
  paymentModes = [{ key: 1, value: "Cash" }, { key: 2, value: "Card" }, { key: 3, value: "Cheque" }, { key: 4, value: "Bank Transfer" }, { key: 5, value: "Other" }];
  paymentMode;
  remarks;


  @Input() required: boolean;
  constructor(
    private appComponent: AppComponent,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.applicantForm = this.formBuilder.group({
      id: new FormControl(null, []),
      name: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z ]$/), Validators.maxLength(100)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/), Validators.maxLength(100)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      landmark: new FormControl('', [Validators.maxLength(1000)]),
      countryView: new FormControl(null, []),
      stateView: new FormControl(null, []),
      cityView: new FormControl(null, []),
      stateName: new FormControl('', [Validators.maxLength(100)]),
      cityName: new FormControl('', [Validators.maxLength(100)]),
      pincode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}\d*$/), Validators.maxLength(6)]),
      termsAndConditions: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('', []),
      remarks: new FormControl('', []),
    });
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.paymentInfo = new PaymentInfo(this.route.snapshot.data['resolveValue']['view']);
        if (this.paymentInfo.applicantView != undefined) {
          if (this.paymentInfo.applicantView.countryView == undefined) {
            this.paymentInfo.applicantView.countryView = { value: "India", key: 96 };
          }
          if (this.paymentInfo.applicantView.countryView != undefined) {
            this.findState(this.paymentInfo.applicantView.countryView);
          }
          if (this.paymentInfo.applicantView.stateView != undefined) {
            this.findCity(this.paymentInfo.applicantView.stateView);
          }
          this.applicantModel = new applicantView(this.paymentInfo.applicantView);
          if (this.paymentInfo.applicantView.name != undefined && this.paymentInfo.applicantView.email != undefined && this.paymentInfo.applicantView.mobile != undefined) {
            this.applicantForm.disable();
            this.applicantForm.controls.termsAndConditions.enable();
          }
        }
        this.applicantModel.termsAndConditions = true;
        this.accordionId = this.paymentInfo.roomBookingViews[0].id + '0'
        this.bookingMemberDetail(parseInt(this.paymentInfo.totalAdults) + parseInt(this.paymentInfo.totalChildren));
        if (this.paymentInfo.roomBookingViews != undefined) {
          this.paymentInfo.guestInformationList = []
          this.paymentInfo.roomBookingViews.forEach(element => {
            element.guestInformationViews = [];
            for (let j = 0; j < element.rooms; j++) {
              let tempJson: any = {};
              tempJson.guestInformationViews = [];
              let tempGuestInfoJson: any = {}
              tempGuestInfoJson.totalAdultList = [];
              tempGuestInfoJson.totalChildrenList = [];
              for (let i = 0; i < (element.roomTypeView.maxGuestCapacity); i++) {
                tempGuestInfoJson.totalAdultList.push({ key: i + 1, value: i + 1 });
                tempGuestInfoJson.totalChildrenList.push({ key: i, value: i });
              }
              element.guestInformationViews.push(new guestInformation(tempGuestInfoJson));
            }
            // this.paymentInfo.guestInformationList.push(element);
            // element.roomBookingViews.forEach(roomBookingView => {
            // });
          });
        }
        console.log(this.paymentInfo)
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.paymentInfo = new PaymentInfo({});
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
  }
  get f() { return this.applicantForm.controls; }
  ngOnInit() {
    this.ageList = [];
    for (let i = 0; i < 103; i++) {
      this.ageList.push({ key: i, value: i + 18 })
    }
    this.otherGuestInfoAgeList = [];
    for (let i = 0; i < 120; i++) {
      this.otherGuestInfoAgeList.push({ key: i, value: i })
    }
    this.getGenderList();
    this.loadCountries();
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
  }
  bookingMemberDetail(totalMember: number) {
    for (let i = 0; i < totalMember; i++) {
      this.guestInformationViews.push(new guestInformation());
    }
  }
  getGstAmount(tax, amount) {
    let total = 0;
    if (tax.igstTax != undefined) {
      total = (amount * parseInt(tax.igstTax)) / 100;
    } else if (tax.cgstTax != undefined && tax.sgstTax != undefined) {
      total = (amount * (parseInt(tax.cgstTax) + parseInt(tax.sgstTax))) / 100;
    }
    return total;
  }
  setOtherGuestInfo(guestInformation, roomView) {
    // this.subAccordionId = roomView.id+''+0+''+0;
    if (guestInformation.totalAdult != undefined && guestInformation.totalChildren != undefined) {
      guestInformation.otherGuestInformationViews = [];
      for (let i = 0; i < (guestInformation.totalAdult.value + guestInformation.totalChildren.value) - 1; i++) {
        var tempView: any = {};
        guestInformation.otherGuestInformationViews.push(tempView)
      }
    } else {
      guestInformation.otherGuestInformationViews = [];
    }
  }
  openCloseAccordion(id) {
    for (let i = 0; i < document.getElementsByClassName('getId').length; i++) {
      $('#collapse' + document.getElementsByClassName('getId')[i].id).removeClass('overflow-visible')
      let newHeight = $('#collapse' + document.getElementsByClassName('getId')[i].id).height();
      if (newHeight > 0) {
        this.closeAccordion(document.getElementsByClassName('getId')[i].id)
      }
    }
    console.log(this['isIternityAccordionOpen' + id])
    if (this['isIternityAccordionOpen' + id] == undefined || this['isIternityAccordionOpen' + id] == false) {
      this.openAccordion(id);
    } else {
      this.closeAccordion(id);
    }
  }
  openAccordion(id) {
    let oldHeight = 20;
    let newHeight = 0;
    $('#heading' + id).removeClass('collapsed')
    $('#collapse' + id).removeClass('collapse')
    $('#collapse' + id).removeClass('display-none')
    $('#collapse' + id).addClass('collapsing')
    let interval1 = setInterval(function () {
      oldHeight = $('#subCollapse' + id).height();
      if (newHeight <= oldHeight) {
        newHeight += 10
      } else {
        // $('#collapse'+id).removeClass('collapsing')
        // $('#collapse'+id).addClass('collapse')
        // $('#collapse'+id).addClass('show')
        // setInterval(function () {
        // }, 100);
        $('#collapse' + id).addClass('overflow-visible')
        clearInterval(interval1);
      }
      $('#collapse' + id).height(newHeight)
    }, 10);
    $('#faFaIcon' + id).removeClass("fa-angle-down").addClass("fa-angle-up");
    this['isIternityAccordionOpen' + id] = true;
  }
  closeAccordion(id) {
    let newHeight = $('#subCollapse' + id).height();
    $('#heading' + id).addClass('collapsed')
    $('#collapse' + id).removeClass('collapse')
    $('#collapse' + id).addClass('collapsing')
    let interval = setInterval(function () {
      if (newHeight >= 0) {
        newHeight -= 10
      } else {
        // $('#collapse'+id).removeClass('collapsing')
        // $('#collapse'+id).removeClass('show')
        // $('#collapse'+id).addClass('collapse')
        clearInterval(interval);
      }
      $('#collapse' + id).height(newHeight)
    }, 5);
    $('#faFaIcon' + id).removeClass("fa-angle-up").addClass("fa-angle-down");
    this['isIternityAccordionOpen' + id] = false;
  }
  onChangeSeniorCitizen(view, info) {
    if (info.name != undefined && info.gender != undefined && info.age != undefined) {
      // this.paymentInfo.guestInformationViews = [];
      // this.paymentInfo.roomBookingViews.forEach(element => {
      //   element.guestInformationViews.forEach(guestInformation => {
      //     if (guestInformation.name != undefined && guestInformation.gender != undefined) {
      //       if (guestInformation.seniorCitizen == undefined) {
      //         // guestInformation.seniorCitizen = false;
      //       }
      //     }
      //   });
      // });
      this.blockUI.start();
      this.http.post(`${AppConfigConstants.baseUrl}private/hotel-booking/booking-calculation`, this.paymentInfo).subscribe(response => {
        if (response['code'] >= 1000 && response['code'] < 2000) {
          this.paymentInfo.roomBookingViews.forEach(paymentInfo => {
            response['view'].roomTypeViews.forEach(roomType => {

              if (paymentInfo.roomTypeView.id == roomType.id) {
                if (roomType.cgstAmount != undefined && roomType.taxationView.cgstTax != undefined) {
                  paymentInfo.cgstAmount = roomType.cgstAmount;
                  paymentInfo.taxationView.cgstTax = roomType.taxationView.cgstTax;
                }
                if (roomType.sgstAmount != undefined && roomType.taxationView.sgstTax != undefined) {
                  paymentInfo.sgstAmount = roomType.sgstAmount;
                  paymentInfo.taxationView.sgstTax = roomType.taxationView.sgstTax;
                }
                if (roomType.igstAmount != undefined && roomType.taxationView.igstTax != undefined) {
                  paymentInfo.igstAmount = roomType.igstAmount;
                  paymentInfo.taxationView.igstTax = roomType.taxationView.igstTax;
                }
                if (roomType.seniorCitizenDiscount != undefined && roomType.seniorCitizenDiscountPercentage != undefined) {
                  paymentInfo.seniorCitizenDiscountPercentage = roomType.seniorCitizenDiscountPercentage;
                  paymentInfo.seniorCitizenDiscount = roomType.seniorCitizenDiscount;
                }
                if (roomType.digitalPayDiscount != undefined && roomType.digitalPayDiscountPercentage != undefined) {
                  paymentInfo.digitalPayDiscountPercentage = roomType.digitalPayDiscountPercentage;
                  paymentInfo.digitalPayDiscount = roomType.digitalPayDiscount;
                }
                if (roomType.extraAmount != undefined) {
                  paymentInfo.extraAmount = roomType.extraAmount;
                }
                paymentInfo.bookingTaxViews = roomType.bookingTaxViews;
                paymentInfo.netAmount = roomType.netAmount;
                paymentInfo.totalAmount = roomType.totalAmount;
                paymentInfo.roomCharges = roomType.roomCharges;
                paymentInfo.roomTypeChargesView = roomType.roomTypeChargesView;
              }
              this.paymentInfo.netAmount = response['view'].netAmount;
              this.paymentInfo.totalAmount = response['view'].totalAmount;
              this.paymentInfo.extraAmount = response['view'].extraAmount;
            });
          });
        } else if (response['code'] == 2006) {
          // info.seniorCitizen = false;
        } else {
          // info.seniorCitizen = false;
          this.toastr.error(response['message'], 'Error !');
        }
        this.blockUI.stop();
      }, err => {
        this.toastr.error(err['message'], 'Error !');
      });
    } else {
      // info.seniorCitizen = false;
      // this.toastr.error("Please provide other details", 'Error !');
    }
    // this.seniorCitizenNumber = 0; 
    // this.paymentInfo.roomTypeViews.forEach(roomTypeView => {
    //   roomTypeView.seniorCitizenCount = 0;
    //   roomTypeView.roomBookingViews.forEach(roomBookingView => {
    //     roomBookingView.guestInformationViews.forEach(guestInformationView => {
    //       if(guestInformationView.seniorCitizen){
    //         if(guestInformationView.name != undefined &&guestInformationView.gender!= undefined && guestInformationView.age != undefined){
    //           roomTypeView.seniorCitizenCount += 1;
    //         }else{
    //           guestInformationView.seniorCitizen = !guestInformationView.seniorCitizen;
    //           this.toaster.show('error', 'Error!', "Please provide other details"); 
    //         }
    //       }
    //     });
    //   });
    // });

  }


  /**
   * This method is used to load countries for dropdown.
   */
  loadCountries() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}/public/country/all`, httpOptions).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.countryViews = response['list'];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load states for dropdown.
   */
  findState(value) {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}/public/state/all?countryId=` + value.key, httpOptions).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.stateViews = response['list'];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load cities for dropdown.
   */
  findCity(value) {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}/public/city/all?stateId=` + value.key, httpOptions).subscribe(response => {
      this.blockUI.stop();
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.cityViews = response['list'];
      } else {
        this.toastr.error(response['message'], 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

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
    this.accordionId = this.paymentInfo.roomBookingViews[0].id + '0';
    if (roomView.rooms == (i + 1)) {
      this.paymentInfo.roomBookingViews.forEach((element, key) => {
        if (element == roomView) {
          this.accordionId = this.paymentInfo.roomBookingViews[key + 1].id + '' + 0;
        }
      });
    } else {
      this.accordionId = roomView.id + '' + (i + 1);
    }
    console.log(this.paymentInfo.roomBookingViews)
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
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  redirectToPayment(formId) {
    this.isFormSubmitted = true;
    if (this.applicantForm.invalid) {
      this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const source = interval(100);
    this.subscription = source.subscribe(val => {
      if ($("#guestInformationId .form-invalid").length != 0) {
        this.appComponent.autoFocusOnErrorField('guestInformationId');
        this.subscription.unsubscribe();
        return;
      }

      if (this.applicantModel.termsAndConditions) {
        this.blockUI.start();
        this.paymentInfo.applicantView = this.applicantModel;
        this.paymentInfo.paymentMode = this.applicantModel.paymentMode;
        this.paymentInfo.remarks = this.applicantModel.remarks;
        this.http.put(`${AppConfigConstants.baseUrl}private/hotel-booking/save-guest-information`, this.paymentInfo).subscribe(response => {
          if (response['code'] >= 1000 && response['code'] < 2000) {
            if (response['code'] == 1046) {
              this.router.navigateByUrl(AppUrlConstants.successPaymentModule + this.paymentInfo.referenceNumber);
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
  getGenderList() {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/hotel-booking/dropdown-gender`).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        this.genderList = response['list'];
      } else if (response['code'] == 2006) {

      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
  }
  onChangeChildren(guestInformation) {
    guestInformation.childAge = [];
    for (let i = 0; i < guestInformation.totalChildren.key; i++) {
      guestInformation.childAge.push({ key: 6, value: 6 })
    }
  }
  getTotalChildrenList(guestInformation, roomBooking) {
    delete guestInformation.totalChildren;
    guestInformation.totalChildrenList = [];
    if (guestInformation.totalAdult != undefined && guestInformation.totalAdult != null) {
      for (let i = 0; i <= (roomBooking.roomTypeView.maxGuestCapacity - guestInformation.totalAdult.key); i++) {
        guestInformation.totalChildrenList.push({ key: i, value: i });
      }
    } else {
      for (let i = 0; i <= roomBooking.roomTypeView.maxGuestCapacity; i++) {
        guestInformation.totalChildrenList.push({ key: i, value: i });
      }
    }
  }
  setSeniorCitizen(guestInformation){
    if(guestInformation.age >= 60){
      guestInformation.seniorCitizen = true;
    }else{
      guestInformation.seniorCitizen = false;
    }
  }
}