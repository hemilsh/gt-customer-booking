import { BrowserModule,Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';

// import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './content/home/home.component';
import { InternalServerErrorComponent } from './_layout/error/internal-server-error/internal-server-error.component';
import { pageNotFoundComponent } from './_layout/error/page-not-found/page-not-found.component';
import { serviceUnavailableComponent } from './_layout/error/service-unavailable/service-unavailable.component';
import { unauthorizedComponent } from './_layout/error/unauthorized/unauthorized.component';
import { forbiddenComponent } from './_layout/error/forbidden/forbidden.component';
import { badgatewayComponent } from './_layout/error/badgateway/badgateway.component';
import { badrequestComponent } from './_layout/error/badrequest/badrequest.component';
import { HeaderComponent } from './_layout/header/header.component';
import { FooterComponent } from './_layout/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { Daterangepicker } from 'ng2-daterangepicker';
import { HomeService } from './content/home/home.service';
import { AppConfigConstants } from './appconfig';
import { AuthInterceptor } from './_services/auth.interceptor';
import { MyprofileComponent } from './content/myprofile/myprofile.component';
import { PoliciesComponent } from './content/policies/policies.component';
import { BookinghistoryComponent } from './content/bookinghistory/bookinghistory.component';
import { ConfirmationreceiptComponent } from './content/confirmationreceipt/confirmationreceipt.component';
import { PaymentComponent } from './content/payment/payment.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordService } from './_services/resetPassword.services';
import { ResetPasswordComponent } from './content/reset-password/reset-password.component';
import { AuthGuard } from './_services/auth.guard';
import { ProfileService } from './content/myprofile/profile.services';
import { HotelService } from './content/hotel/list/hotel.service';
import { HotelViewComponent } from './content/hotel/view/hotel-view.component';
import { HotelViewService } from './content/hotel/view/hotel-view.service';
import { HotelComponent } from './content/hotel/list/hotel.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgImageSliderModule } from 'ng-image-slider';
import { ToasterContainerComponent } from './_layout/toaster/toaster-container.component';
import { ToasterComponent } from './_layout/toaster/toaster.component';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from './_services/share.services';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from './_services/data.service';
import { paymentService } from './content/payment/payment.service';
import { BannerComponent } from './content/banner/banner.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AutocompleteService } from './_layout/modify-component/angular-autocomplete';
import { ErrorComponent } from './_layout/error/error/error.component';
import { ConfirmationReceiptService } from './content/confirmationreceipt/confirmationReceipt.service';
import { TourService } from './content/tour/list/tour.service';
import { TourComponent } from './content/tour/list/tour.component';
import { TourViewService } from './content/tour/view/tour-view.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CancelPaymentComponent } from './content/hotel/cancel-payment/cancel-payment.component';
import {DpDatePickerModule} from 'ng2-date-picker';
import { BookingdetailsComponent } from './content/hotel/bookingdetails/bookingdetails.component';
import { TourBookingDetailsService } from './content/tour/tourBookingDetails/tourBookingDetails.service';
import { BookingDetailsService } from './content/hotel/bookingdetails/bookingdetails.service';
import { MyProfileEditComponent } from './content/myprofile/myprofileedit.component';
import { ProfileEditService } from './content/myprofile/profileedit.services';
import { ChangePasswordComponent } from './content/change-password/change-password.component';
import { OtpComponent } from './content/otp/otp.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonthlyVacantReportComponent } from './content/monthly-vacant-report/monthly-vacant-report.component';
import { CustomCalendarModule } from './_layout/custom-calendar/custom-calendar.module';
import { Subscription } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsAndConditionComponent } from './content/terms-and-condition/terms-and-condition.component';
import { FailPaymentComponent } from './content/fail-payment/fail-payment.component';
import { CarPaymentComponent } from './content/car/payment/carpayment.component';
import { PaymentConfirmationComponent } from './content/car/paymentconfirmation/paymentconfirmation.component';
import { CarBookingDetailsComponent } from './content/car/bookingdetails/carbookingdetails.component';
import { CarBookingDetailsService } from './content/car/bookingdetails/carbookingdetails.service';
import { PaymentConfirmationService } from './content/car/paymentconfirmation/paymentconfirmation.service';
import { carPaymentService } from './content/car/payment/carpayment.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InternalServerErrorComponent,
    pageNotFoundComponent,
    serviceUnavailableComponent,
    unauthorizedComponent,
    forbiddenComponent,
    badgatewayComponent,
    badrequestComponent,
    HeaderComponent,
    FooterComponent,
    MyProfileEditComponent,
    MyprofileComponent,
    PoliciesComponent,
    BookingdetailsComponent,
    BookinghistoryComponent,
    ConfirmationreceiptComponent,
    PaymentComponent,
    ResetPasswordComponent,
    HotelViewComponent,
    HotelComponent,
    ToasterContainerComponent,
    ToasterComponent,
    BannerComponent,
    ErrorComponent,
    CancelPaymentComponent,
    ChangePasswordComponent,
    OtpComponent,
    MonthlyVacantReportComponent,
    TermsAndConditionComponent,
    FailPaymentComponent,
    //car components
    CarPaymentComponent,
    PaymentConfirmationComponent,
    CarBookingDetailsComponent
    // TourComponen
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BlockUIModule.forRoot(),
    Daterangepicker,
    AutocompleteModule.forRoot(),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgImageSliderModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    LazyLoadImageModule,
    DpDatePickerModule,
    ImageCropperModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CustomCalendarModule,
    NgbModule
  ],
  providers: [
    HomeService,
    AppConfigConstants,
    ProfileService,
    ProfileEditService,
    HotelService,
    TourService,
    TourViewService,
    HotelViewService,
    BookingDetailsService,
    TourBookingDetailsService,
    ResetPasswordService,
    paymentService,
    ConfirmationReceiptService,
    AuthGuard,
    SharedService,
    DataService,
    AutocompleteService,
    //car
    carPaymentService,
    PaymentConfirmationService,
    CarBookingDetailsService,
    Title,
    // Subscription,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
