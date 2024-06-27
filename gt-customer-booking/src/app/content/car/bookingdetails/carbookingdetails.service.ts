import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { tap } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppConfigConstants } from 'src/app/appconfig';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class CarBookingDetailsService implements Resolve<any>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.blockUI.start();
    return this.http.post(`${AppConfigConstants.baseUrl}private/car-booking/customer-bookings?start=` + 0 + "&recordSize=" + 10, {
      isPendingBooking:true
    }, httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      },catchError( (err) => Observable.throw(this.blockUI.stop()) )
      ));
  }
  constructor(private http: HttpClient, private appConfig: AppConfigConstants, private toastr: ToastrService) {
  }
}
