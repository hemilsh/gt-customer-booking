import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { AppConfigConstants, AppUrlConstants } from 'src/app/appconfig';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ProfileEditService } from './profileedit.services';
import * as moment from "moment";
import { HttpClient } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as $ from 'jquery';
import { responseView } from 'src/app/_layout/classes/response.class';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
class ProfileModel {
  public id: string = '';
  public name: string = '';
  public email: string = '';
  public mobile: string = '';
  public countryCode: any = {};
  public address: string = '';
  public landmark: string = '';
  public countryView: any = {};
  public stateView: any = {};
  public cityView: any = {};
  public stateName: string = '';
  public cityName: string = '';
  public pincode: string = '';
  public profilepic: any = {};
  public gender: any = {};
  public birthDate: any = null;
  public file: string = '';
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
    this.email = view.email;
    this.mobile = view.mobile;
    this.countryCode = view.countryCode;
    this.gender = view.gender;
    this.birthDate = view.birthDate;
    this.address = view.address;
    this.landmark = view.landmark;
    this.countryView = view.countryView;
    this.stateView = view.stateView;
    this.cityView = view.cityView;
    this.stateName = view.stateName;
    this.cityName = view.cityName;
    this.pincode = view.pincode;
    this.profilepic = view.profilepic;
    this.file = view.file;
  }
}
@Component({
  selector: 'app-myprofileedit',
  templateUrl: './myprofileedit.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyProfileEditComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI
  @BlockUI('userAddEditBtn') userAddEditBtnBlockUI: NgBlockUI;
  profileModel: ProfileModel = new ProfileModel();
  profilePicList = [];
  userForm: any;
  imgURL = AppConfigConstants.baseUrl + AppConfigConstants.profileImagePath;
  public userId = null;
  @ViewChild('f', { read: true, static: false }) floatingLabelForm: NgForm;
  @ViewChild('vform', { read: true, static: false }) validationForm: FormGroup;
  countryViews: any;
  countryCodes: any;
  stateViews: any;
  cityViews: any;
  genderList: any;
  datePickerConfig = {
    format: 'DD/MM/YYYY'
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';
  viewCroppedImage: any = '';
  private imageName = '';
  public isShowCropper = false;
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageName = event.target.files[0].name;
    document.getElementById('openBoxModelId').click();
  }
  deleteImage(event: any): void {
    delete this.imageChangedEvent;
    delete this.imageName;
    this.isShowCropper = false;
  }
  closeCropper() {
    this.croppedImage = '';
    this.isShowCropper = false;
    delete this.profileModel.profilepic;
  }
  openCropper(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log('Closed')
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      if(this.profileModel.profilepic == undefined){
        this.isShowCropper = false;
      }else{
        // this.editCropper();
      }
      console.log('Dismissed')
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  editCropper(isModelOpen) {
    if (this.profileModel.file != undefined) {
      const imageBlob = this.dataURItoBlob(this.profileModel.file);
      this.imageChangedEvent = {};
      this.imageChangedEvent.target = {};
      this.imageChangedEvent.target.files = [];
      this.imageChangedEvent.target.files.push(new File([imageBlob], this.imageName, { type: 'image/jpeg' }));
    } else {
      const imageBlob = this.dataURItoBlob(this.croppedImage.split('data:image/jpeg;base64,')[1]);
      this.imageChangedEvent = {};
      this.imageChangedEvent.target = {};
      this.imageChangedEvent.target.files = [];
      this.imageChangedEvent.target.files.push(new File([imageBlob], this.imageName, { type: 'image/jpeg' }));
    }
      document.getElementById('openBoxModelId').click();
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private profileEditService: ProfileEditService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {
    this.userForm = this.formBuilder.group({
      id: new FormControl(null, []),
      name: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z ]$/), Validators.maxLength(100)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(15)]),
      countryCode: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      birthDate: new FormControl(null, [Validators.required]),
      address: new FormControl('', [Validators.maxLength(1000)]),
      landmark: new FormControl('', [Validators.maxLength(1000)]),
      countryView: new FormControl(null, []),
      stateView: new FormControl(null, []),
      cityView: new FormControl(null, []),

      stateName: new FormControl('', [Validators.maxLength(100)]),
      cityName: new FormControl('', [Validators.maxLength(100)]),
      pincode: new FormControl('', [Validators.pattern(/^[0-9]{6}\d*$/), Validators.maxLength(6)]),
    });
    if (this.route.snapshot.data['resolveValue']['view'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        let view = this.route.snapshot.data['resolveValue']['view'];
        if (view.file) {
          this.isShowCropper = true;
        }
        if (view.countryView != undefined) {
          this.findState(view.countryView);
        }
        this.croppedImage = 'data:image/jpeg;base64,' + view.file
        this.viewCroppedImage = 'data:image/jpeg;base64,' + view.file
        this.profileModel = new ProfileModel(view);
        this.profilePicList = [];
        this.profilePicList.push(this.profileModel.profilepic)
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue'].message, 'Error !');
      }
    }
  }
  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.loadCountryCode();
    this.loadCountries();
    this.loadGenderList();
    if (this.profileModel.birthDate != undefined) {
      var date = moment(this.profileModel.birthDate);
      this.profileModel.birthDate = date;
    }
  }

  /**
   * This method is used to load countries for dropdown.
   */
  loadGenderList() {
    this.blockUI.start();
    this.profileEditService.getGenderData().subscribe(response => {
      this.blockUI.stop();
      if (response.code >= 1000 && response.code < 2000) {
        this.genderList = response['list'];
      } else {
        this.toastr.error(response.message, 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load countries for dropdown.
   */
  loadCountries() {
    this.blockUI.start();
    this.profileEditService.getCountryData().subscribe(response => {
      this.blockUI.stop();
      if (response.code >= 1000 && response.code < 2000) {
        this.countryViews = response['list'];
      } else {
        this.toastr.error(response.message, 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load countries phone code for dropdown.
   */
  loadCountryCode() {
    this.blockUI.start();
    this.profileEditService.getCountryCodeData().subscribe(response => {
      this.blockUI.stop();
      if (response.code >= 1000 && response.code < 2000) {
        this.countryCodes = response['list'];
        if (this.profileModel.countryCode != undefined) {
          this.profileModel.countryCode = this.countryCodes.filter(x => x.key === this.profileModel.countryCode.key)[0];
        }
      } else {
        this.toastr.error(response.message, 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load states for dropdown.
   */
  findState(value) {
    this.blockUI.start();
    this.profileEditService.getStateData(value.key).subscribe(response => {
      this.blockUI.stop();
      if (response.code >= 1000 && response.code < 2000) {
        this.stateViews = response['list'];
      } else {
        this.toastr.error(response.message, 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  /**
   * This method is used to load cities for dropdown.
   */
  findCity(value) {
    this.blockUI.start();
    this.profileEditService.getCityData(value.key).subscribe(response => {
      this.blockUI.stop();
      if (response.code >= 1000 && response.code < 2000) {
        this.cityViews = response['list'];
      } else {
        this.toastr.error(response.message, 'Error !');
      }
    }, err => {
      this.toastr.error(err.message, 'Error !');
    });
  }

  autoFocusOnErrorField(formId) {
    if ($("#" + formId + " .ng-invalid").length != 0) {
      // console.log($("#" + formId + " .ng-invalid").first()[0].localName);
      if ($("#" + formId + " .ng-invalid").first()[0].localName != 'div') {
        console.log($("#" + formId + " .ng-invalid"))
        $("#" + formId + " .ng-invalid").first().focus();
        // $('div,html').animate({
        //   scrollTop: $($("#" + formId + " .ng-invalid").first()).offset().top - 110
        // }, 500, function () {
        // });
        $('.focusRed').removeClass('focusRed');
        $($("#" + formId + " .ng-invalid")[0]).addClass("focusRed");
      } else {
        // console.log($("#" + formId + " .ng-invalid"));
        for (var i = 0; i < $("#" + formId + " .ng-invalid").length; i++) {
          if ($("#" + formId + " .ng-invalid")[i].localName == 'div') {

          } else {
            console.log($("#" + formId + " .ng-invalid"))
            $("#" + formId + " .ng-invalid")[1].focus();
            $('div,html').animate({
              scrollTop: $($("#" + formId + " .ng-invalid")[1]).offset().top - 110
            }, 10, function () {
            });
            $('.focusRed').removeClass('focusRed');
            $($("#" + formId + " .ng-invalid")[1]).addClass("focusRed");
            return;
          }
        }
      }
    }
  }

  onSubmit(formId) {

    if (this.userForm.invalid) {
      this.autoFocusOnErrorField(formId);
      return;
    }
    if (this.profileModel.birthDate != undefined && (moment(this.profileModel.birthDate).isValid())) {
      var date = this.profileModel.birthDate.format('DD/MM/YYYY');
      this.profileModel.birthDate = date;
    }
    const body = JSON.stringify(this.profileModel);
    this.userAddEditBtnBlockUI.start();
    this.profileEditService.updateUserData(body).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        this.toastr.success(res.message, 'Success !');
        this.router.navigate([AppUrlConstants.profileModule + this.profileModel.id]);
      } else {
        this.toastr.error(res.message, 'Error !');
      }
      this.userAddEditBtnBlockUI.stop();
    }, err => {
      this.userAddEditBtnBlockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }

  onImageUpload() {
    if (this.croppedImage == '') {
      this.toastr.error("Please upload image", 'Error !');
      return;
    }
    if (this.imageName == '' && this.profileModel.profilepic.name != undefined) {
      this.imageName = this.profileModel.profilepic.name;
    }
    const imageBlob = this.dataURItoBlob(this.croppedImage.split('data:image/jpeg;base64,')[1]);
    const imageFile = new File([imageBlob], this.imageName, { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', imageFile);

    this.userAddEditBtnBlockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl + AppConfigConstants.uploadProfilePic}`, formData).subscribe((res: responseView) => {
      if (res['code'] >= 1000 && res['code'] < 2000) {
        this.profilePicList = [];
        this.profilePicList.push(res.view)
        this.profileModel.profilepic = res['view'];
        this.isShowCropper = true;
        document.getElementById('closeModel').click();
      } else {
        this.toastr.error(res['message'], 'Error !');
      }
      this.userAddEditBtnBlockUI.stop();
    }, err => {
      this.userAddEditBtnBlockUI.stop();
      this.toastr.error(err.message, 'Error !');
    });
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  openChoseImage() {

    document.getElementById('inputGroupFile02')['value'] = "";
    document.getElementById('inputGroupFile02').click();
  }
}
