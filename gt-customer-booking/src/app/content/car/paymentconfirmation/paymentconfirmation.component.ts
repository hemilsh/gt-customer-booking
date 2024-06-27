import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { PaymentConfirmationService } from './paymentconfirmation.service';
import Swal from 'sweetalert2';
import { CarBookingModel } from '../car-booking.class';

@Component({
  selector: 'app-paymentconfirmation',
  templateUrl: './paymentconfirmation.component.html',
  styleUrls: ['./paymentconfirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  isCancellationPage = false;
  carBookingView: CarBookingModel = new CarBookingModel();
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient, private router: Router, private paymentConfirmationService: PaymentConfirmationService
  ) {
    if (this.route.routeConfig.path == AppUrlConstants.carCancelBookingDetails) {
      this.isCancellationPage = true;
    }
    if (this.route.snapshot.data['resolveValue'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        this.carBookingView = new CarBookingModel(this.route.snapshot.data['resolveValue']['view']);
      } else if (this.route.snapshot.data['resolveValue'].code == 2006) {
        this.carBookingView = new CarBookingModel();
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue']['message'], 'Error !');
      }
    }
  }

  ngOnInit() {
  }

  exportReceipt(bookingDetails) {
    this.blockUI.start();
    this.paymentConfirmationService.downloadReceipt(bookingDetails.referenceNumber).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-car-booking-receipt?fileId=' + response.view.fileId;
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
    this.paymentConfirmationService.downloadCancelReceipt(bookingDetails.referenceNumber).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        var link = AppConfigConstants.baseUrl + '/private/file/download-car-booking-receipt?fileId=' + response.view.fileId;
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

  onCancellation() {
    Swal.fire({
      title: 'Do you want to Cancel - ' + this.carBookingView.referenceNumber + ' - Booking ?',
      text: 'All data related to this Booking will be Cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.blockUI.start();
        this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/cancel`, this.carBookingView).subscribe(response => {
          if (response['code'] >= 1000 && response['code'] < 2000) {
            this.router.navigate(['/' +AppUrlConstants.carModule + '/'+ AppUrlConstants.carBookingDetailsUrl]);
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
