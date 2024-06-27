import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants, AppUrlConstants } from '../appconfig';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ResetPasswordService implements Resolve<Object>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    this.blockUI.start();
    return this.http.get(`${AppConfigConstants.baseUrl}public/user/reset-password-verification?resetPasswordVerification=` + route.params.token, httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else {
          this.toastr.error(res['message'], 'Error !');
          this.router.navigate([AppUrlConstants.home]);
        }
        this.blockUI.stop();
      }));
  }
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }
  resetPassword(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}private/user/reset-password`, json, httpOptions);
  }
}
