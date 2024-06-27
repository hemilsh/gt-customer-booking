import { environment } from "src/environments/environment";

export class AppConfigConstants {
  public static baseUrl = environment.apiUrl;
  public static adminUrl = environment.adminUrl;


  public static downloadHotelImage = 'public/file/download-hotel-images?fileId='
  public static downloadCaptchaImage = 'public/captcha/download-captcha?captchaId='
  public static downloadRoomImage = 'public/file/download-room-type-images?fileId='
  public static downloadHotelAmenitiesImage = 'public/file/download-hotel-amenities-images?fileId='
  public static downloadTourImage = 'public/file/download-tour-images?fileId='
  public static profileImagePath = '/private/file/download-profile-pic?fileId=';
  public static uploadProfilePic = '/private/file/upload-profile-pic';
}

export class AppUrlConstants {
  public static viewOpration = '/view/'
  public static editOpration = '/edit/'
  public static addOpration = '/add/'
  public static home = '/'
  public static hotelModule = 'hotel'
  public static tourModule = 'tour'
  public static login = '/'
  public static logout = '/logout'
  public static paymentTempModule = '/payment/'
  public static bookingDetailsUrl = 'hotel/booking-details'
  public static tourBookingDetailsUrl = 'booking-details'
  public static bookModule = '/book/'
  public static paymentModule = 'payment/:referenceNumber'
  public static cancellationModule = 'cancellation/'
  public static cancellationUrl = 'cancellation/:referenceNumber'
  public static profileModule = 'profile/'
  public static profileEditModule = 'profile-edit/'
  public static cancelPayment = 'cancel-payment/:referenceNumber'
  public static cancelPaymentDetails = 'hotel/cancel-payment/:referenceNumber'
  public static monthlyVacantReportModule = 'monthly-vacant-report'
  public static cancelPaymentTempDetails = 'hotel/cancel-payment/'
  public static cancelBookingDetails = 'hotel/cancel-booking/:referenceNumber'
  public static cancelBookingTempDetails = 'hotel/cancel-booking/'
  public static successPaymentModule = '/success-payment/'
  public static successPayment = 'success-payment/:referenceNumber'
  public static changePasswordModule = 'change-password'
  public static resetPasswordModule = 'reset-password/:token'
  public static otpModule = 'verification-code'
  public static termsAndConditionUrl = 'terms-and-condition'
  public static failPaymentModule = 'fail-payment'
  public static tourCancelBookingTempDetails = '/cancel-booking/'
  public static tourCancelBookingDetails = 'cancel-booking/:referenceNumber'
  public static carBookingDetailsUrl = 'booking-details'

  //car
  public static carModule = 'car'
  public static carBookingModule = '/book/'
  public static carPaymentModule = 'book/:id'
  public static carSuccessPayment = 'success-payment/:referenceNumber'
  public static carCancelBookingDetails = 'car/cancel-booking/:referenceNumber'
  public static carCancelBookingTempDetails = 'car/cancel-booking/'
  public static carSuccessPaymentModule = '/success-payment/'
  public static carCancelPaymentDetails = 'cancel-payment/:referenceNumber'



  // error pages
  public static internalServerError = 'internal-server-error'
  public static pageNotFound = 'page-not-found'
  public static serviceUnavailable = 'service-unavailable'
  public static unauthorized = 'unauthorized'
  public static forbidden = 'forbidden'
  public static badgateway = 'badgateway'
  public static badrequest = 'badrequest'
  public static error = 'error'
}