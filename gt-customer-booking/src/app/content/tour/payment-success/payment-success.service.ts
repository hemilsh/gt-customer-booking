import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { tap } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class PaymentSuccessService implements Resolve<any>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (route.routeConfig.path != AppUrlConstants.cancellationUrl) {
      this.blockUI.start();
      return this.http.get(`${AppConfigConstants.baseUrl}private/tour-booking/view-booking-information?referenceNumber=` + route.params.referenceNumber, httpOptions)
        .pipe(tap(res => {
          if (res['code'] >= 1000 && res['code'] < 2000) {
          } else if (res['code'] == 2006) {
          } else {
            this.toastr.error(res['message'], 'Error !');
          }
          this.blockUI.stop();
        }
        ));
    } else {
      this.blockUI.start();
      return this.http.post(`${AppConfigConstants.baseUrl}private/tour-booking/booking-cancel-calculation`, { referenceNumber: route.params.referenceNumber }, httpOptions)
        .pipe(tap(res => {
          if (res['code'] >= 1000 && res['code'] < 2000) {
          } else if (res['code'] == 2006) {
          } else {
            this.toastr.error(res['message'], 'Error !');
          }
          this.blockUI.stop();
        }
        ));
    }

  }
  constructor(private http: HttpClient, private appConfig: AppConfigConstants, private toastr: ToastrService, private router: Router) {
  }
}
