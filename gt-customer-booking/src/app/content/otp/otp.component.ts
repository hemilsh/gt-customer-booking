import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrlConstants, AppConfigConstants } from '../../appconfig';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true
};
class otp {
    constructor(
        public verificaitionOtp: string = '',
    ) { }
}

@Component({
    templateUrl: 'otp.component.html',
    styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

    otpForm: FormGroup;
    otpModel: otp = new otp();
    passwordType = 'password';
    oldPasswordType = 'password';
    confirmPasswordType = 'password';
    @BlockUI() blockUI: NgBlockUI
    @BlockUI('otpBtn') otpBtn: NgBlockUI;
    @ViewChild('f', { read: true, static: false }) floatingLabelForm: NgForm;
    @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public http: HttpClient,
        private toastr: ToastrService) {
        this.otpForm = this.formBuilder.group({
            verificaitionOtp: new FormControl('', [Validators.required]),
        });

    }



    ngOnInit() {
        this.blockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}/private/user/is-loggedIn`, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                } else if (Response['code'] == 2006) {
                } else if(Response['code'] != 2066 && Response['code'] != 2067){
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.blockUI.stop();
            }, error => {
                this.blockUI.stop();
            })
    }
    onLogout() {
        this.http.get<any>(`${AppConfigConstants.baseUrl}/private/user/logout`, httpOptions)
        .subscribe(res => {
          if(res.code >= 1000 && res.code < 2000){
            localStorage.removeItem('currentUser');
            this.router.navigate([AppUrlConstants.home]);
          }else if(res.code != 2066 && res.code != 2067){
            this.toastr.error(res['message'], 'Error !');
        }
        
    }, err => {
        this.toastr.error(err.message, 'Error !');
      });
    }

    get f() { return this.otpForm.controls; }
    resendCode() {
        this.otpBtn.start();
        this.http.get(`${AppConfigConstants.baseUrl}/private/user/resent-activation-otp`)
            .subscribe(res => {
                if (res['code'] >= 1000 && res['code'] < 2000) {
                    this.toastr.success(res['message'], 'Success');
                } else {
                    this.toastr.error(res['message'], 'Error !');
                }
                this.otpBtn.stop();
            }, err => {
                this.otpBtn.stop();
            });
    
    }
    otpSubmit() {

        if (this.otpForm.invalid) {
            return;
        }
        this.otpBtn.start();
        this.http.post<any>(`${AppConfigConstants.baseUrl}/private/user/activate-through-otp`,this.otpModel, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                    this.http.get(`${AppConfigConstants.baseUrl}/private/user/is-loggedIn`, httpOptions)
                .subscribe(res => {
                  if (res['code'] >= 1000 && res['code'] < 2000) {
                    localStorage.setItem("currentCustomerUser", JSON.stringify(res['view']));
                    this.router.navigate([AppUrlConstants.home]);
                  } else {
                    this.toastr.error(res['message'], 'Error !');
                  }
                }, err => {
                    this.toastr.error(err['message'], 'Error !');

                  });
                } else if (Response['code'] == 2006) {
                } else {
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.otpBtn.stop();
            }, error => {
                this.otpBtn.stop();
                console.log(Response);
            })
    }

}
