import * as Long from 'long';
export class CarBookingModel {
  public referenceNumber: string = '';
  public carView: any = {};
  public startDate: string = '';
  public endDate: string = '';
  public rateType: any = {};
  public rate: string = '';
  public totalAmount: string = '';
  public netAmount: string = '';
  public cgstAmount: string = '';
  public sgstAmount: string = '';
  public igstAmount: string = '';
  public cgstTax: string = '';
  public sgstTax: string = '';
  public igstTax: string = '';
  public paid: any = {};
  public paidDate: string = '';
  public kilometers: Long = new Long(null);
  public hours: Long = new Long(null);
  public cars: Long = new Long(null);
  public name: string = '';
  public email: string = '';
  public mobile: string = '';
  public termsAndConditions: boolean = true;
  public startDateSearch: string = '';
  public endDateSearch: string = '';
  public paymentModeTBI: any = {};
  public remarks: string = '';
  public cancellationPercentage: string = '';
  public cancellationAmount: string = '';
  public refundAmount: string = '';
  public createDate: string = '';
  constructor(view: any = {}) {
    this.referenceNumber = view.referenceNumber;
    this.carView = view.carView;
    this.startDate = view.startDate;
    this.endDate = view.endDate;
    this.rateType = view.rateType;
    this.rate = view.rate;
    this.totalAmount = view.totalAmount;
    this.netAmount = view.netAmount;
    this.cgstAmount = view.cgstAmount;
    this.sgstAmount = view.sgstAmount;
    this.igstAmount = view.igstAmount;
    this.cgstTax = view.cgstTax;
    this.sgstTax = view.sgstTax;
    this.igstTax = view.igstTax;
    this.paid = view.paid;
    this.paidDate = view.paidDate;
    this.kilometers = view.kilometers;
    this.hours = view.hours;
    if (view.cars == null) {
      this.cars = 1;
    } else {
      this.cars = view.cars;
    }
    this.name = view.name;
    this.email = view.email;
    this.mobile = view.mobile;
    this.termsAndConditions = view.termsAndConditions;
    this.startDateSearch = view.startDateSearch;
    this.endDateSearch = view.endDateSearch;
    this.paymentModeTBI = view.paymentModeTBI;
    this.remarks = view.remarks;
    this.cancellationPercentage = view.cancellationPercentage;
    this.cancellationAmount = view.cancellationAmount;
    this.refundAmount = view.refundAmount;
    this.createDate = view.createDate;
  }
}