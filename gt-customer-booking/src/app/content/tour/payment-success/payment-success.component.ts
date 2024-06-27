

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
class Receipt {
  referenceNumber: string = '';
  tourView: any = {};
  userView: any = {};
  createDate: string = '';
  startDate: string = '';
  endDate: string = '';
  totalAmount: string = '';
  totalSeats: any = '';
  totalAdults: string = '';
  totalChildren: string = '';
  roomBookingViews: any = [];
  guestInformationViews: any = [];
  tourGuestInformationViews: any = [];
  roomTypeViews: any = [];
  cancellationAmount: string = '';
  cancellationPercentage: string = '';
  cgstAmount: string = '';
  cgstTax: string = '';
  sgstAmount: string = '';
  sgstTax: string = '';
  igstAmount: string = '';
  igstTax: string = '';
  seniorCitizenDiscount: string = '';
  seniorCitizenDiscountAmount: string = '';
  netAmount: string = '';
  refundAmount: string = '';
  status: any = {};
  paymentModeTBI: any = {};
  remarks: string = '';
  childAmount: string = '';
  adultAmount: string = '';

  constructor(view: any = {}) {
    this.referenceNumber = view.referenceNumber;
    this.tourView = view.tourView;
    this.userView = view.userView;
    this.createDate = view.createDate;
    this.startDate = view.startDate;
    this.endDate = view.endDate;
    this.totalAmount = view.totalAmount;
    this.totalSeats = view.totalSeats;
    this.totalAdults = view.totalAdults;
    this.totalChildren = view.totalChildren;
    this.roomBookingViews = view.roomBookingViews;
    this.guestInformationViews = view.guestInformationViews;
    this.tourGuestInformationViews = view.tourGuestInformationViews;
    this.roomTypeViews = view.roomTypeViews;
    this.cancellationAmount = view.cancellationAmount;
    this.cancellationPercentage = view.cancellationPercentage;
    this.cgstAmount = view.cgstAmount;
    this.cgstTax = view.cgstTax;
    this.sgstAmount = view.sgstAmount;
    this.sgstTax = view.sgstTax;
    this.igstAmount = view.igstAmount;
    this.igstTax = view.igstTax;
    this.seniorCitizenDiscount = view.seniorCitizenDiscount;
    this.seniorCitizenDiscountAmount = view.seniorCitizenDiscountAmount;
    this.netAmount = view.netAmount;
    this.childAmount = view.childAmount;
    this.adultAmount = view.adultAmount;
    this.refundAmount = view.refundAmount;
    this.status = view.status;
    this.paymentModeTBI = view.paymentModeTBI;
    this.remarks = view.remarks;
  }
}
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  isTourCancellationPage = false;
  receiptView: Receipt = new Receipt();
  bookingOfficer = false;

  public imgUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadTourImage;
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {
    if (this.activatedRoute.snapshot.data['resolveValue'] != undefined) {
      if (this.activatedRoute.snapshot.data['resolveValue'].code >= 1000 && this.activatedRoute.snapshot.data['resolveValue'].code < 2000) {
        this.receiptView = new Receipt(this.activatedRoute.snapshot.data['resolveValue']['view']);
      } else if (this.activatedRoute.snapshot.data['resolveValue'].code == 2006) {
        this.receiptView = new Receipt();
      } else {
        this.toastr.error(this.activatedRoute.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
    if (activatedRoute.routeConfig.path == AppUrlConstants.cancellationUrl) {
      this.isTourCancellationPage = true;
    }
  }

  exportReceipt(bookingDetails) {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/tour-booking/export-receipt-pdf?referenceNumber=` + bookingDetails.referenceNumber).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-tour-booking-receipt?fileId=' + response['view'].fileId;
        this.router.navigate([]).then(result => { window.open(link, '_blank'); });
      }
      else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }

  exportCancelReceipt(bookingDetails) {
    this.blockUI.start();
    this.http.get(`${AppConfigConstants.baseUrl}private/tour-booking/export-cancel-receipt-pdf?referenceNumber=` + bookingDetails.referenceNumber).subscribe(response => {
      if (response['code'] >= 1000 && response['code'] < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-tour-booking-receipt?fileId=' + response['view'].fileId;
        this.router.navigate([]).then(result => { window.open(link, '_blank'); });
      }
      else {
        this.toastr.error(response['message'], 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }

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
  }
  onTourcancellation() {
    Swal.fire({
      title: 'Do you want to Cancel - ' + this.receiptView.referenceNumber + ' - Booking ?',
      text: 'All data related to this Booking will be Cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/cancel`, this.receiptView).subscribe(response => {
          this.blockUI.stop();
          if (response['code'] >= 1000 && response['code'] < 2000) {
            this.router.navigate(['/' + AppUrlConstants.tourModule + '/' + AppUrlConstants.tourBookingDetailsUrl]);
          } else if (response['code'] == 2006) {

          } else {
            //   this.hotelList = [];
            this.toastr.error(response['message'], 'Error !');
          }
        }, err => {
          this.toastr.error(err['message'], 'Error !');
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
}
