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
class ChangePassword {
    constructor(
        public oldPassword: string = '',
        public password: string = '',
        public confirmPassword: string = '',
    ) { }
}

@Component({
    templateUrl: 'change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    public newPasswordValidationMessage;
    public confirmPasswordValidationMessage;
    public isNewPasswordValidated: any;
    public isConfirmPasswordValidated: any;
    changePasswordForm: FormGroup;
    changePasswordModel: ChangePassword = new ChangePassword();
    passwordType = 'password';
    oldPasswordType = 'password';
    confirmPasswordType = 'password';
    @BlockUI() blockUI: NgBlockUI
    @BlockUI('changePasswordBtn') changePasswordBtn: NgBlockUI;
    @ViewChild('f', { read: true, static: false }) floatingLabelForm: NgForm;
    @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public http: HttpClient,
        private toastr: ToastrService) {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required])
        });

    }



    ngOnInit() {
        this.blockUI.start();
        this.http.get(`${AppConfigConstants.baseUrl}/private/user/is-loggedIn`, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                } else if (Response['code'] == 2006) {
                } else if (Response['code'] != 2066 && Response['code'] != 2067) {
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.blockUI.stop();
            }, error => {
                this.blockUI.stop();
            })
    }
    passwordCheck(password, type) {
        this.changePasswordBtn.start();
        this.http.post<any>(`${AppConfigConstants.baseUrl}/public/user/validate-password`, { password: password }, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                    if (type == 'new') {
                        this.isNewPasswordValidated = true;
                    } else if (type == 'confirm') {
                        this.isConfirmPasswordValidated = true;
                    }
                } else if (Response['code'] == 2006) {
                } else if (Response.code == 2020 || Response.code == 2004) {
                    if (type == 'new') {
                        this.isNewPasswordValidated = false;
                        this.newPasswordValidationMessage = Response.message;
                    } else if (type == 'confirm') {
                        this.isConfirmPasswordValidated = false;
                        this.confirmPasswordValidationMessage = Response.message;
                    }
                } else if (Response.code == 2003) {
                } else {
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.changePasswordBtn.stop();
            }, error => {
                this.changePasswordBtn.stop();
                console.log(Response);
            })
    }
    /**
   * This method is use to change password type
   */
    changePasswordType() {
        if (document.getElementById("password").getAttribute("type") == 'text') {
            this.passwordType = 'password';
            document.getElementById("eyeIcon").classList.remove('fa-eye')
            document.getElementById("eyeIcon").classList.add('fa-eye-slash')
        }
        if (document.getElementById("password").getAttribute("type") == 'password') {
            this.passwordType = 'text';
            document.getElementById("eyeIcon").classList.add('fa-eye')
            document.getElementById("eyeIcon").classList.remove('fa-eye-slash')
        }
    }
    changeOldPasswordType() {
        if (document.getElementById("oldPassword").getAttribute("type") == 'text') {
            this.oldPasswordType = 'password';
            document.getElementById("oldEyeIcon").classList.remove('fa-eye')
            document.getElementById("oldEyeIcon").classList.add('fa-eye-slash')
        }
        if (document.getElementById("oldPassword").getAttribute("type") == 'password') {
            this.oldPasswordType = 'text';
            document.getElementById("oldEyeIcon").classList.add('fa-eye')
            document.getElementById("oldEyeIcon").classList.remove('fa-eye-slash')
        }
    }
    changeConfirmPasswordType() {
        if (document.getElementById("confirmPassword").getAttribute("type") == 'text') {
            this.confirmPasswordType = 'password';
            document.getElementById("confirmEyeIcon").classList.remove('fa-eye')
            document.getElementById("confirmEyeIcon").classList.add('fa-eye-slash')
        }
        if (document.getElementById("confirmPassword").getAttribute("type") == 'password') {
            this.confirmPasswordType = 'text';
            document.getElementById("confirmEyeIcon").classList.add('fa-eye')
            document.getElementById("confirmEyeIcon").classList.remove('fa-eye-slash')
        }
    }
    onLogout() {
        this.http.get<any>(`${AppConfigConstants.baseUrl}/private/user/logout`, httpOptions)
            .subscribe(res => {
                if (res.code >= 1000 && res.code < 2000) {
                    localStorage.removeItem('currentUser');
                    this.router.navigate([AppUrlConstants.home]);
                } else if (res.code != 2066 && res.code != 2067) {
                    this.toastr.error(res['message'], 'Error !');
                }

            }, err => {
                this.toastr.error(err.message, 'Error !');
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.changePasswordForm.controls; }
    changePasswordSubmit() {

        if (this.changePasswordForm.invalid) {
            return;
        }
        this.changePasswordBtn.start();
        this.http.post<any>(`${AppConfigConstants.baseUrl}/private/user/change-password`, JSON.stringify(this.changePasswordModel), httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                    this.router.navigate([AppUrlConstants.home]);
                } else if (Response['code'] == 2006) {
                } else {
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.changePasswordBtn.stop();
            }, error => {
                this.changePasswordBtn.stop();
                console.log(Response);
            })
    }

}
