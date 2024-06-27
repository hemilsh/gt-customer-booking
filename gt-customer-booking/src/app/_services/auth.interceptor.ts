import { Observable, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, catchError } from "rxjs/operators";
import { AppUrlConstants } from '../appconfig';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @BlockUI() blockUI: NgBlockUI
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private data: DataService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true,
      // headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
    return next.handle(request).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            if (event.body.code == 2037) {
              this.blockUI.stop();
              this.router.navigateByUrl(AppUrlConstants.home);
              this.toastr.error(event.body.message, 'Error !');
              this.data.changeMessage('delete');
              localStorage.removeItem('currentCustomerUser');
            } else if (event.body.code == 2000) {
              this.blockUI.stop();
              this.router.navigateByUrl(AppUrlConstants.internalServerError);
            } else if (event.body.code == 2030) {
              this.blockUI.stop();
              this.router.navigateByUrl(AppUrlConstants.forbidden);
              // this.toastr.error(event.body.message, 'Error !');
            } else if (event.body.code == 2029) {
              this.blockUI.stop();
              this.router.navigateByUrl(AppUrlConstants.login);
              if(localStorage.getItem('currentCustomerUser') != undefined){
                localStorage.removeItem('currentCustomerUser');
              }
              this.data.changeMessage('delete');
            } else if (event.body.code == 2010) {
              this.blockUI.stop();
              this.toastr.error(event.body.message, 'Error !');
              this.router.navigateByUrl(AppUrlConstants.otpModule);
            } else if (event.body.code == 2066) {
              this.blockUI.stop();
              this.toastr.error(event.body.message, 'Error !');
              this.router.navigateByUrl(AppUrlConstants.changePasswordModule);
            
            } else if (event.body.code == 2067) {
              this.blockUI.stop();
              this.toastr.error(event.body.message, 'Error !');
              this.router.navigateByUrl(AppUrlConstants.changePasswordModule);
            } else if (event.body.code == 2027) {
              this.blockUI.stop();
              this.toastr.error(event.body.message, 'Error !');
              this.router.navigateByUrl(AppUrlConstants.otpModule);
            }
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            console.log("api call error :", event);
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 0) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.error);
        }
        if (error.status == 404) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.pageNotFound);
        }
        else if (error.status == 500) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.internalServerError);
        }
        else if (error.status == 503) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.serviceUnavailable);
        }
        else if (error.status == 401) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.unauthorized);
        }
        else if (error.status == 403) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.forbidden);
        }
        else if (error.status == 502) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.badgateway);
        }
        else if (error.status == 400) {
          this.blockUI.stop();
          this.router.navigateByUrl(AppUrlConstants.badrequest);
        }
        let errMsg = '';
        // Client Side Error
        if (error.error instanceof ErrorEvent) {
          errMsg = `Error: ${error.error.message}`;
          console.log(errMsg)
        }
        else {  // Server Side Error
          errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          console.log(errMsg)
        }
        return throwError(errMsg);
      })
    );
  }
}