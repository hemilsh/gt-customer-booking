import { Component, OnInit, ViewChild } from '@angular/core';
import * as Long from 'long';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { CommonService } from 'src/app/_services/common.services';
import { HeaderService } from './header.services';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/_services/share.services';
import { DataService } from 'src/app/_services/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true
};
/**
 * This is captcha model file.
 */
class captcha {
  public captcha: string = '';
  constructor(view: any = {}) {
    if (view.name) {
      this.captcha = view.captcha;
    }
  }
}

/**
 * This is OTP model file.
 */
class OTP {
  public verificaitionOtp: string = '';
  constructor(
    view: any = {}
  ) {
    this.verificaitionOtp = view.verificaitionOtp;
  }
}
/**
 * This is forget password model file.
 */
class ForgetPassword {
  public loginId: string = '';
  constructor(
    view: any = {}
  ) {
    this.loginId = view.loginId;
  }
}
/**
 * This is change password model file.
 */
class ChangePassword {
  public oldPassword: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  constructor(
    view: any = {}
  ) {
    this.oldPassword = view.oldPassword;
    this.password = view.password;
    this.confirmPassword = view.confirmPassword;
  }
}
/**
 * This is login model file.
 */
class Login {
  public loginId: string = '';
  public password: string = '';
  constructor(
    view: any = {}
  ) {
    this.loginId = view.loginId;
    this.password = view.password;
  }
}
/**
 * This is user model file.
 */
class User {
  public id: Long = new Long(null);
  public name: string = '';
  public shortFormOfName: string = '';
  public email: string = '';
  public countryCode: any = {};
  public mobile: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public captchaView: captcha = new captcha();
  constructor(
    view: any = {}
  ) {
    this.id = view.id;
    this.name = view.name;
    this.shortFormOfName = view.shortFormOfName;
    this.email = view.email;
    this.password = view.password;
    this.confirmPassword = view.confirmPassword;
    if (view.countryCode != null) {
      this.countryCode = view.countryCode;
    }
    this.mobile = view.mobile;

    if (view.captchaView != null) {
      this.captchaView = new captcha();
      this.captchaView.captcha = view.captchaView.captcha;
    } else {
      this.captchaView = new captcha();
    }
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('loginBtn') loginBtnBlockUI: NgBlockUI
  @BlockUI('signUpBtn') signUpBtnBlockUI: NgBlockUI
  @BlockUI('otpBtn') otpBtnBlockUI: NgBlockUI
  @BlockUI('forgetPasswordBtn') forgetPasswordBtnBlockUI: NgBlockUI
  @BlockUI('changePasswordBtn') changePasswordBtnBlockUI: NgBlockUI
  userForm: any;
  isChangePasswordFormSubmitted = false;
  currentCustomerUser: any;
  loginForm: any;
  otpForm: any;
  forgetPasswordForm: any;
  changePasswordForm: any;
  countryCodes: any;
  activeSection: any = 1;
  isHomePage: boolean = false;
  passwordType = 'password';
  oldPasswordType = 'password';
  confirmPasswordType = 'password';
  public newPasswordValidationMessage;
  public confirmPasswordValidationMessage;
  public isNewPasswordValidated: any;
  public isConfirmPasswordValidated: any;
  // @ViewChild(NgbModal, { static: true }) table: NgbModal;
  @ViewChild('f', { read: true, static: false }) floatingLabelForm: NgForm;
  @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
  userModel: User = new User();
  loginModel: Login = new Login();
  otpModel: OTP = new OTP();
  forgetPasswordModel: ForgetPassword = new ForgetPassword();
  changePasswordModel: ChangePassword = new ChangePassword();
  capchaImageDownloadUrl = AppConfigConstants.baseUrl + AppConfigConstants.downloadCaptchaImage;
  capchaId = '';
  captchaList = [];
  message: string;

  termsUrl = '/'+AppUrlConstants.termsAndConditionUrl;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private headerServices: HeaderService,
    private router: Router,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private data: DataService,
    public http: HttpClient
  ) {
    this.userForm = this.formBuilder.group({
      id: new FormControl(null, []),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z .]+$/), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/), Validators.maxLength(100)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(/[0-9]\d*$/), Validators.maxLength(15)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      countryCode: new FormControl(null, [Validators.required]),

      captchaView: this.formBuilder.group({
        captcha: new FormControl('', [Validators.required]),
      }),
    });

    this.loginForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.otpForm = this.formBuilder.group({
      verificaitionOtp: new FormControl('', [Validators.required]),
    });

    this.forgetPasswordForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required]),
    });
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
    if (localStorage.getItem('currentCustomerUser') != undefined && localStorage.getItem('currentCustomerUser') != null) {
      this.currentCustomerUser = JSON.parse(localStorage.getItem('currentCustomerUser'));
    }
    this.data.currentMessage.subscribe(message => {
      if (message == 'delete') {
        delete this.currentCustomerUser;
      }
    });
  }
  /**
   * This is form controll which help to fire validation for registration.
   */
  get f() { return this.userForm.controls; }

  /**
   * This is form controll which help to fire validation for login.
   */
  get l() { return this.loginForm.controls; }

  /**
   * This is form controll which help to fire validation for otp.
   */
  get o() { return this.otpForm.controls; }
  /**
   * This is form controll which help to fire validation for forget Password.
   */
  get fp() { return this.forgetPasswordForm.controls; }
  /**
   * This is form controll which help to fire validation for forget Password.
   */
  get cp() { return this.changePasswordForm.controls; }

  ngOnInit() {
    if (localStorage.getItem('currentCustomerUser') == null) {
      this.loadCountryCode();
      this.loadCaptcha();
    }
    this.userModel.countryCode = { value: "+91 - India", key: 91 }
    // this.data.currentMessage.subscribe(message => this.message = message)
    if (this.router.url == '/') {
      this.isHomePage = true;
    } else {
      this.isHomePage = false;
    }
  }
  newMessage() {
    this.data.changeMessage(this.currentCustomerUser)
  }
  /**
   * This method is used to load countries phone code for dropdown.
   */
  loadCountryCode() {
    this.blockUI.start();
    this.commonService.getCountryCodeData().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.countryCodes = response['list'];
      } else {
        this.toastr.error(response.message, 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      // this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load capcha for dropdown.
   */
  loadCaptcha() {
    this.blockUI.start();
    this.commonService.getCaptchaData().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.captchaList = [];
        this.captchaList.push(response['view']);
        this.capchaId = response['view'].id;
      } else {
        this.toastr.error(response.message, 'Error !');
      }
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      // this.toaster.show('error', 'Error!', err);
    });
  }

  /**
   * This method is use to log user
   * @param formId 
   */
  onLogin(formId) {

    if (this.loginForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = JSON.stringify(this.loginModel);
    this.loginBtnBlockUI.start();
    this.headerServices.loginUser(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.http.get(`${AppConfigConstants.baseUrl}/private/user/is-loggedIn`, httpOptions)
            .subscribe(Response => {
                if (Response['code'] >= 1000 && Response['code'] < 2000) {
                  localStorage.setItem("currentCustomerUser", JSON.stringify(res.view));
                  this.currentCustomerUser = res.view;
                  this.data.changeMessage(res.view)
                  this.sharedService.setOption('currentCustomerUser', true);
                  //   this.router.navigateByUrl(this.router.url, { skipLocationChange: true }).then(() => {
                  //     this.router.navigate([this.router.url]);
                  // }); 
                  // this.router.navigate([AppUrlConstants.profileModule+res.view.id]);
                  this.closeLogin()
                } else if (Response['code'] == 2006) {
                } else if(Response['code'] != 2066 && Response['code'] != 2067){
                    this.toastr.error(Response['message'], 'Error !');
                }
                this.loginBtnBlockUI.stop();
            }, error => {
              this.loginBtnBlockUI.stop();
            })
      } else {
        delete this.currentCustomerUser;
        this.toastr.error(res.message, 'Error !');
      }
      this.loginBtnBlockUI.stop();
    }, err => {
      this.loginBtnBlockUI.stop();
    });

  }
  /**
   * This method  is use to check password is valid or not
   * @param password 
   */
  passwordCheck(password, type) {
    this.signUpBtnBlockUI.start();
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
            this.signUpBtnBlockUI.stop();
        }, error => {
            this.signUpBtnBlockUI.stop();
            console.log(Response);
        })
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
  /**
   * This method is use to register user
   * @param formId 
   */
  onRegister(formId) {
    if (this.userForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = JSON.stringify(this.userModel);
    this.signUpBtnBlockUI.start();
    this.headerServices.registerUser(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.closeSignup();
        this.openOtp();
        this.toastr.success(res.message, 'Success');
        // this.router.navigate([AppUrlConstants.userModule]);
      } else {
        this.loadCaptcha();
        this.toastr.error(res.message, 'Error !');
      }
      this.signUpBtnBlockUI.stop();
    }, err => {
      this.signUpBtnBlockUI.stop();
    });

  }

  /**
   * This method is use to verify otp
   * @param formId 
   */
  onOtp(formId) {
    if (this.otpForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = JSON.stringify(this.otpModel);
    this.otpBtnBlockUI.start();
    this.headerServices.otpVerification(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.closeOtp()
        this.toastr.success(res.message, 'Success');
        this.headerServices.is_LoggedIn().subscribe(res => {
          if (res.code >= 1000 && res.code < 2000) {
            localStorage.setItem("currentCustomerUser", JSON.stringify(res.view));
            this.currentCustomerUser = res.view;
            this.data.changeMessage(res.view)
            this.sharedService.setOption('currentCustomerUser', true);
          } else {
            this.toastr.error(res.message, 'Error !');
          }
          this.otpBtnBlockUI.stop();
        }, err => {
          this.otpBtnBlockUI.stop();
        });
      } else {
        this.toastr.error(res.message, 'Error !');
      }
      this.otpBtnBlockUI.stop();
    }, err => {
      this.otpBtnBlockUI.stop();
    });

  }

  /**
   * This method is use to change password
   * @param formId 
   */
  onChangePassword(formId) {
    this.isChangePasswordFormSubmitted = true;
    if (this.changePasswordForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = JSON.stringify(this.changePasswordModel);
    this.changePasswordBtnBlockUI.start();
    this.headerServices.changePassword(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.closeChangePassword();
        localStorage.removeItem('currentCustomerUser');
        delete this.currentCustomerUser;
        this.router.navigate([AppUrlConstants.home]);
      } else {
        this.toastr.error(res.message, 'Error !');
      }
      this.isChangePasswordFormSubmitted = false;
      this.changePasswordBtnBlockUI.stop();
    }, err => {
      this.isChangePasswordFormSubmitted = false;
      this.changePasswordBtnBlockUI.stop();
    });

  }
  /**
   * This method is use to forget password
   * @param formId 
   */
  onForgetPassword(formId) {
    if (this.forgetPasswordForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    const body = JSON.stringify(this.forgetPasswordModel);
    this.forgetPasswordBtnBlockUI.start();
    this.headerServices.forgetPassword(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.closeForgetPassword()
        this.toastr.success(res.message, 'Success');
        // this.router.navigate([AppUrlConstants.userModule]);
      } else {
        this.toastr.error(res.message, 'Error !');
      }
      this.forgetPasswordBtnBlockUI.stop();
    }, err => {
      this.forgetPasswordBtnBlockUI.stop();
    });

  }
  /**
   * This method is use to logout
   */
  onLogout() {
    this.blockUI.start();
    this.headerServices.logout().subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        localStorage.removeItem("currentCustomerUser");
        this.sharedService.setOption('currentCustomerUser', false);
        this.router.navigate([AppUrlConstants.home]);
        this.data.changeMessage(null)
        delete this.currentCustomerUser;
        //   this.router.navigateByUrl(this.router.url, { skipLocationChange: true }).then(() => {
        //     this.router.navigate([this.router.url]);
        // }); 
      } else {
        this.toastr.error(res.message, 'Error !');
      }
      this.closeNav();
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
    });

  }

  goToHotelBookingDetails() {
    document.getElementById("myNav").style.width = "0%";
    this.router.navigate([AppUrlConstants.bookingDetailsUrl]);
  }
  openMonthlyVacantReport() {
    this.router.navigate([AppUrlConstants.monthlyVacantReportModule]);
  }
  openTermsAndCondition() {
    this.router.navigate([AppUrlConstants.termsAndConditionUrl]);
  }
  goToTourBookingDetails() {
    document.getElementById("myNav").style.width = "0%";
    this.router.navigate([AppUrlConstants.tourModule+"/"+AppUrlConstants.tourBookingDetailsUrl]);
  }
  goToCarBookingDetails() {
    document.getElementById("myNav").style.width = "0%";
    this.router.navigate([AppUrlConstants.carModule+"/"+AppUrlConstants.carBookingDetailsUrl]);
  }
  openNav() {
    document.getElementById("myNav").style.width = "100%";
  }

  closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }
  
  openLogin() {
    
    document.getElementById("login").style.width = "100%";
  }

  closeLogin() {
    document.getElementById("login").style.width = "0%";
  }
  openSignup() {
    document.getElementById("signup").style.width = "100%";
  }

  closeSignup() {
    document.getElementById("signup").style.width = "0%";
  }
  openOtp() {
    document.getElementById("otp").style.width = "100%";
  }

  closeOtp() {
    document.getElementById("otp").style.width = "0%";
  }
  openForgetPassword() {
    document.getElementById("forgetPassword").style.width = "100%";
  }
  
  closeForgetPassword() {
    document.getElementById("forgetPassword").style.width = "0%";
  }

  openChangePassword() {
    this.isChangePasswordFormSubmitted = false;
    document.getElementById("changePassword").style.width = "100%";
  }

  closeChangePassword() {
    document.getElementById("changePassword").style.width = "0%";
  }
  /**
   * This method is use to change password type
   */
  // changePasswordType() {
  //   if (document.getElementById("password").getAttribute("type") == 'text') {
  //     this.passwordType = 'password';
  //     document.getElementById("eyeIcon").classList.remove('fa-eye')
  //     document.getElementById("eyeIcon").classList.add('fa-eye-slash')
  //   }
  //   if (document.getElementById("password").getAttribute("type") == 'password') {
  //     this.passwordType = 'text';
  //     document.getElementById("eyeIcon").classList.add('fa-eye')
  //     document.getElementById("eyeIcon").classList.remove('fa-eye-slash')
  //   }
  // }
  mouseEnterEvent(tab, length) {
    this.activeSection = tab;
    for (let i = 1; i < length; i++) {
      if (i == tab) {
        document.getElementById('boxlink' + tab).classList.remove('display-none');
      } else {
        document.getElementById('boxlink' + i).classList.add('display-none');
      }
    }
  }
  
  showProfile() {
    document.getElementById("myNav").style.width = "0%";
    this.router.navigate([AppUrlConstants.profileModule + this.currentCustomerUser.id]);
  }
}
