import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants } from 'src/app/appconfig';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ProfileService implements Resolve<Object>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    this.blockUI.start();
    return this.http.get(`${AppConfigConstants.baseUrl}private/user/view?id=` + route.params.id, httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      }));
  }
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }
}
