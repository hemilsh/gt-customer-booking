import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppConfigConstants } from '../../appconfig';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HomeService implements Resolve<any>{
  @BlockUI() blockUI: NgBlockUI
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.blockUI.start();
    return this.http.post(`${AppConfigConstants.baseUrl}public/hotel/search-hotel?start=0&recordSize=`, {	"vendorView":{

      "tcglVendor":true
    }},httpOptions)
      .pipe(tap(res => {
        if (res['code'] >= 1000 && res['code'] < 2000) {
        } else if (res['code'] == 2006) {
        } else {
          this.toastr.error(res['message'], 'Error !');
        }
        this.blockUI.stop();
      }));
  }
  constructor(private http: HttpClient, private appConfig: AppConfigConstants, private toastr: ToastrService) {
  }


  editAgent(id): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/private/agent/edit?id=` + id, httpOptions);
  }

  saveAgentData(body): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}/private/agent/save`, body, httpOptions);
  }

  updateAgentData(body): Observable<any> {
    return this.http.put(`${AppConfigConstants.baseUrl}/private/agent/update`, body, httpOptions);
  }

}
