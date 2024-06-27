import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants } from 'src/app/appconfig';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class TourService implements Resolve<any>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.blockUI.start();
    let tourLocationViewId = route.queryParams['tourLocationViewId'];
    let startDate: any = route.queryParams['checkindate'];
    let endDate: any = route.queryParams['checkoutdate'];
    let numberOfSeat: string = route.queryParams['seat'];
    let privateFlag: string = route.queryParams['privateTourFlag'];
    let url = 'search-tour';
    if(privateFlag == "true"){
      url = 'search-private-tour';
    }
    return this.http.post(`${AppConfigConstants.baseUrl}/public/tour/`+url+`?start=` + 0 + "&recordSize=" + 10, 
    {
      tourLocationView: {id:tourLocationViewId},
      // startDate: startDate,
      // endDate: endDate,
      // numberOfSeat: numberOfSeat,
    }, httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      }));
  }
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigConstants,
    private toastr: ToastrService
  ) {
  }
}