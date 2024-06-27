import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { InternalServerErrorComponent } from './_layout/error/internal-server-error/internal-server-error.component';
import { pageNotFoundComponent } from './_layout/error/page-not-found/page-not-found.component';
import { serviceUnavailableComponent } from './_layout/error/service-unavailable/service-unavailable.component';
import { unauthorizedComponent } from './_layout/error/unauthorized/unauthorized.component';
import { forbiddenComponent } from './_layout/error/forbidden/forbidden.component';
import { badgatewayComponent } from './_layout/error/badgateway/badgateway.component';
import { badrequestComponent } from './_layout/error/badrequest/badrequest.component';
import { HomeService } from './content/home/home.service';
import { MyprofileComponent } from './content/myprofile/myprofile.component';
import { PoliciesComponent } from './content/policies/policies.component';
import { BookinghistoryComponent } from './content/bookinghistory/bookinghistory.component';
import { ConfirmationreceiptComponent } from './content/confirmationreceipt/confirmationreceipt.component';
import { PaymentComponent } from './content/payment/payment.component';
import { HotelViewComponent } from './content/hotel/view/hotel-view.component';
import { ResetPasswordService } from './_services/resetPassword.services';
import { ResetPasswordComponent } from './content/reset-password/reset-password.component';
import { AppUrlConstants } from './appconfig';
import { ProfileService } from './content/myprofile/profile.services';
import { HotelComponent } from './content/hotel/list/hotel.component';
import { HotelService } from './content/hotel/list/hotel.service';
import { HotelViewService } from './content/hotel/view/hotel-view.service';
import { paymentService } from './content/payment/payment.service';
import { ErrorComponent } from './_layout/error/error/error.component';
import { ConfirmationReceiptService } from './content/confirmationreceipt/confirmationReceipt.service';
import { TourComponent } from './content/tour/list/tour.component';
import { TourService } from './content/tour/list/tour.service';
import { CancelPaymentComponent } from './content/hotel/cancel-payment/cancel-payment.component';
import { BookingdetailsComponent } from './content/hotel/bookingdetails/bookingdetails.component';
import { TourBookingDetailsService } from './content/tour/tourBookingDetails/tourBookingDetails.service';
import { TourBookingDetailsComponent } from './content/tour/tourBookingDetails/tourBookingDetails.component';
import { BookingDetailsService } from './content/hotel/bookingdetails/bookingdetails.service';
import { ProfileEditService } from './content/myprofile/profileedit.services';
import { MyProfileEditComponent } from './content/myprofile/myprofileedit.component';
import { ChangePasswordComponent } from './content/change-password/change-password.component';
import { OtpComponent } from './content/otp/otp.component';
import { MonthlyVacantReportComponent } from './content/monthly-vacant-report/monthly-vacant-report.component';
import { MonthlyVacantReportService } from './content/monthly-vacant-report/monthly-vacant-report.service';
import { TermsAndConditionComponent } from './content/terms-and-condition/terms-and-condition.component';
import { FailPaymentComponent } from './content/fail-payment/fail-payment.component';
import { carPaymentService } from './content/car/payment/carpayment.service';
import { CarPaymentComponent } from './content/car/payment/carpayment.component';
import { PaymentConfirmationService } from './content/car/paymentconfirmation/paymentconfirmation.service';
import { PaymentConfirmationComponent } from './content/car/paymentconfirmation/paymentconfirmation.component';
import { CarBookingDetailsComponent } from './content/car/bookingdetails/carbookingdetails.component';
import { CarBookingDetailsService } from './content/car/bookingdetails/carbookingdetails.service';

const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { resolveValue: HomeService }, data: { title: 'Gujarat Tourism' } },
  { path: AppUrlConstants.profileModule + ':id', component: MyprofileComponent, resolve: { resolveValue: ProfileService }, data: { title: 'Profile - Gujarat Tourism' } },
  { path: 'policies', component: PoliciesComponent },
  { path: AppUrlConstants.bookingDetailsUrl, component: BookingdetailsComponent, resolve: { resolveValue: BookingDetailsService }, data: { title: 'Booking Details - Gujarat Tourism' } },
  { path: 'bookinghistory', component: BookinghistoryComponent, data: { title: 'Booking History - Gujarat Tourism' } },
  { path: AppUrlConstants.successPayment, component: ConfirmationreceiptComponent, resolve: { resolveValue: ConfirmationReceiptService }, data: { title: 'Payment Successful - Gujarat Tourism' } },
  { path: AppUrlConstants.cancelBookingDetails, component: ConfirmationreceiptComponent, resolve: { resolveValue: ConfirmationReceiptService }, data: { title: 'Booking Cancelled - Gujarat Tourism' } },
  { path: 'tour', loadChildren: '../app/content/tour/tour.module#TourModule' },
  { path: 'hotel', component: HotelComponent, resolve: { resolveValue: HotelService }, data: { title: 'Hotels - Gujarat Tourism' } },
  { path: 'hotel/view/:id', component: HotelViewComponent, resolve: { resolveValue: HotelViewService }, data: { title: 'Hotel View - Gujarat Tourism' } },
  { path: AppUrlConstants.paymentModule, component: PaymentComponent, resolve: { resolveValue: paymentService }, data: { title: 'Payment - Gujarat Tourism' } },
  // { path: AppUrlConstants.tourModule, component: TourComponent, resolve: { resolveValue: TourService } },
  { path: 'hoteldetails', component: HotelViewComponent, data: { title: 'Hotel Details - Gujarat Tourism' } },
  // { path: 'reset-password/:token', component: ResetPasswordComponent, resolve: { resolveValue: ResetPasswordService } ,data :{ title:'Reset Password - Gujarat Tourism'}},
  { path: 'cancel-payment/:referenceNumber', component: CancelPaymentComponent, data: { title: 'Payment Failure - Gujarat Tourism' } },
  { path: AppUrlConstants.cancelPaymentDetails, component: ConfirmationreceiptComponent, data: { title: 'Cancel Payment - Gujarat Tourism' }, resolve: { resolveValue: ConfirmationReceiptService } },
  { path: AppUrlConstants.monthlyVacantReportModule, component: MonthlyVacantReportComponent, data: { title: 'monthly vacant report - Gujarat Tourism' }, resolve: { resolveValue: MonthlyVacantReportService } },
  { path: AppUrlConstants.profileEditModule + ':id', component: MyProfileEditComponent, resolve: { resolveValue: ProfileEditService }, data: { title: 'Profile - Gujarat Tourism' } },
  { path: AppUrlConstants.changePasswordModule, component: ChangePasswordComponent, data: { title: 'Change password - Gujarat Tourism' } },
  { path: AppUrlConstants.resetPasswordModule, component: ResetPasswordComponent, resolve: { resolveValue: ResetPasswordService }, data: { title: 'Reset password - Gujarat Tourism' } },
  { path: AppUrlConstants.otpModule, component: OtpComponent, data: { title: 'otp - Gujarat Tourism' } },
  { path: AppUrlConstants.termsAndConditionUrl, component: TermsAndConditionComponent, data: { title: 'Terms And Condition - Gujarat Tourism' } },
  { path: AppUrlConstants.failPaymentModule, component: FailPaymentComponent, data: { title: 'Payment Failed - Gujarat Tourism' } },

  { path: AppUrlConstants.carModule + "/" + AppUrlConstants.carPaymentModule, component: CarPaymentComponent, resolve: { resolveValue: carPaymentService }, data: { title: 'Car Payment - Gujarat Tourism' } },
  { path: AppUrlConstants.carModule + "/" + AppUrlConstants.carSuccessPayment, component: PaymentConfirmationComponent, resolve: { resolveValue: PaymentConfirmationService }, data: { title: 'Payment Successful - Gujarat Tourism' } },
  { path: AppUrlConstants.carCancelBookingDetails, component: PaymentConfirmationComponent, resolve: { resolveValue: PaymentConfirmationService }, data: { title: 'Booking Cancelled - Gujarat Tourism' } },
  { path: AppUrlConstants.carModule + "/" + AppUrlConstants.cancelPaymentDetails, component: PaymentConfirmationComponent, data: { title: 'Cancel Payment - Gujarat Tourism' }, resolve: { resolveValue: PaymentConfirmationService } },
  { path: AppUrlConstants.carModule + "/" + AppUrlConstants.carBookingDetailsUrl, component: CarBookingDetailsComponent, resolve: { resolveValue: CarBookingDetailsService }, data: { title: 'Booking Details - Gujarat Tourism' } },


  { path: AppUrlConstants.error, component: ErrorComponent, data: { title: 'Error - Gujarat Tourism' } },
  { path: AppUrlConstants.internalServerError, component: InternalServerErrorComponent, data: { title: 'Internal Server Error - Gujarat Tourism' } },
  { path: AppUrlConstants.pageNotFound, component: pageNotFoundComponent, data: { title: 'Page Not Found - Gujarat Tourism' } },
  { path: AppUrlConstants.serviceUnavailable, component: serviceUnavailableComponent, data: { title: 'Service Unavailable - Gujarat Tourism' } },
  { path: AppUrlConstants.unauthorized, component: unauthorizedComponent, data: { title: 'Unauthorization Error - Gujarat Tourism' } },
  { path: AppUrlConstants.forbidden, component: forbiddenComponent, data: { title: 'Forbidden Error - Gujarat Tourism' } },
  { path: AppUrlConstants.badgateway, component: badgatewayComponent, data: { title: 'Badgateway Error - Gujarat Tourism' } },
  { path: AppUrlConstants.badrequest, component: badrequestComponent, data: { title: 'Badrequest Error - Gujarat Tourism' } },
  { path: '**', component: pageNotFoundComponent, data: { title: 'Error - Gujarat Tourism' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 100],
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
