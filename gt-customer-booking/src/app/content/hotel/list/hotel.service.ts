import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants } from '../../../appconfig';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HotelService implements Resolve<any>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let cityId = route.queryParams['cityView'];
    let cityView = null;
    if(cityId != null){
      cityView = { 'id': cityId };
    }
    let area = route.queryParams['area'];
    let startDate: any = route.queryParams['check-in-date'];
    let endDate: any = route.queryParams['check-out-date'];
    let numberOfRoom: string = route.queryParams['rooms'];
    let numberOfAdults: string = route.queryParams['adults'];
    let numberOfChildren: string = route.queryParams['children'];
    let tentHotel = route.queryParams['tentHotel'];
    if(tentHotel == true || tentHotel == 'true'){
      this.blockUI.start();
      return this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-fair-festival?start=0&recordSize=10`, {
        cityView: cityView,
        area:area,
        startDate: startDate,
        endDate: endDate,
        numberOfRoom: numberOfRoom,
        numberOfAdults: numberOfAdults,
        numberOfChildren: numberOfChildren,
      }, httpOptions)
        .pipe(tap(res => {
          if (res['code'] >= 1000 && res['code'] < 2000) {
          } else if (res['code'] == 2006) {
          } else {
            this.toastr.error(res['message'], 'Error !');
          }
          this.blockUI.stop();
        }, catchError(
          (err) =>
            Observable.throw(
              this.blockUI.stop()
            ))
        ));
    }else{
      this.blockUI.start();
    return this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=10`, {
      cityView: cityView,
      area:area,
      startDate: startDate,
      endDate: endDate,
      numberOfRoom: numberOfRoom,
      numberOfAdults: numberOfAdults,
      numberOfChildren: numberOfChildren,
    }, httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      }, catchError(
        (err) =>
          Observable.throw(
            this.blockUI.stop()
          ))
      ));
    }
    
  }
  constructor(private http: HttpClient, private appConfig: AppConfigConstants, private toastr: ToastrService) {
  }

}
