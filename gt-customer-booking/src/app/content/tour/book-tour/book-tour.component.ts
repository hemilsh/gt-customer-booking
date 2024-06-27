import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
class PaymentInfo {
  public tourView: any = {};
  public netAmount: string = '';
  public referenceNumber: string = '';
  public totalAmount: string = '';
  public totalSeats: string = '';
  public tourGuestInformationViews: any = [];
  public seniorCitizenDiscount: string = '';
  public cgstAmount: string = '';
  public cgstTax: string = '';
  public sgstAmount: string = '';
  public sgstTax: string = '';
  public igstAmount: string = '';
  public igstTax: string = '';
  public seniorCitizenDiscountAmount: string = '';
  public childAmount:string ="";
  public adultAmount:string="";
  constructor(view: any = {}) {
    this.tourView = view.tourView;
    this.totalSeats = view.totalSeats;
    this.referenceNumber = view.referenceNumber;
    this.totalAmount = view.totalAmount;
    this.netAmount = view.netAmount;
    this.tourGuestInformationViews = view.tourGuestInformationViews;
    this.seniorCitizenDiscount = view.seniorCitizenDiscount;
    this.cgstAmount = view.cgstAmount;
    this.cgstTax = view.cgstTax;
    this.sgstAmount = view.sgstAmount;
    this.sgstTax = view.sgstTax;
    this.igstAmount = view.igstAmount;
    this.igstTax = view.igstTax;
    this.seniorCitizenDiscountAmount = view.seniorCitizenDiscountAmount;
    this.childAmount = view.childAmount;
    this.adultAmount = view.adultAmount;
  }
}
class guestInformation {
  public name: string = '';
  public gender: genderView = new genderView();
  public age: string = '';
  public seniorCitizen: boolean = null;
  constructor(view: any = {}) {
    this.name = view.name;
    this.gender = view.gender;
    this.age = view.age;
    this.seniorCitizen = view.seniorCitizen;
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
  public paymentMode:any = {};
  public remarks:string = '';
  constructor(view: any = {}) {
     this.paymentMode = view.paymentMode;
    this.remarks = view.remarks;
  }
}

@Component({
  selector: 'app-book-tour',
  templateUrl: './book-tour.component.html',
  styleUrls: ['./book-tour.component.scss']
})
export class BookTourComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('bookTourBtn') bookTourBtnBlockUI: NgBlockUI
  paymentInfo;
  public tourImgDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadTourImage;
  termsAndConditions: boolean = true;
  tourGuestInformationViews = [];
  seniorCitizenDiscountCount = 0;
  countryCodes = [{ id: 1, value: 'tst' }, { id: 2, value: 'tst' }, { id: 3, value: 'tst' }]
  genderList = [{ key: 1, value: 'Male' }, { key: 2, value: 'Female' }]

  termsUrl = '/' + AppUrlConstants.termsAndConditionUrl;

  isFormSubmitted: boolean = false;
  ageList = [];
  seniorCitizenList = [{ id: true, value: 'Yes' }, { id: false, value: 'No' }]
  applicantForm: any;

  bookingOfficer = false;
  paymentModes = [{ key: 1, value: "Cash" }, { key: 2, value: "Card" }, { key: 3, value: "Cheque" }, { key: 4, value: "Bank Transfer" }, { key: 5, value: "Other" }];
  paymentMode;
  remarks;
  applicantModel: any = new applicantView();


  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService, private router:Router,
    private formBuilder: FormBuilder, private appComponent: AppComponent) {
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.paymentInfo = new PaymentInfo(this.route.snapshot.data['resolveValue']['view']);
        if (this.paymentInfo.seniorCitizenDiscountAmount == undefined) {
          this.paymentInfo.seniorCitizenDiscountAmount = 0.00;
        }
        this.bookingMemberDetail(parseInt(this.paymentInfo.totalAdults) + parseInt(this.paymentInfo.totalChildren));
        if (this.paymentInfo.tourGuestInformationViews != undefined && this.paymentInfo.tourGuestInformationViews.length == 0) {
          this.paymentInfo.tourGuestInformationViews = [];
          for (let i = 0; i < (this.paymentInfo.totalSeats); i++) {
            this.paymentInfo.tourGuestInformationViews.push(new guestInformation({}));
          }
        } else {
          this.paymentInfo.tourGuestInformationViews.forEach(tourGuestInformationView => {
            if (tourGuestInformationView.seniorCitizen) {
              this.seniorCitizenDiscountCount += 1;
            }
          });
        }
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.paymentInfo = new PaymentInfo({});
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
    this.applicantForm = this.formBuilder.group({
      id: new FormControl(null, []),
      termsAndConditions: new FormControl('', [Validators.required]),
      paymentMode: new FormControl('', []),
      remarks: new FormControl('', []),
    });
    this.termsAndConditions = true;

  }

  get f() { return this.applicantForm.controls; }

  ngOnInit() {
    this.ageList = [];
    for (let i = 0; i < 120; i++) {
      this.ageList.push({ key: i, value: i })
    }
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
    // window.addEventListener('scroll', this.scroll, true);
    // this.getGenderList();
  }
  scroll = (event): void => {
    console.log(event)
    //handle your scroll here
    //notice the 'odd' function assignment to a class field
    //this is used to be able to remove the event listener
  };
  bookingMemberDetail(totalMember: number) {
    for (let i = 0; i < totalMember; i++) {
      this.tourGuestInformationViews.push(new guestInformation());
    }
  }


  changeSeniorCitizenDiscount() {

    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/booking-calculation`, {
      "referenceNumber": this.route.snapshot.paramMap.get('referenceNumber'), "tourGuestInformationViews": this.paymentInfo.tourGuestInformationViews
    }).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        if (response['view'].cgstAmount != undefined && response['view'].cgstTax != undefined) {
          this.paymentInfo.cgstAmount = response['view'].cgstAmount;
          this.paymentInfo.cgstTax = response['view'].cgstTax;
        }
        if (response['view'].sgstAmount != undefined && response['view'].sgstTax != undefined) {
          this.paymentInfo.sgstAmount = response['view'].sgstAmount;
          this.paymentInfo.sgstTax = response['view'].sgstTax;
        }
        if (response['view'].igstAmount != undefined && response['view'].igstTax != undefined) {
          this.paymentInfo.igstAmount = response['view'].igstAmount;
          this.paymentInfo.igstTax = response['view'].igstTax;
        }
        if (response['view'].seniorCitizenDiscount != undefined && response['view'].seniorCitizenDiscountAmount != undefined) {
          this.paymentInfo.seniorCitizenDiscount = response['view'].seniorCitizenDiscount;
          this.paymentInfo.seniorCitizenDiscountAmount = response['view'].seniorCitizenDiscountAmount;
        }
        this.paymentInfo.adultAmount = response['view'].adultAmount;
        this.paymentInfo.childAmount = response['view'].childAmount;
        this.paymentInfo.netAmount = response['view'].netAmount;
        this.paymentInfo.totalAmount = response['view'].totalAmount;
      } else if (response['code'] == 2006) {

      } else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.toastr.error(err['message'], 'Error !');
    });
    // this.seniorCitizenDiscountCount = 0;
    // this.paymentInfo.tourGuestInformationViews.forEach(tourGuestInformationView => {
    //   if (tourGuestInformationView.seniorCitizen) {
    //   if (tourGuestInformationView.name != undefined && tourGuestInformationView.gender != undefined && tourGuestInformationView.age != undefined) {
    //       this.seniorCitizenDiscountCount += 1;
    //     } else {
    //       this.toaster.show('error', 'Error!', "Please provide other details");
    //       tourGuestInformationView.seniorCitizen = false;
    //     }
    //   }

    // });
  }
  gettourGuestInformationViews(totalMember) {
    this.tourGuestInformationViews = [];
    for (let i = 0; i < totalMember; i++) {
      this.tourGuestInformationViews.push(new guestInformation());
    }
    return this.tourGuestInformationViews;
  }
  redirectToPayment(formId) {
    this.isFormSubmitted = true;
    if (this.applicantForm.invalid) {
      this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    if (this.termsAndConditions) {
      // this.paymentInfo.tourGuestInformationViews = [];
      // this.paymentInfo.tourGuestInformationViews.forEach(guestInformation => {
      //   if (guestInformation.name != undefined && guestInformation.gender != undefined) {
      //     if (guestInformation.seniorCitizen == undefined) {
      //       guestInformation.seniorCitizen = false;
      //     }
      //     // this.paymentInfo.tourGuestInformationViews.push(guestInformation)
      //   }
      // });
      this.paymentInfo.paymentModeTBI = this.applicantModel.paymentMode;
        this.paymentInfo.remarks = this.applicantModel.remarks;
      this.bookTourBtnBlockUI.start();
      this.http.put(`${AppConfigConstants.baseUrl}private/tour-booking/save-step-two`, this.paymentInfo).subscribe(response => {
        if (response['code'] >= 1000 && response['code'] < 2000) {
          if (response['code'] == 1046) {
            this.router.navigateByUrl(AppUrlConstants.tourModule + AppUrlConstants.successPaymentModule + this.paymentInfo.referenceNumber);
          } else {
            window.location.href = environment.paymentGatewayUrl +
            '&merchant_id=' + response['view'].merchatId + '&encRequest='
            + response['view'].orderURL + '&access_code=' + response['view'].accessCode;
          }
        } else if (response['code'] == 2006) {

        } else {
          this.toastr.error(response['message'], 'Error !');
        }
        this.bookTourBtnBlockUI.stop();
      }, err => {
        this.bookTourBtnBlockUI.stop();
        this.toastr.error(err['message'], 'Error !');
      });
    } else {
      this.toastr.error("Please accept Terms And Conditions", 'Error !');
    }

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
      });
    });
    if (totalError == 0) {
      return false;
    } else {
      return true;
    }
  }

  setSeniorCitizen(guestInformation) {
    if (guestInformation.age >= 60) {
      guestInformation.seniorCitizen = true;
    } else {
      guestInformation.seniorCitizen = false;
    }
  }
}