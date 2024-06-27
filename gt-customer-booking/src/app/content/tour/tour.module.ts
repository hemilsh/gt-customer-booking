import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppUrlConstants } from '../../appconfig';
import { BlockUIModule } from 'ng-block-ui';
import { NgImageSliderModule } from 'ng-image-slider';
import { TourComponent } from './list/tour.component';
import { TourService } from './list/tour.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Daterangepicker } from 'ng2-daterangepicker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutocompleteService } from 'src/app/_layout/modify-component/angular-autocomplete';
import { TourViewComponent } from './view/tour-view.component';
import { TourViewService } from './view/tour-view.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DpDatePickerModule } from 'ng2-date-picker';
import { BookTourComponent } from './book-tour/book-tour.component';
import { BookTourService } from './book-tour/book-tour.service';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
import { PaymentSuccessService } from './payment-success/payment-success.service';
import { TourBookingDetailsComponent } from './tourBookingDetails/tourBookingDetails.component';
import { TourBookingDetailsService } from './tourBookingDetails/tourBookingDetails.service';
import { CustomCalendarModule } from 'src/app/_layout/custom-calendar/custom-calendar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [TourComponent, TourViewComponent, BookTourComponent, PaymentSuccessComponent, PaymentFailureComponent, TourBookingDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    NgImageSliderModule,
    AutocompleteLibModule,
    InfiniteScrollModule,
    Daterangepicker,
    NgxPaginationModule,
    LazyLoadImageModule,
    DpDatePickerModule,
    CustomCalendarModule,
    NgbModule,
    RouterModule.forChild(
      [
        { path: '', component: TourComponent, resolve: { resolveValue: TourService }, data: { title: 'Tours - Gujarat Tourism' } },
        { path: 'view/:id', component: TourViewComponent, resolve: { resolveValue: TourViewService }, data: { title: 'Tour View - Gujarat Tourism' } },
        { path: 'book/:referenceNumber', component: BookTourComponent, resolve: { resolveValue: BookTourService }, data: { title: 'Book Tour - Gujarat Tourism' } },
        { path: AppUrlConstants.tourBookingDetailsUrl, component: TourBookingDetailsComponent, data: { title: 'Tour Booking - Gujarat Tourism' }, resolve: { resolveValue: TourBookingDetailsService } },
        { path: 'success-payment/:referenceNumber', component: PaymentSuccessComponent, resolve: { resolveValue: PaymentSuccessService }, data: { title: 'Booking Success - Gujarat Tourism' } },
        { path: AppUrlConstants.cancellationUrl, component: PaymentSuccessComponent, resolve: { resolveValue: PaymentSuccessService }, data: { title: 'Booking Cancel - Gujarat Tourism' } },
        { path: 'cancel-payment/:referenceNumber', component: PaymentFailureComponent, data: { title: 'Booking Cancel - Gujarat Tourism' } },
        { path: AppUrlConstants.tourCancelBookingDetails, component: PaymentSuccessComponent, resolve: { resolveValue: PaymentSuccessService }, data: { title: 'Booking Cancelled - Gujarat Tourism' } },
      ]
    )
  ], providers: [
    AutocompleteService, PaymentSuccessService
  ]
})
export class TourModule { }
