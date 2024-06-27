import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { ConfirmationReceiptService } from './confirmationReceipt.service';
import Swal from 'sweetalert2';
class Receipt {
  referenceNumber: string = '';
  hotelView: any = {};
  userView: any = {};
  createDate: string = '';
  startDate: string = '';
  endDate: string = '';
  totalAmount: string = '';
  totalRooms: string = '';
  totalAdults: string = '';
  totalChildren: string = '';
  roomBookingViews: any = [];
  guestInformationViews: any = [];
  roomTypeWiseGuestInformationViews: any = [];
  roomTypeViews: any = [];
  seniorCitizenDiscount: string = '';
  digitalPayDiscount: string = '';
  cancellationPercentage: string = '';
  cancellationAmount: string = '';
  refundAmount: string = '';
  paid: any = {};
  applicantView: any = {};
  paymentMode: any = {};
  remarks: string = '';
  constructor(view: any = {}) {
    this.referenceNumber = view.referenceNumber;
    this.hotelView = view.hotelView;
    this.userView = view.userView;
    this.createDate = view.createDate;
    this.startDate = view.startDate;
    this.endDate = view.endDate;
    this.totalAmount = view.totalAmount;
    this.totalRooms = view.totalRooms;
    this.totalAdults = view.totalAdults;
    this.totalChildren = view.totalChildren;
    this.roomBookingViews = view.roomBookingViews;
    this.guestInformationViews = view.guestInformationViews;
    this.roomTypeWiseGuestInformationViews = view.roomTypeWiseGuestInformationViews;
    this.roomTypeViews = view.roomTypeViews;
    this.seniorCitizenDiscount = view.seniorCitizenDiscount;
    this.digitalPayDiscount = view.digitalPayDiscount;
    this.cancellationPercentage = view.cancellationPercentage;
    this.cancellationAmount = view.cancellationAmount;
    this.refundAmount = view.refundAmount;
    this.paid = view.paid;
    this.applicantView = view.applicantView;
    this.paymentMode = view.paymentMode;
    this.remarks = view.remarks;
  }
}
@Component({
  selector: 'app-confirmationreceipt',
  templateUrl: './confirmationreceipt.component.html',
  styleUrls: ['./confirmationreceipt.component.scss']
})
export class ConfirmationreceiptComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  isHotelCancellationPage = false;
  receiptView: Receipt = new Receipt();
  bookingOfficer = false;
  public imgUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadHotelImage;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient, private router: Router, private confirmationReceiptService: ConfirmationReceiptService
  ) {
    if (this.route.routeConfig.path == AppUrlConstants.cancelPaymentDetails) {
      this.isHotelCancellationPage = true;
    }
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.receiptView = new Receipt(this.route.snapshot.data['resolveValue']['view']);
        this.receiptView.roomBookingViews.forEach(element => {
          element.tempGuestInformationView = []
          for (let i = 0; i < element.rooms; i++) {
            element.tempGuestInformationView.push({ room: i + 1, guestInfo: [] })
          }
          element.guestInformationViews.forEach(guestInformationView => {
            element.tempGuestInformationView.forEach(roomWise => {
              if (guestInformationView.room == roomWise.room) {
                roomWise.guestInfo.push(guestInformationView);
              }
            });
          });
        });
        console.log(this.receiptView)
        if (this.receiptView.guestInformationViews != undefined && this.receiptView.guestInformationViews.length != 0) {
          this.receiptView.roomTypeWiseGuestInformationViews = [];
          let list1 = []
          // this.receiptView.roomTypeViews.forEach(element1 => {
          //   let json = {};
          //   let list = []
          //   this.receiptView.guestInformationViews.forEach(element2 => {
          //     if(element1.id == element2.roomBookingView.roomView.roomTypeView.id){
          //       json['type'] = {};
          //       json = element2;
          //       list.push(json);
          //       list['type'] = {};
          //       list['type'].id = element1.id;
          //       list['type'].name = element1.name;
          //     }
          //   });
          //   list1.push(list);
          // });
          this.receiptView.roomTypeWiseGuestInformationViews = list1;
          console.log(this.receiptView.roomTypeWiseGuestInformationViews);
        }
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.receiptView = new Receipt();
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
  }

  onPrint() {
    window.print();
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

  exportReceipt(bookingDetails) {
    this.blockUI.start();
    this.confirmationReceiptService.downloadReceipt(bookingDetails.referenceNumber).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-booking-receipt?fileId=' + response.view.fileId;
        this.router.navigate([]).then(result => { window.open(link, '_blank'); });
      }
      else {
        this.toastr.error(response.message, 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }

  exportCancelReceipt(bookingDetails) {
    this.blockUI.start();
    this.confirmationReceiptService.downloadCancelReceipt(bookingDetails.referenceNumber).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-booking-receipt?fileId=' + response.view.fileId;
        this.router.navigate([]).then(result => { window.open(link, '_blank'); });
      }
      else {
        this.toastr.error(response.message, 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }

  onHotelCancellation() {
    Swal.fire({
      title: 'Do you want to Cancel - ' + this.receiptView.referenceNumber + ' - Booking ?',
      text: 'All data related to this Booking will be Cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}private/hotel-booking/cancel`, this.receiptView).subscribe(response => {
          if (response['code'] >= 1000 && response['code'] < 2000) {
            this.router.navigate(['/' + AppUrlConstants.bookingDetailsUrl]);
          } else {
            this.toastr.error(response['message'], 'Error !');
          }
          this.blockUI.stop();
        }, err => {
          this.blockUI.stop();
          this.toastr.error(err.message, 'Error !');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        1

      }
    })
  }

}
