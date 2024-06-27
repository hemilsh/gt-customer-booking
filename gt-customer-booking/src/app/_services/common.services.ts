import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppConfigConstants } from '../appconfig'
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loadDataURL = null;
  constructor(private http: HttpClient, private appConfig: AppConfigConstants,private toastr: ToastrService) {
    this.loadDataURL = null;
  }
  getCountryCodeData(): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/public/country/code`, httpOptions);
  }

  getCaptchaData(): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/public/captcha/generate-registration-captcha`, httpOptions);
  }

  getCountryData(): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/private/country/all`, httpOptions);
  }

  getStateData(id): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/private/state/all?countryId=` + id, httpOptions);
  }

  getCityData(id): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}/private/city/all?stateId=` + id, httpOptions);
  }
  isLogin() {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${AppConfigConstants.baseUrl}/private/user/is-loggedIn`, httpOptions)
      .subscribe(res => {
        if(res.code >= 1000 && res.code < 2000){
          localStorage.setItem("currentCustomerUser", JSON.stringify(res.view));
          return res;
        }else{
          return res;
        }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
      // resolve();
    }) 
  }
}
