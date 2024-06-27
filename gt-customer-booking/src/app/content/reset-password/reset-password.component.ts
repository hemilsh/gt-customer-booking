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
class ResetPassword {
    constructor(
        public oldPassword: string = '',
        public password: string = '',
        public confirmPassword: string = '',
    ) { }
}

@Component({
    templateUrl: 'reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    public newPasswordValidationMessage;
    public confirmPasswordValidationMessage;
    public isNewPasswordValidated: any;
    public isConfirmPasswordValidated: any;
    resetPasswordForm: FormGroup;
    resetPasswordModel: ResetPassword = new ResetPassword();
    passwordType = 'password';
    oldPasswordType = 'password';
    confirmPasswordType = 'password';
    @BlockUI() blockUI: NgBlockUI
    @BlockUI('resetPasswordBtn') resetPasswordBtn: NgBlockUI;
    @ViewChild('f', { read: true, static: false }) floatingLabelForm: NgForm;
    @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public http: HttpClient,
        private toastr: ToastrService) {
        this.resetPasswordForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required])
        });

    }



    ngOnInit() {
    }

    /**
   * This method is use to change password type
   */
    resetPasswordType() {
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
    resetConfirmPasswordType() {
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

    passwordCheck(password, type) {
        this.resetPasswordBtn.start();
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
                this.resetPasswordBtn.stop();
            }, error => {
                this.resetPasswordBtn.stop();
                console.log(Response);
            })
    }

    get f() { return this.resetPasswordForm.controls; }
    resetPasswordSubmit() {

        if (this.resetPasswordForm.invalid) {
            return;
        }
        this.resetPasswordBtn.start();
        this.http.post<any>(`${AppConfigConstants.baseUrl}/private/user/reset-password`, this.resetPasswordModel, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                    this.toastr.success(Response['message'], 'Success');
                    if (Response['code'] == 1047) {
                        this.router.navigate([]).then(result => { window.open(`${AppConfigConstants.adminUrl}`, '_self')});
                    } else {
                        this.router.navigate([AppUrlConstants.home]);
                    }
                } else if (Response['code'] == 2006) {
                } else {
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.resetPasswordBtn.stop();
            }, error => {
                this.resetPasswordBtn.stop();
                console.log(Response);
            })
    }

}
