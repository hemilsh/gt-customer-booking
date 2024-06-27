import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppConfigConstants } from 'src/app/appconfig';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  loadDataURL = null;
  constructor(private http: HttpClient) {
    this.loadDataURL = null;
  }
  registerUser(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}public/user/customer-registration`, json,httpOptions);
  }
  loginUser(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}public/user/login`, json,httpOptions);
  }
  otpVerification(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}private/user/activate-through-otp`, json,httpOptions);
  }
  forgetPassword(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}public/user/send-reset-link`, json,httpOptions);
  }
  changePassword(json): Observable<any> {
    return this.http.post(`${AppConfigConstants.baseUrl}private/user/change-password`, json,httpOptions);
  }
  logout(): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}private/user/logout`,httpOptions);
  }
  is_LoggedIn(): Observable<any> {
    return this.http.get(`${AppConfigConstants.baseUrl}private/user/is-loggedIn`,httpOptions);
  }

}
